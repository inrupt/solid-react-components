import solid from 'solid-auth-client';
import N3 from 'n3';
import solidLDflex from '@solid/query-ldflex';
import { solidResponse, SolidError, getBasicPod } from '@utils';
import defaultShape from '../shapes/notification.json';

const PREFIXES = {
  terms: 'https://www.w3.org/ns/solid/terms#',
  schema: 'http://www.w3.org/2000/01/rdf-schema#',
  things: 'https://schema.org/Thing#',
  ns: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  acl: 'http://www.w3.org/ns/auth/acl#'
};

/**
 * Notification Class for SOLID
 * To know more about ACL please go to: https://github.com/solid/web-access-control-spec
 * To know more about N3 please go to: https://www.npmjs.com/package/n3
 */
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

  setOwner = owner => {
    this.owner = owner;
  };

  /**
   * We are checking if user has inbox reference on card also if inbox folder exists.
   * @param path
   * @returns {Promise<*|boolean>}
   */
  hasInbox = async path => {
    const result = await solid.fetch(path, { method: 'GET' });
    return result.code === 403 || result.code === 200;
  };

  /**
   * Delete inbox folder and ldp on user card
   * @returns {Promise<*>}
   * @param {String} inbox path of the container
   * @param {String} document an optional parameter to delete reference on document
   */

  deleteInbox = async (inbox, document) => {
    try {
      if (!inbox || !document)
        return new SolidError(
          'Inbox and Document are necessary to delete inbox',
          'Delete Inbox',
          500
        );
      /**
       * Delete container file into pod.
       */
      await solid.fetch(`${inbox}`, { method: 'DELETE' });
      /**
       * Delete inbox link reference from user card or custom file
       */
      await solidLDflex[document || this.owner]['ldp:inbox'].delete(inbox);

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

  createInbox = async (inboxPath, appPath, settingFileName = 'settings.ttl') => {
    try {
      const hasInbox = await this.hasInbox(inboxPath);
      const appSettingPat = `${appPath}${settingFileName}`;
      if (hasInbox) throw new SolidError('Inbox already exist', 'Inbox', 303);

      if (!this.owner) throw new SolidError('Owner is undefined', 'Inbox', 500);

      /**
       * Start to build ACL file to add access to owner and users to inbox container
       * To know more about ACL please go to: https://github.com/solid/web-access-control-spec
       */
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

      /**
       * Add Quad type Authorization
       */
      writer.addQuad(namedNode('#owner'), namedNode('ns:type'), namedNode('acl:Authorization'));
      /**
       * Add agent permission to owner
       */
      writer.addQuad(namedNode('#owner'), namedNode('acl:agent'), namedNode(this.owner));
      /**
       * Add access reference to the container folder
       */
      writer.addQuad(namedNode('#owner'), namedNode('acl:accessTo'), namedNode('./'));
      writer.addQuad(namedNode('#owner'), namedNode('acl:defaultForNew'), namedNode('./'));

      /**
       * Add roles to owner Read, Write and Control
       */
      writer.addQuad(
        namedNode('#owner'),
        namedNode('acl:mode'),
        namedNode('acl:Read, acl:Write, acl:Control')
      );

      /**
       * Add permissions to public users
       */
      writer.addQuad(namedNode('#public'), namedNode('ns:type'), namedNode('acl:Authorization'));

      writer.addQuad(
        namedNode('#public'),
        namedNode('acl:agentClass'),
        namedNode('http://xmlns.com/foaf/0.1/Agent')
      );
      /**
       * Add access reference to the container folder
       */
      writer.addQuad(namedNode('#public'), namedNode('acl:accessTo'), namedNode('./'));

      writer.addQuad(namedNode('#public'), namedNode('acl:defaultForNew'), namedNode('./'));
      /**
       * Add roles to public Read, Write
       * Note: Should be Append we are using Read, Write for now
       */
      writer.addQuad(namedNode('#public'), namedNode('acl:mode'), namedNode('acl:Append'));

      await writer.end(async (error, result) => {
        if (error) {
          throw error;
        }

        await solid.fetch(appSettingPat, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/turtle'
          }
        });

        /**
         * Create inbox container
         */
        await solid.fetch(`${inboxPath}.dummy`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/turtle'
          }
        });

        await solid.fetch(`${inboxPath}.dummy`, { method: 'DELETE' });
        /**
         * Create a default ACL for inbox container
         */
        await solid.fetch(`${inboxPath}.acl`, {
          method: 'PUT',
          body: result,
          headers: {
            'Content-Type': 'text/turtle'
          }
        });
      });

      /**
       * Check if setting reference is into the pod.
       */
      const settingsResult = await solid.fetch(appSettingPat, { method: 'GET' });

      /**
       * Create inbox reference to discovery into app
       */
      await solidLDflex[appSettingPat]['ldp:inbox'].add(namedNode(inboxPath));

      if (!settingsResult.ok)
        throw new Error('Notifications need to have settings file to save reference');

      return solidResponse(200, 'Inbox was created');
    } catch (error) {
      throw new SolidError(error.message, 'Inbox', error.code || 500);
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
      const result = await solid.fetch(file);
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
            item.label === 'datetime'
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
            value = item.label === 'datetime' ? new Date().toISOString() : value;
            /**
             * Check if object from schema is a literal or node value
             */

            const typedValue = item.type === 'NamedNode' ? namedNode(value) : literal(value);
            writer.addQuad(
              namedNode(''),
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

        await solid.fetch(to, {
          method: 'POST',
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

  /**
   * Find user inbox from document file
   * @param document file url to find inbox path
   * @returns {Promise<boolean>}
   */
  discoveryInbox = async document => {
    try {
      const existDocument = await this.hasInbox(document);
      if (!existDocument) return false;

      const inboxDocument = await solidLDflex[document]['ldp:inbox'];
      const inbox = inboxDocument ? await inboxDocument.value : false;
      return inbox;
    } catch (error) {
      throw error;
    }
  };
  /**
   * Fetch notifications from inboxes
   * @param inboxRoot an array on inboxes path
   * @returns {Promise<Array>}
   */

  fetch = async inboxRoot => {
    try {
      let notifications = [];
      const filteredNotifications = inboxRoot.filter(inbox => inbox.path);
      /**
       * Run over all inbox to fetch notifications
       */
      for await (const currentInbox of filteredNotifications) {
        /**
         * Build notification shape using json-ld format
         */
        const currentShape = this.buildShapeObject(currentInbox.shape);
        const { name, shape } = currentShape;
        /**
         * Get container document
         */
        const inbox = await solidLDflex[currentInbox.path];
        let notificationPaths = [];

        if ((this.schema && !this.schema[name]) || !this.schema)
          await this.fetchNotificationShape(shape, name);
        /**
         * Get contains links from inbox container
         */
        for await (const path of inbox['ldp:contains']) {
          notificationPaths = [...notificationPaths, path.value];
        }

        /**
         * Get notifications files from contains links
         */
        for await (const path of notificationPaths) {
          const turtleNotification = await solidLDflex[path];
          const id = path
            .split('/')
            .pop()
            .split('.')[0];
          let notificationData = id !== '' ? { id, path, inboxName: currentInbox.inboxName } : {};
          /**
           * Run over the shape schema to build notification object
           */
          for await (const field of this.schema[name].shape) {
            const data = await turtleNotification[this.getPredicate(field, name)];
            const value = data ? data.value : null;
            notificationData = value
              ? { ...notificationData, [field.label]: value }
              : notificationData;
          }

          const actor = notificationData.actor && (await getBasicPod(notificationData.actor));
          notificationData = { ...notificationData, actor };

          notifications = [...notifications, notificationData];
        }
      }
      return notifications;
    } catch (error) {
      throw new SolidError(error.message, 'Notification Fetch', error.status);
    }
  };
}
