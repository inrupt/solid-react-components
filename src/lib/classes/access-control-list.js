import { namedNode } from '@rdfjs/data-model';
import solid from 'solid-auth-client';
import * as N3 from 'n3';
import { isEqual } from 'lodash';
import ldflex from '@solid/query-ldflex';
import { SolidError } from '@utils';
import { PERMISSIONS, ACL_PREFIXES } from '@constants';

type Permissions = {
  agents: null | String | Array,
  modes: Array<String>
};

export default class AccessControlList {
  constructor(owner, documentUri, aclUrl) {
    this.owner = owner;
    this.documentUri = documentUri;
    this.aclUri = aclUrl;
    this.acl = null;
  }

  set setAcl(acl) {
    this.acl = acl;
  }

  static get MODES() {
    return PERMISSIONS;
  }

  /**
   * @function createsQuad Creates a simple quad object
   * @param {String} subject Subject of the quad
   * @param {String} predicate Predicate of the quad
   * @param {String} object Object of the quad
   */
  createQuad = (subject, predicate, object) => ({
    subject,
    predicate,
    object
  });

  /**
   * @function createQuadList Creates a N3 quad list to later be parsed as Turtle
   * @param {Array<String>} modes Array of modes
   * @param {Array<String> | null} agents Array of webId or null if for everyone
   */
  createQuadList = (modes: Array<String>, agents: Array<String> | null) => {
    const { acl, foaf, rdf } = ACL_PREFIXES;
    const subject = `${this.aclUri}#${modes.join('')}`;
    const { documentUri } = this;
    const originalPredicates = [
      this.createQuad(subject, `${rdf}type`, namedNode(`${acl}Authorization`)),
      this.createQuad(subject, `${acl}accessTo`, namedNode(documentUri)),
      this.createQuad(subject, `${acl}default`, namedNode(documentUri))
    ];
    let predicates = [];
    if (agents) {
      const agentsArray = Array.isArray(agents) ? agents : [agents];
      const agentsQuads = agentsArray.map(agent =>
        this.createQuad(subject, `${acl}agent`, namedNode(agent))
      );
      predicates = [...originalPredicates, ...agentsQuads];
    } else {
      const publicQuad = this.createQuad(subject, `${acl}agentClass`, namedNode(`${foaf}Agent`));
      predicates = [...originalPredicates, publicQuad];
    }

    const quadList = modes.reduce(
      (array, mode) => [
        ...array,
        this.createQuad(subject, `${acl}mode`, namedNode(`${acl}${mode}`))
      ],
      predicates
    );

    return quadList;
  };

  /**
   * @function createPermissionsTurtle Creates a turtle with specific permissions
   * @param {Array<Permissions> | null} permissions Array of permissions to be added to the turtle string
   * @return {String } A Turtle looking string with all of the necessary permissions
   */
  createPermissionsTurtle = (permissions: Array<Permissions>) => {
    const { DataFactory } = N3;
    const prefixes = { ...ACL_PREFIXES, '': `${this.aclUri}#`, me: this.owner };
    const { namedNode, quad } = DataFactory;
    const writer = new N3.Writer({ prefixes });
    const quadPermissions = permissions.map(({ modes, agents }) =>
      this.createQuadList(modes, agents)
    );
    const quads = quadPermissions
      .map(quadItem => {
        const itemQuads = quadItem.map(({ subject, predicate, object }) =>
          quad(namedNode(subject), namedNode(predicate), object)
        );
        return itemQuads;
      })
      .reduce((array, item) => [...array, ...item], []);

    quads.forEach(quad => writer.addQuad(quad));
    let turtle;
    writer.end((error, result) => {
      if (!error) turtle = result;
    });
    return turtle;
  };

  /**
   * @function createACL Creates a file or container with a specific set of acls. Assigns READ, WRITE and CONTROL permissions to the owner by default
   * @param {Array<Permissions> | null} permissions Array of permissions to be added in the acl file
   */
  createACL = async (permissions = null) => {
    try {
      if (permissions) {
        const permissionList = [
          { agents: this.owner, modes: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.CONTROL] },
          ...permissions
        ];
        const body = this.createPermissionsTurtle(permissionList);
        return await this.createSolidResource(this.aclUri, { body });
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * @function void Helper function to create a file
   * @param {String} url Url where the solid file has to be created
   * @param {Object} options Options to add as part of the native fetch options object
   */
  createSolidResource = async (url: String, options: Object = {}) =>
    solid.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      ...options
    });

  /**
   * @function getParentACL Recursively tries to retrieve the acl file from the parent containers if there is not a direct one
   * @param {String} url Url of the parent container
   * @getParentACL {Object || null} Parent acl fetched file
   */
  getParentACL = async (url: String) => {
    const newURL = new URL(url);
    const { pathname } = newURL;
    const hasParent = pathname.length > 1;
    if (!hasParent) return null;
    const isContainer = pathname.endsWith('/');
    let newPathname = isContainer ? pathname.slice(0, pathname.length - 1) : pathname;
    newPathname = `${newPathname.slice(0, newPathname.lastIndexOf('/'))}/`;
    const parentURI = `${newURL.origin}${newPathname}`;
    const result = await solid.fetch(`${parentURI}.acl`);
    if (result.status === 404) return this.getParentACL(parentURI);
    if (result.status === 200) return result;

    return null;
  };

