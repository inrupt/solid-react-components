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
  constructor(owner) {
    if (Notification.instance) {
      return Notification.instance;
    }
    this.shape = defaultShape;
    this.owner = owner;
    this.schema = null;
    this.shapeName = 'default';
    Notification.instance = this;
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

  deleteInbox = async inbox => {
    try {
      await solid.fetch(`${inbox}`, { method: 'DELETE' });

      await solidLDflex[this.owner]['ldp:inbox'].delete(inbox);

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

  createInbox = async (inboxPath, appPath) => {
    try {
      const hasInbox = await this.hasInbox(inboxPath);
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

        await solid.fetch(`${inboxPath}.dummy`, { method: 'PUT' });

        await solid.fetch(`${inboxPath}.dummy`, { method: 'DELETE' });

        await solid.fetch(`${inboxPath}/inbox.acl`, {
          method: 'PUT',
          body: result,
          headers: {
            'Content-Type': 'text/turtle'
          }
        });
      });

      await solidLDflex[appPath]['ldp:inbox'].add(namedNode(inboxPath));

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
  fetchNotificationShape = async (file, name) => {
    try {
      /**
       * if shape comes like object will return the object instead of make a fetch request
       */
      if (typeof file === 'object') {
        this.schema = {
          ...this.schema,
          [name]: file
        };
        return;
      }
      const result = await fetch(file);
      const schema = await result.json();

      this.schema = {
        ...this.schema,
        [name]: schema
      };
    } catch (error) {
      throw new SolidError(error.message, 'Fetch Shape', error.status);
    }
  };

  buildShapeObject = shape => {
    return {
      name: (shape && shape.name) || this.shapeName,
      shape: (shape && shape.path) || this.shape
    };
  };

  /**
   * create and send notification to user inbox
   * @param inboxRoot
   * @param title
   * @param content
   * @param options
   * @returns {Promise<*>}
   */

  create = async (content = {}, to, options) => {
    try {
      const currentShape = this.buildShapeObject(options && options.shape);
      const { name, shape: defaultShape } = currentShape;
      const notificationName = unique();
      const notificationPath = `${to}${notificationName}.ttl`;
      const termFactory = N3.DataFactory;
      const { namedNode, literal } = termFactory;

      if (!this.schema || (this.schema && !this.schema[name])) {
        await this.fetchNotificationShape(defaultShape, name);
      }
      if (!this.schema[name]['@context']) {
        throw new SolidError('Schema does not have context', 'Notification', 500);
      }

      const { '@context': context, shape } = this.schema[name];

      const writer = new N3.Writer({
        prefixes: context,
        format: 'text/turtle'
      });

      shape.forEach(item => {
        if (item.property && item.property.includes(':')) {
          const defaultValue = item.value;

          if (
            content[item.label] ||
            defaultValue ||
            item.label === 'read' ||
            item.label === 'sent'
          ) {
            /**
             * Add read by default on notification document
             * @type {string}
             */
            let value = item.label === 'read' ? 'false' : content[item.label];
            /**
             * Add send time by default on notification document
             * @type {string}
             */
            value = item.label === 'sent' ? new Date().toISOString() : value;
            /**
             * Check if object from schema is a literal or node value
             */
            const typedValue = item.type === 'NamedNode' ? namedNode(value) : literal(value);
            writer.addQuad(
              namedNode(notificationPath),
              namedNode(`${context[item.property.split(':')[0]]}${item.label}`),
              typedValue
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
      await solidLDflex[notificationPath]['as:read'].set('true');

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
  delete = async file => {
    try {
      /**
       * Delete file into inbox folder by default will delete the reference on inbox container
       */
      await solid.fetch(file, { method: 'DELETE' });

      return solidResponse(200, 'Notification was deleted it');
    } catch (error) {
      throw new SolidError(error.message, 'Notification Delete', error.status);
    }
  };

  getPredicate = (field, shapeName) => {
    const prefix = field.property.split(':')[0];
    const ontology = this.schema[shapeName]['@context'][prefix];
    return `${ontology}${field.label}`;
  };

  discoveryInbox = async document => {
    try {
      const user = await solidLDflex[document];
      const inbox = await user['ldp:inbox'];

      return inbox && inbox.value;
    } catch (error) {
      throw error;
    }
  };

  fetch = async inboxRoot => {
    try {
      let notifications = [];
      for await (const currentInbox of inboxRoot) {
        const currentShape = this.buildShapeObject(currentInbox.shape);
        const { name, shape } = currentShape;
        const inbox = await solidLDflex[currentInbox.path];
        let notificationPaths = [];

        if ((this.schema && !this.schema[name]) || !this.schema)
          await this.fetchNotificationShape(shape, name);

        for await (const path of inbox['ldp:contains']) {
          notificationPaths = [...notificationPaths, path.value];
        }

        for await (const path of notificationPaths) {
          const turtleNotification = await solidLDflex[path];
          const id = path
            .split('/')
            .pop()
            .split('.')[0];
          let notificationData = id !== '' ? { id, path, inboxName: currentInbox.inboxName } : {};

          for await (const field of this.schema[name].shape) {
            const data = await turtleNotification[this.getPredicate(field, name)];
            const value = data ? data.value : null;
            notificationData = value
              ? { ...notificationData, [field.label]: value }
              : notificationData;
          }

          notifications = [...notifications, notificationData];
        }
      }
      return notifications;
    } catch (error) {
      throw new SolidError(error.message, 'Notification Fetch', error.status);
    }
  };
}
