import solid from 'solid-auth-client';
import N3 from 'n3';
import solidLDflex from '@solid/query-ldflex';
import unique from 'unique';
import { solidResponse, SolidError } from '@utils';
import defaultShape from '../shapes/notification.json';

const PREFIXES = {
  terms: 'https://www.w3.org/ns/solid/terms#',
  schema: 'http://www.w3.org/2000/01/rdf-schema#',
  things: 'https://schema.org/Thing#',
  ns: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  acl: 'http://www.w3.org/ns/auth/acl#'
};

export class Notification {
  constructor(owner, inboxRoot, shape = defaultShape) {
    if (Notification.instance) {
      console.log(owner, inboxRoot);
      return Notification.instance;
    }
    Notification.instance = this;
    this.shape = shape;
    this.owner = owner;
    this.inboxRoot = inboxRoot;
    this.schema = null;
  }

  /**
   * We are checking if user has inbox reference on card also if inbox folder exists.
   * @param path
   * @returns {Promise<*|boolean>}
   */
  hasInbox = async path => {
    const result = await solid.fetch(path, { method: 'GET' });
    let inboxList = [];
    for await (const inbox of solidLDflex[this.owner]['ldp:inbox']) {
      inboxList = [...inboxList, inbox.value];
    }
    return result.ok && inboxList.includes(path);
  };
  /**
   * Delete inbox folder and ldp on user card
   * @returns {Promise<*>}
   */

  deleteInbox = async () => {
    try {
      await solid.fetch(`${this.inboxRoot}`, { method: 'DELETE' });

      await solidLDflex[this.owner]['ldp:inbox'].delete(this.inboxRoot);

      return solidResponse(200, 'Inbox was deleted');
    } catch (error) {
      throw new SolidError(error.message, 'Delete Inbox', 500);
    }
  };
  /**
   * Create inbox container with default permissions
   * @param inboxRoot
   * @param owner
   * @returns {Promise<*>}
   */

  createInbox = async () => {
    try {
      const hasInbox = await this.hasInbox(this.inboxRoot);

      if (hasInbox) return;
      const termFactory = N3.DataFactory;
      const { namedNode } = termFactory;
      const writer = new N3.Writer({
        prefixes: {
          ns: PREFIXES.ns,
          foaf: PREFIXES.foaf,
          acl: PREFIXES.acl
        },
        format: 'text/turtle'
      });

      writer.addQuad(namedNode('#owner'), namedNode('ns:type'), namedNode('acl:Authorization'));

      writer.addQuad(namedNode('#owner'), namedNode('acl:agent'), namedNode(this.owner));

      writer.addQuad(namedNode('#owner'), namedNode('acl:accessTo'), namedNode('./'));

      writer.addQuad(namedNode('#owner'), namedNode('acl:defaultForNew'), namedNode('./'));

      writer.addQuad(
        namedNode('#owner'),
        namedNode('acl:mode'),
        namedNode('acl:Read, acl:Write, acl:Control')
      );

      writer.addQuad(namedNode('#public'), namedNode('ns:type'), namedNode('acl:Authorization'));

      writer.addQuad(
        namedNode('#public'),
        namedNode('acl:agentClass'),
        namedNode('http://xmlns.com/foaf/0.1/Agent')
      );

      writer.addQuad(namedNode('#public'), namedNode('acl:accessTo'), namedNode('./'));

      writer.addQuad(namedNode('#public'), namedNode('acl:defaultForNew'), namedNode('./'));

      writer.addQuad(namedNode('#public'), namedNode('acl:mode'), namedNode('acl:Append'));

      await writer.end(async (error, result) => {
        if (error) {
          throw error;
        }

        await solid.fetch(`${this.inboxRoot}.dummy`, { method: 'PUT' });

        await solid.fetch(`${this.inboxRoot}.dummy`, { method: 'DELETE' });

        await solid.fetch(`${this.inboxRoot}.acl`, {
          method: 'PUT',
          body: result,
          headers: {
            'Content-Type': 'text/turtle'
          }
        });
      });

      await solidLDflex[this.owner]['ldp:inbox'].add(namedNode(this.inboxRoot));
      return solidResponse(200, 'Inbox was created');
    } catch (error) {
      throw new SolidError(error.message, 'Inbox', 500);
    }
  };

