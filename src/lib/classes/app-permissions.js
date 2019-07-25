import solid from 'solid-auth-client';
import N3 from 'n3';

/**
 * class to handle app permissions into the pod.
 */
class AppPermissions {
  constructor() {
    this.permissions = {};
  }

  /**
   * Get ACL modes from object value
   * @param quad
   * @returns {*}
   */
  getModes = quad => {
    if (quad.predicate.id === 'http://www.w3.org/ns/auth/acl#mode') {
      return quad.object.id && quad.object.id.split('#')[1];
    }
  };

  /**
   * Get app permission by webId
   * @param webId
   * @param cache
   * @returns {Promise<null|*>}
   */
  checkPermissions = async (webId, cache) => {
    const currentLocation = window.location;
    const appDomain = new URL(currentLocation).origin;

    await this.getPermissions(webId, cache);
    const nodes = Object.keys(this.permissions[webId]);
    for (const node of nodes) {
      if (this.permissions[webId][node].origin === appDomain) {
        return this.permissions[webId][node];
      }
    }

    return null;
  };

  /**
   * Get permission by webId
   * @param webId
   * @param cache
   * @returns {Promise<void>}
   */
  getPermissions = async (webId, cache = true) => {
    if (this.permissions[webId] && cache) return;
    /**
     * Fetch document from pod
     */
    const result = await solid.fetch(webId);
    const document = await result.text();
    /**
     * Parse turtle to Quads
     * @type {N3Parser}
     */
    const parser = new N3.Parser({ baseIRI: webId });
    const nquads = await parser.parse(document.toString());
    let nodes = {};

    /**
     * Find all the array link node name
     */
    const restQuads = nquads.filter(quad => {
      if (quad.predicate.id === 'http://www.w3.org/ns/auth/acl#trustedApp') {
        nodes = { ...nodes, [quad.object.id]: { permissions: [] } };

        return null;
      }
      return quad;
    });
    /**
     * Run over all the quads an create an object
     */
    restQuads.forEach(quad => {
      if (nodes[quad.subject.id]) {
        const permission = this.getModes(quad);
        nodes[quad.subject.id] = {
          ...nodes[quad.subject.id],
          permissions: permission
            ? [...nodes[quad.subject.id].permissions, permission]
            : nodes[quad.subject.id].permissions
        };

        if (quad.predicate.id === 'http://www.w3.org/ns/auth/acl#origin') {
          nodes[quad.subject.id] = {
            ...nodes[quad.subject.id],
            origin: quad.object.id
          };
        }
      }
    });

    this.permissions[webId] = nodes;
  };
}

const AppPermission = new AppPermissions();

export default AppPermission;
