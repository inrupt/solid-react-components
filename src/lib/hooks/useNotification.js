import { useCallback, useEffect, useState } from 'react';
import { Notification } from '@classes';

export const useNotification = (inboxRoot, owner, schema = 'public/shapes/notification.json') => {
  const notify = new Notification(owner, inboxRoot, schema);
  const [notifications, setNotifications] = useState([]);
  const createInbox = useCallback(async () => {
    try {
      if (owner) {
        console.log(owner);
        await notify.createInbox();
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [inboxRoot, owner]);

  const createNotification = useCallback(async () => {
    await notify.create();
  }, [inboxRoot]);

  const fetchNotification = useCallback(async () => {
    const notificationList = await notify.fetch();
    setNotifications(notificationList);
  }, [inboxRoot]);

  useEffect(() => {
    fetchNotification();
  }, [inboxRoot, owner]);

  return {
    fetchNotification,
    createNotification,
    createInbox,
    notifications
  };
};