  /**
   * Fetch shape object that will be use it to build notifications and also
   * to know how we need to render it.
   * @param file
   * @returns {Promise<void>}
   */
  fetchNotificationShape = async file => {
    try {
      /**
       * if shape comes like object will return the object instead of make a fetch request
       */
      if (typeof file === 'object') {
        this.schema = file;
        return;
      }

      const result = await fetch(file);
      const schema = await result.json();

      this.schema = schema;
    } catch (error) {
      throw new SolidError(error.message, 'Fetch Shape', error.status);
    }
  };
  /**
   * create and send notification to user inbox
   * @param inboxRoot
   * @param title
   * @param content
   * @param options
   * @returns {Promise<*>}
   */

  create = async (content = {}, to) => {
    try {
      const notificationName = unique();
      const notificationPath = `${to || this.inboxRoot}${notificationName}.ttl`;
      const termFactory = N3.DataFactory;
      const { namedNode, literal } = termFactory;

      if (!this.schema) {
        await this.fetchNotificationShape(this.shape);
      }

      if (!this.schema['@context']) {
        throw new SolidError('Schema does not have context', 'Notification', 500);
      }

      const { '@context': context, shape } = this.schema;

      const writer = new N3.Writer({
        prefixes: context,
        format: 'text/turtle'
      });

      shape.forEach(item => {
        if (item.property && item.property.includes(':')) {
          const defaultValue = item.value;

          if (content[item.label] || defaultValue || item.label === 'read') {
            const value = item.label === 'read' ? false : content[item.label];
            writer.addQuad(
              namedNode(notificationPath),
              namedNode(`${context[item.property.split(':')[0]]}${item.label}`),
              literal(defaultValue || value)
            );
          }
        } else {
          throw new SolidError('Schema do not have property', 'Notification', 500);
        }
      });

      await writer.end(async (error, result) => {
        if (error) {
          throw error;
        }

        await solid.fetch(notificationPath, {
          method: 'PUT',
          body: result,
          headers: {
            'Content-Type': 'text/turtle'
          }
        });
      });
      return solidResponse(200, 'Notification was created');
    } catch (error) {
      throw new SolidError(error.message, 'Notification', error.status);
    }
  };

  /**
   * Mark has read notifications
   * @param notificationPath
   * @returns {Promise<*>}
   */
  markAsRead = async notificationPath => {
    try {
      await solidLDflex[notificationPath]['https://www.w3.org/ns/activitystreams#read'].set(true);

      return solidResponse(200, 'Notification was updated');
    } catch (error) {
      throw new SolidError(error.message, 'Notification', error.status);
    }
  };

  /**
   * Delete notification file from inbox folder and container list
   * @param filename
   * @param inboxRoot
   * @returns {Promise<*>}
   */
  delete = async (filename, inboxRoot) => {
    try {
      /**
       * Delete file into inbox folder
       */
      await solid.fetch(`${inboxRoot}/${filename}`, { method: 'DELETE' });
      /**
       * Delete file name into inbox file list[contains]
       */
      await solidLDflex[inboxRoot]['ldp:contains'].delete(filename);

      return solidResponse(200, 'Notification was deleted it');
    } catch (error) {
      throw new SolidError(error.message, 'Notification Delete', error.status);
    }
  };

  getPredicate = field => {
    const prefix = field.property.split(':')[0];
    const ontology = this.schema['@context'][prefix];
    return `${ontology}${field.label}`;
  };

  fetch = async () => {
    try {
      console.log('Class fetch');
      if (!this.schema) await this.fetchNotificationShape(this.shape);
      const inbox = await solidLDflex[this.inboxRoot];
      console.log('Inbox', inbox);
      let notificationPaths = [];
      let notifications = [];
      for await (const path of inbox['ldp:contains']) {
        notificationPaths = [...notificationPaths, path.value];
      }
      console.log('Notifications Paths', notificationPaths);

      for await (const path of notificationPaths) {
        const turtleNotification = await solidLDflex[path];
        const id = path
          .split('/')
          .pop()
          .split('.')[0];
        let notificationData = id !== '' ? { id } : {};
        for await (const field of this.schema.shape) {
          const data = await turtleNotification[this.getPredicate(field)];
          const value = data ? data.value : null;
          notificationData = value
            ? { ...notificationData, [field.label]: value }
            : notificationData;
        }

        notifications =
          Object.keys(notificationData).length > 0
            ? [...notifications, notificationData]
            : notifications;
      }
      return notifications;
    } catch (error) {
      throw new SolidError(error.message, 'Notification Fetch', error.status);
    }
  };
}