  /**
   * @function getACLFile Retrieves the acl file from the network
   * @returns {Object} Acl fetched file
   */
  getACLFile = async () => {
    try {
      const result = await solid.fetch(this.aclUri);
      if (result.status === 403) throw new Error(result.message || 'Not authorized');
      if (result.status === 404) return this.getParentACL(this.documentUri);
      return result;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function getSubjects Creates an object based on a ldflex proxy document
   * @param {Proxy} document The base ldflex proxy document from where the data will be extracted
   * @returns {Array<Permissions>} A custom object to visualize the acls of a document or container in a Pod
   */
  getSubjects = async document => {
    let subjects = [];
    for await (const subject of document.subjects) {
      let agents = [];
      let modes = [];
      for await (const agent of subject['acl:agent']) {
        agents = [...agents, agent.value];
      }
      for await (const mode of subject['acl:mode']) {
        const modeName = mode.value ? mode.value.split('#')[1] : '';
        modes = [...modes, modeName];
      }
      const agentClass = await subject['acl:agentClass'];
      if (agents.length > 0) subjects = [...subjects, { subject, agents, modes }];
      if (agentClass) subjects = [...subjects, { subject, agents: null, modes }];
    }
    return subjects;
  };

  /**
   * @function getPermissions Retrieves the acl file as an array of Permissions objects
   * @returns {Array<Permissions>} An array of permissions
   */
  getPermissions = async () => {
    try {
      if (!this.acl) {
        const file = await this.getACLFile();
        if (!file)
          throw new SolidError('ACL File was not found for the resource', 'Permission Errors', 404);
        const doc = await ldflex[file.url];
        const permissions = this.getSubjects(doc);
        this.setAcl = permissions;
        return permissions;
      }
      return this.acl;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function deleteACL Deletes the entire acl file, leaving the default acls from the parent container
   * @return {Boolean} Returns if deletion was successful
   */
  deleteACL = async () => {
    const result = await solid.fetch(this.aclUri, { method: 'DELETE' });
    return result.ok;
  };

  /**
   * @function isSameMode checks if two sorted arrays of modes are equal
   * @param {Array<String>} modes1 An array of mode names to be compared
   * @param {Array<String>} modes2 An array of mode names to be compared
   * @returns {Boolean} The result of comparing two array to see if are equals
   */
  isSameMode = (modes1, modes2) => isEqual(modes1.sort(), modes2.sort());

  /**
   * @function createMode creates a new mode in the acl file
   * @param {Permissions} permissions Permissions with the necessary modes and agents
   */
  createMode = async ({ modes, agents }) => {
    try {
      const { acl, foaf } = ACL_PREFIXES;
      const subject = `${this.aclUri}#${modes.join('')}`;
      await ldflex[subject].type.add(namedNode(`${acl}Authorization`));
      const path = namedNode(this.documentUri);
      await ldflex[subject]['acl:accessTo'].add(path);
      await ldflex[subject]['acl:default'].add(path);
      /* If agents is null then it will be added to the default permission (acl:agentClass) for 'everyone' */
      if (agents) {
        for await (const agent of agents) {
          await ldflex[subject]['acl:agent'].add(namedNode(agent));
        }
      } else {
        await ldflex[subject]['acl:agentClass'].add(namedNode(`${foaf}Agent`));
      }

      for await (const mode of modes) {
        await ldflex[subject]['acl:mode'].add(namedNode(`${acl}${mode}`));
      }
      return { modes, agents };
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function addPermissionsToMode removes a specific agent from a specific mode in the acl file
   * @param {Permissions} mode An existing mode (subject) in the acl file
   * @param {String} agent WebId of the user the mode will be assigned to
   */
  addPermissionsToMode = async (mode, agent) => {
    const { subject } = mode;
    await ldflex[subject]['acl:agent'].add(namedNode(agent));
  };

  /**
   * @function removePermissionsFromMode removes a specific agent from a specific mode in the acl file
   * @param {Permissions} mode An existing mode (subject) in the acl file
   * @param {String} agent WebId of the user to remove from an existing mode
   */
  removePermissionsFromMode = async (mode: Permissions, agent: String) => {
    const { subject } = mode;
    await ldflex[subject]['acl:agent'].delete(namedNode(agent));
  };

  /**
   * @function assignPermissions Assigns permissions to specific agents, creates a new mode if it does not exist
   * @param {Array<Permissions> | null | String} permissionss An array of permissions to be assigned
   */
  assignPermissions = async permissions => {
    const aclPermissions = await this.getPermissions();
    for await (const permission of permissions) {
      const { modes, agents } = permission;
      const modeExists = aclPermissions.filter(per => this.isSameMode(per.modes, modes));
      if (modeExists.length > 0) {
        const mode = modeExists[0];
        const agentsExists = agents.filter(agent => !mode.agents.includes(agent));
        for await (const agent of agentsExists) {
          await this.addPermissionsToMode(mode, agent);
        }
      } else {
        return this.createMode(permission);
      }
    }
  };

  /**
   * @function removePermissions Removes specific permissions to specific agents if exists
   * @param {Array<Permissions> | null | String} permissionss An array of permissions to be removed
   */
  removePermissions = async permissions => {
    try {
      const aclPermissions = await this.getPermissions();
      for await (const permission of permissions) {
        const { modes, agents } = permission;
        const modeExists = aclPermissions.filter(per => this.isSameMode(per.modes, modes));
        if (modeExists.length > 0) {
          const mode = modeExists[0];
          const agentsExists = mode.agents.filter(agent => agents.includes(agent));
          for await (const agent of agentsExists) {
            await this.removePermissionsFromMode(mode, agent);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  };
}
