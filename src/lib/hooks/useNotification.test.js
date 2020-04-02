import { useNotification } from '@hooks';
import { Notification } from '@classes';
import { renderHook } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

const webIdExample = 'https://example.org/#me';

jest.mock('../../lib/classes/notification');

const setup = () => {
  let component = null;

  act(() => {
    component = renderHook(() => useNotification(webIdExample));
  });

  return component;
};

describe('useNotification', () => {
  afterAll(() => cleanup);

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Notification.mockClear();
  });

  it('returns empty notifications on init', async () => {
    const { result } = setup();

    expect(result.current.notification.notifications).toEqual([]);
    expect(result.current.notification.originalNotifications).toEqual([]);
  });

  it('should called the class Notification on init', () => {
    const NotificationInstance = new Notification();
    expect(Notification).toHaveBeenCalledTimes(1);
  });

  it('called a method on the class instance', () => {
    const { hookConsumerNotification } = setup();

    const notificationConsumer = hookConsumerNotification;
    // Constructor should have been called again:
    expect(Notification).toHaveBeenCalledTimes(1);
  });
});
