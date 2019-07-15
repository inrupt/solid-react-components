import { Notification } from './notification';

const webIdExample = 'https://example.org/#me';
const inboxExample = 'https://example.org/inbox/';

describe('Notification test', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });

  const NotificationInstance = new Notification(null);

  it('should set owner to webId Example', async () => {
    // Owner should be null
    expect(NotificationInstance.owner).toBe(null);

    // After set owner should be webIdExample
    NotificationInstance.setOwner(webIdExample);

    expect(NotificationInstance.owner).toBe(webIdExample);
  });

  it('hasInbox should return boolean', async () => {
    const result = await NotificationInstance.hasInbox(webIdExample);
    expect(result).toBe(true);
  });

  it('should return error on delete inbox when path is empty', async () => {
    const result = await NotificationInstance.deleteInbox();

    expect(result.code).toBe(500);
  });
});
