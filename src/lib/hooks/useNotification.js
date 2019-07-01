import { useCallback, useState } from 'react';
import { Notification } from '@classes';
import { SolidError } from '@utils';

export const useNotification = (inboxRoot, owner, schema) => {
  const [notifications, setNotifications] = useState([]);

  const createInbox = useCallback(async () => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);
      if (owner) await notify.createInbox();
    } catch (error) {
      throw error;
    }
  }, [owner]);

  const createNotification = useCallback(
    async content => {
      try {
        const notify = new Notification(owner, inboxRoot, schema);
        await notify.create(content);
      } catch (error) {
        throw new SolidError(error.message, 'Create notification', error.status);
      }
    },
    [inboxRoot]
  );

  const fetchNotification = useCallback(async () => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);

      if (notify) {
        console.log('Fetching', notify);
        const notificationList = await notify.fetch();
        setNotifications(notificationList);
      }
    } catch (error) {
      throw new SolidError(error.message, 'Fetch Notification', error.status);
    }
  });

  const deleteNotification = async (filename, inboxRoot) => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);
      await notify.delete(filename, inboxRoot);
    } catch (error) {
      throw new SolidError(error.message, 'Delete Notification', error.status);
    }
  };

  const deleteInbox = async () => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);
      notify.deleteInbox();
    } catch (error) {
      throw new SolidError(error.message, 'Delete Inbox Error', error.status);
    }
  };

  const markAsReadNotification = async notificationPath => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);
      await notify.markAsRead(notificationPath);
    } catch (error) {
      throw new SolidError(error.message, 'Update Notification', error.status);
    }
  };

  return {
    fetchNotification,
    createNotification,
    deleteNotification,
    markAsReadNotification,
    createInbox,
    notifications,
    deleteInbox
  };
};
