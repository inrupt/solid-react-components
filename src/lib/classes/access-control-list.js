import { namedNode } from '@rdfjs/data-model';
import solid from 'solid-auth-client';
import N3 from 'n3';
import ldflex from '@solid/query-ldflex';

const PERMISSIONS = {
  APPEND: 'Append',
  READ: 'Read',
  WRITE: 'Write',
  CONTROL: 'Control'
};

type Permissions = {
  agents: null | String | Array,
  modes: Array<String>
};

const ACL_PREFIXES = {
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  n: 'http://www.w3.org/2006/vcard/ns#',
  a: 'http://www.w3.org/ns/auth/acl#type'
};

class AccessControlList {
  constructor(owner, documentUri) {
    this.owner = owner;
    this.documentUri = documentUri;
    this.aclUri = `${this.documentUri}.acl`;
    this.acl = null;
  }

  set setAcl(acl) {
    this.acl = acl;
  }

  static get MODES() {
    return PERMISSIONS;
  }

  createQuad = (subject, predicate, object) => ({
    subject,
    predicate,
    object
  });

  createQuadList = (modes, agents) => {
    const { acl, foaf, a } = ACL_PREFIXES;
    const subject = `${this.aclUri}#${modes.join('')}`;
    const originalPredicates = [
      this.createQuad(subject, `${a}`, namedNode(`${acl}Authorization`)),
      this.createQuad(subject, `${acl}accessTo`, namedNode(this.documentUri))
    ];
    let predicates = [];
    console.log('Agents', agents);
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

  createACLFile = async (permissions = null) => {
    await this.createSolidFile(this.documentUri);
    if (permissions) {
      const permissionList = [
        { agents: this.owner, modes: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.CONTROL] },
        ...permissions
      ];
      const body = this.createPermissionsTurtle(permissionList);
      await this.createSolidFile(this.aclUri, { body });
    }
  };

  createSolidFile = async (url, options = {}) =>
    solid.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      ...options
    });

  getParentACL = async url => {
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
  };

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
      const subjectName = subject.value.split('#')[1];
      if (agents.length > 0) subjects = [...subjects, { subject: subjectName, agents, modes }];
      if (agentClass) subjects = [...subjects, { subject: subjectName, agents: null, modes }];
    }
    return subjects;
  };

  getPermissions = async () => {
    try {
      if (!this.acl) {
        const file = await this.getACLFile();
        if (!file) throw new Error('ACL File was not found for the resource');
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

  deleteACL = async () => {
    const result = await solid.fetch(this.aclUri, { method: 'DELETE' });
    return result.ok;
  };

  isSameMode = (modes1, modes2) => {
    return modes1.sort() === modes2.sort();
  };

  createMode = async (document, { modes, agents }) => {
    try {
      const { acl, foaf, a } = ACL_PREFIXES;
      const subject = `${this.aclUri}#${modes.join('')}`;
      await document[subject][a].add(namedNode(`${acl}Authorization`));
      await document[subject]['acl:accessTo'].add(namedNode(this.documentUri));
      if (agents) {
        for await (const agent of agents) {
          await document[subject]['acl:agent'].add(namedNode(agent));
        }
      } else {
        await document[subject]['acl:agentClass'].add(namedNode(`${foaf}Agent`));
      }

      for await (const mode of modes) {
        await document[subject]['acl:mode'].add(namedNode(`${acl}${mode}`));
      }
      return { modes, agents };
    } catch (e) {
      throw e;
    }
  };

  assignPermissions = async permissions => {
    const aclPermissions = await this.getPermissions();
    const document = await ldflex[this.aclUri];
    for await (const permission of permissions) {
      console.log('Permission', permission);
      const modeExists = aclPermissions.filter(per => this.isSameMode(per.modes, permission.modes));
      if (modeExists.length > 0) {
        console.log('Mode', modeExists);
        const agentsExists = modeExists[0].agents.filter(
          agent => !permission.agents.includes(agent)
        );
      } else {
        console.log('Mode does not exist');
        return this.createMode(document, permission);
      }
    }
  };

  removePermissions = async permissions => {
    const aclPermissions = await this.getPermissions();
    const document = await ldflex[this.aclUri];
    permissions.forEach(({ modes, agents }) => {});
  };

  updatePermissions = async permissions => {
    const aclPermissions = await this.getPermissions();
    const document = await ldflex[this.aclUri];
  };
}

export default AccessControlList;
