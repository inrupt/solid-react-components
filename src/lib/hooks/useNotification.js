import { useCallback, useEffect, useState } from 'react';
import { Notification } from '@classes';

export const useNotification = (inboxRoot, owner, schema = '/shapes/notification.json') => {
  const [notify, setNotify] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const createInbox = useCallback(async () => {
    try {
      if (owner) await notify.createInbox();
    } catch (error) {
      throw error;
    }
  }, [owner, notify]);

  const createNotification = useCallback(
    async content => {
      await notify.create(content);
    },
    [inboxRoot, notify]
  );

  const fetchNotification = async () => {
    try {
      console.log('Notify', notify);
      await notify.createInbox();
      // const notificationList = await notify.fetch();
      // setNotifications(notificationList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inboxRoot && owner) {
      setNotify(new Notification(owner, inboxRoot, schema));
    }
  }, [inboxRoot, owner]);

  useEffect(() => {
    if (notify) fetchNotification();
  }, [notify]);

  return {
    fetchNotification,
    createNotification,
    createInbox,
    notifications
  };
};
