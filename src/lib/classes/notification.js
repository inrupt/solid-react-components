import solid from 'solid-auth-client';
import N3 from 'n3';
import solidLdlex from '@solid/query-ldflex';
import unique from 'unique';
import { solidResponse, SolidError } from '@utils';

const PREFIXES = {
  terms: 'https://www.w3.org/ns/solid/terms#',
  schema: 'http://www.w3.org/2000/01/rdf-schema#',
  things: 'https://schema.org/Thing#',
  ns: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  acl: 'http://www.w3.org/ns/auth/acl#'
};

export class Notification {
  constructor(owner, inboxRoot, shape) {
    this.shape = shape;
    this.owner = owner;
    this.inboxRoot = inboxRoot;
    this.schema = null;

    this.fetchNotificationShape(this.shape);
  }

  hasInbox = async path => {
    try {
      return await solid.fetch(path, { method: 'GET' });
    } catch (error) {
      return false;
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
      const result = await this.hasInbox(this.inboxRoot);
      /**
       * if Inbox already exists we throw error
       */
      if (result.status === 200) {
        throw new SolidError('Inbox already exists', 'Inbox', 500);
      }

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

      writer.addQuad(namedNode('#public'), namedNode('acl:mode'), namedNode('acl:Append'));

      await writer.end(async (error, result) => {
        if (error) {
          throw error;
        }
        await solid.fetch(`${this.inboxRoot}/.dummy`, { method: 'PUT' });

        await solid.fetch(`${this.inboxRoot}/.acl`, {
          method: 'PUT',
          body: result,
          contentType: 'text/turtle'
        });
      });
      return solidResponse(200, 'Inbox was created');
    } catch (error) {
      throw new SolidError(error.message, 'Inbox', 500);
    }
  };

  fetchNotificationShape = async file => {
    try {
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

  create = async (content = {}) => {
    try {
      const notificationName = unique();
      const notificationPath = `${this.inboxRoot}/${notificationName}.ttl`;
      const termFactory = N3.DataFactory;
      const { namedNode, literal } = termFactory;

      if (!this.schema['@context']) {
        throw new SolidError('Schema do not have context', 'Notification', 500);
      }

      const { '@context': context, shape } = this.schema;

      const writer = new N3.Writer({
        prefixes: context,
        format: 'text/turtle'
      });

      if (this.schema) {
        await this.fetchNotificationShape(this.shape);
      }

      shape.forEach(item => {
        if (item.property && item.property.includes(':')) {
          if (content[item.label]) {
            writer.addQuad(
              namedNode(notificationPath),
              namedNode(`${context[item.property.split(':')[0]]}${item.label}`),
              literal(content[item.label])
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
          contentType: 'text/turtle'
        });
      });
      return solidResponse(200, 'Notification was created');
    } catch (error) {
      console.log(error);
      throw new SolidError(error.message, 'Notification', error.status);
    }
  };

  markAsRead = async notificationPath => {
    try {
      await solidLdlex[notificationPath][`${PREFIXES.terms}:read`].set(true);

      return solidResponse(200, 'Notification was updated');
    } catch (error) {
      throw new SolidError(error.message, 'Notification', error.status);
    }
  };

  delete = async notificationPath => {
    try {
      await solid.fetch(notificationPath, { method: 'DELETE' });
      return solidResponse(200, 'Notification was deleted it');
    } catch (error) {
      throw new SolidError(error.message, 'Notification Delete', error.status);
    }
  };

  fetch = async () => {
    try {
      const inbox = await solidLdlex[this.inboxRoot];
      let notificationsPath = [];
      let notification = [];

      for await (const notificationPath of inbox) {
        notificationsPath = [...notificationsPath, await notificationPath.value];
      }

      for await (const notificationPath of notificationsPath) {
        const currentNotification = await solidLdlex[notificationPath];
        const title = await currentNotification['schema:title'];

        notification = [...notification, { title: title.value }];
      }

      console.log(notification);
    } catch (error) {
      throw new SolidError(error.message, 'Notification Delete', error.status);
    }
  };
}
