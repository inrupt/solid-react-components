import AccessControlList from './access-control-list';
import ldflex from '../../test/__mocks__/@solid/query-ldflex';

const webIdExample = 'https://example.org/#me';
const fileExample = 'https://example.org/public/test.ttl';

describe('Access Control List test', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  const PERMISSIONS = {
    APPEND: 'Append',
    READ: 'Read',
    WRITE: 'Write',
    CONTROL: 'Control'
  };

  const ACLInstance = new AccessControlList(webIdExample, fileExample);

  it('Modes are correct', async () => {
    expect(AccessControlList.MODES).toEqual(PERMISSIONS);
  });

  it('Instance is correct', async () => {
    expect(ACLInstance.aclUri).toEqual(`${fileExample}.acl`);
    expect(ACLInstance.acl).toBe(null);
  });

  it('Get subjects from a doc', async () => {
    const doc = ldflex[webIdExample];
    const result = await ACLInstance.getSubjects(doc);
    expect(result).toBeTruthy();
  });

  it('Creates permissions turtle', async () => {
    const permissions = [{ agents: [webIdExample], modes: [AccessControlList.MODES.READ] }];
    const result = await ACLInstance.createPermissionsTurtle(permissions);

    expect(result).not.toBe(null);
  });

  it('Get permissions', async () => {
    const permissions = [{ agents: [webIdExample], modes: [AccessControlList.MODES.READ] }];
    const result = await ACLInstance.getPermissions(permissions);
    expect(result).not.toBe(null);
  });
});
