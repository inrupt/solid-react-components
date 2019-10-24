import solid from 'solid-auth-client';
import N3 from 'n3';
import solidLDflex from '@solid/query-ldflex';
import { solidResponse, SolidError, getBasicPod } from '@utils';
import defaultShape from '../shapes/notification.json';
import AccessControlList from './access-control-list';
import { NotificationTypes } from '@constants';

const PREFIXES = {
  terms: 'https://www.w3.org/ns/solid/terms#',
  schema: 'http://www.w3.org/2000/01/rdf-schema#',
  things: 'https://schema.org/Thing#',
  ns: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  acl: 'http://www.w3.org/ns/auth/acl#',
  ldp: 'http://www.w3.org/ns/ldp#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
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
   * We are checking if the user has an inbox reference on the card and, also, if the inbox folder exists.
   * @param path
   * @returns {Promise<boolean>}
   */
  hasInbox = async path => {
    const result = await solid.fetch(path, { method: 'GET' });
    return result.status === 403 || result.status === 200;
  };

  /**
   * Delete the inbox and the link to the inbox for discoverability
   * @returns {Promise<*>}
   * @param {String} inbox path of the container
   * @param {String} document an optional parameter to delete a reference on a document
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
       * Delete container file in pod.
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
   * Create turtle document to discover inbox in the user pod.
   * @param path
   * @param inboxPath
   * @param fileName
   * @returns {Promise<{ok: boolean}>}
   */
  settingsTurtle = async (path, inboxPath, fileName = 'settings.ttl') => {
    const termFactory = N3.DataFactory;
    const { namedNode } = termFactory;
    const writer = new N3.Writer({
      prefixes: {
        ldp: PREFIXES.ldp
      },
      format: 'text/turtle'
    });

    writer.addQuad(namedNode(''), namedNode('ldp:inbox'), namedNode(inboxPath));
    let resultPut = { ok: false };

    await writer.end(async (error, result) => {
      resultPut = await solid.fetch(path, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/turtle',
          slug: fileName
        },
        body: result
      });
    });

    return resultPut;
  };

  /**
   * Create inbox container with default permissions in the pod from a specific path
   * @param inboxRoot
   * @param owner
   * @returns {Promise<*>}
   */
  createInbox = async (inboxPath, appPath, settingFileName = 'settings.ttl') => {
    try {
      const newInboxPath = inboxPath.endsWith('/') ? inboxPath : `${inboxPath}/`;
      const newAppPath = appPath.endsWith('/') ? appPath : `${appPath}/`;
      /**
       * Check if inbox already exists or not in the target path.
       * @type {*|boolean}
       */
      const hasInbox = await this.hasInbox(newInboxPath);
      const appSettingPath = `${newAppPath}${settingFileName}`;
      /**
       * if container exist will return message without changes.
       */
      if (hasInbox) return solidResponse(200, 'Inbox is ready to use');

      if (!this.owner) throw new SolidError('Owner is undefined', 'Inbox', 500);

      /**
       * Create inbox reference to be discovered in the pod into settings.ttl
       */
      const settingsResult = await this.settingsTurtle(appSettingPath, newInboxPath);

      /**
       * Check if settings reference was created it if not we will try one time more.
       */
      if (!settingsResult.ok) await this.settingsTurtle(appSettingPath, newInboxPath);

      /**
       * Create inbox container
       */
      const resultInbox = await solid.fetch(`${newInboxPath}.dummy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/turtle'
        }
      });

      /**
       * If create inbox fail we return an error message
       */
      if (!resultInbox.ok)
        throw new SolidError('Error when tried to create an inbox', 'Error', resultInbox.status);

      await solid.fetch(`${newInboxPath}.dummy`, { method: 'DELETE' });
      const permissions = [{ agents: null, modes: [AccessControlList.MODES.APPEND] }];
      const aclContainer = new AccessControlList(this.owner, newInboxPath);
      await aclContainer.createACL(permissions);

      return solidResponse(200, 'Inbox was created');
    } catch (error) {
      throw new SolidError(error.message, 'Inbox Error', error.code || error.status);
    }
  };

  /**
   * Fetch shape object that will be used to build notifications and also
   * to know how we need to render it.
   * @param file
   * @returns {Promise<void>}
   */
  fetchNotificationShape = async (file, name) => {
    try {
      /**
       * if shape comes like object will return the object instead of making a fetch request
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
   * create and send a notification to user's inbox
   * @param inboxRoot
   * @param title
   * @param content
   * @param options
   * @returns {Promise<*>}
   */

  create = async (content = {}, to, type, options = {}) => {
    try {
      const currentShape = this.buildShapeObject(options && options.shape);
      const { name, shape: defaultShape } = currentShape;
      const termFactory = N3.DataFactory;
      const { namedNode, literal } = termFactory;

      const fileName = Date.now();
      const filePath = `${to + fileName}.ttl`;

      // This should be in a constant, but we may shift to use solid/context instead
      const rdfType = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

      // If a type has not been set, default to Announce type
      const notificationType = type || NotificationTypes.ANNOUNCE;

      if (!this.schema || (this.schema && !this.schema[name])) {
        /**
         * Fetch remote shape that will be use to render and build notifications
         */
        await this.fetchNotificationShape(defaultShape, name);
      }
      if (!this.schema[name]['@context']) {
        throw new SolidError('Schema does not have context', 'Notification', 500);
      }

      const { '@context': context, shape } = this.schema[name];
      // Add local filename as a prefix for cleaner ttl generation
      const fullContext = { ...context, ':': filePath };

      /**
       * N3 is an implementation of the RDF.js low-level specification that lets you handle RDF in JavaScript easily.
       * Reference: https://www.npmjs.com/package/n3
       * Create content for the notification using turtle format.
       * @type {N3Writer}
       */
      const writer = new N3.Writer({
        prefixes: fullContext,
        format: 'text/turtle'
      });

      // Add the notification type to the node
      writer.addQuad(namedNode(filePath), namedNode(rdfType), namedNode(notificationType));

      shape.forEach(item => {
        if (item.property && item.property.includes(':')) {
          const defaultValue = item.value;

          if (
            content[item.label] ||
            defaultValue ||
            item.label === 'read' ||
            item.label === 'published'
          ) {
            /**
             * Add read by default on notification document
             * @type {string}
             */
            let value = item.label === 'read' ? 'false' : content[item.label];
            /**
             * Add datetime time by default on notification document
             * @type {string}
             */
            value = item.label === 'published' ? new Date().toISOString() : value;
            /**
             * Check if object from schema is a literal or node value, and if it requires a data type
             */
            let typedValue = null;

            if (item.type === 'NamedNode') {
              typedValue = namedNode(value);
            } else {
              switch (item.datatype) {
                case 'datetime':
                  typedValue = literal(value, namedNode(`${PREFIXES.xsd}datetime`));
                  break;
                case 'boolean':
                  typedValue = literal(value, namedNode(`${PREFIXES.xsd}boolean`));
                  break;
                case 'string':
                default:
                  typedValue = literal(value);
                  break;
              }
            }

            writer.addQuad(
              namedNode(filePath),
              namedNode(`${context[item.property.split(':')[0]]}${item.label}`),
              typedValue
            );
          }
        } else {
          throw new SolidError('Schema does not have property', 'Notification', 500);
        }
      });

      await writer.end(async (error, result) => {
        if (error) {
          throw error;
        }
        /**
         * Custom header options to create a notification file on pod.
         * options:
         * @slug: {String} custom file name that will be save it on the pod
         * @contentType: {String} format of the file that will be save it on the pod.
         */
        const optionsHeader = options && options.header;

        await solid.fetch(to, {
          method: 'POST',
          body: result,
          headers: {
            'Content-Type': 'text/turtle',
            slug: fileName,
            ...optionsHeader
          }
        });
      });
      return solidResponse(200, 'Notification was created');
    } catch (error) {
      throw new SolidError(error.message, 'Notification', error.status);
    }
  };

  /**
   * Mark as read the notifications
   * @param notificationPath
   * @returns {Promise<*>}
   */
  markAsRead = async (notificationPath, status) => {
    try {
      /**
       * Update subject read into notification a notification file.
       */
      await solidLDflex[notificationPath]['https://www.w3.org/ns/solid/terms#read'].set(status);

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
       * Delete a file at an inbox folder by default will delete the reference on inbox container
       */
      await solid.fetch(file, { method: 'DELETE' });

      return solidResponse(200, 'Notification was deleted it');
    } catch (error) {
      throw new SolidError(error.message, 'Notification Delete', error.status);
    }
  };

  /**
   * Get the predicate value from the shape object
   * @param field
   * @param shapeName
   * @returns {string}
   */
  getPredicate = (field, shapeName) => {
    const prefix = field.property.split(':')[0];
    const ontology = this.schema[shapeName]['@context'][prefix];
    return `${ontology}${field.label}`;
  };

  /**
   * Find user's inbox from document file
   * @param document file url to find inbox path
   * @returns {Promise<boolean>}
   */
  discoverInbox = async document => {
    try {
      const hasDocument = await this.hasInbox(document);
      if (!hasDocument) return false;

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
       * Run over all inboxes to fetch notifications
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
