import { useCallback, useEffect, useState } from 'react';
import { Notification } from '@classes';
import { SolidError } from '@utils';

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
      await notify.createInbox();
      const notificationList = await notify.fetch();
      setNotifications(notificationList);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async (filename, inboxRoot) => {
    try {
      await notify.delete(filename, inboxRoot);
    } catch (error) {
      throw new SolidError(error.message, 'Delete Notification', error.status);
    }
  };

  const markAsReadNotification = async notificationPath => {
    try {
      await notify.markAsRead(notificationPath);
    } catch (error) {
      throw new SolidError(error.message, 'Update Notification', error.status);
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
    deleteNotification,
    markAsReadNotification,
    createInbox,
    notifications
  };
};
