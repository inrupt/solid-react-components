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
  user: String,
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
  }

  static get MODES() {
    return PERMISSIONS;
  }

  createQuad = (subject, predicate, object) => ({
    subject,
    predicate,
    object
  });

  createQuadList = (modes, user) => {
    const { acl, foaf, a } = ACL_PREFIXES;
    const subject = `${this.aclUri}#${modes.join('')}`;
    const originalPredicates = [
      this.createQuad(subject, `${a}`, namedNode(`${acl}Authorization`)),
      this.createQuad(subject, `${acl}accessTo`, namedNode(this.documentUri))
    ];

    const predicates = user
      ? [...originalPredicates, this.createQuad(subject, `${acl}agent`, namedNode(user))]
      : [
          ...originalPredicates,
          this.createQuad(subject, `${acl}agentClass`, namedNode(`${foaf}Agent`))
        ];

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
    const quadPermissions = permissions.map(({ modes, user }) => this.createQuadList(modes, user));
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

  createACLFile = async permissions => {
    const permissionList = [
      { user: this.owner, modes: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.CONTROL] },
      ...permissions
    ];
    const body = this.createPermissionsTurtle(permissionList);
    await this.createSolidFile(this.documentUri);
    await this.createSolidFile(this.aclUri, { body });
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
    console.log('Parent', parentURI);
    const result = await solid.fetch(`${parentURI}.acl`);
    if (result.status === 404) return this.getParentACL(parentURI);
    if (result.status === 200) return result;
  };

  getACLFile = async () => {
    try {
      const result = await solid.fetch(this.aclUri);
      if (result.status === 403) throw new Error('Not authorized');
      if (result.status === 404) return this.getParentACL(this.documentUri);
      return result;
    } catch (e) {
      throw e;
    }
  };

  getACLTurtle = async () => {
    try {
      const file = await this.getACLFile();
      console.log(file);
      if (!file) throw new Error('ACL File was not found for the resource');
      const doc = await ldflex[file.url];
      console.log('Doc', doc);
    } catch (e) {
      throw e;
    }
  };

  removePermissions = async () => {
    const result = await solid.fetch(this.aclUri, { method: 'DELETE' });
    return result.ok;
  };

  updatePermissions = () => {};

  getPermissions = () => {};
}

export default AccessControlList;
