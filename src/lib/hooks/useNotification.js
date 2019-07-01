import { useCallback, useState } from 'react';
import { Notification } from '@classes';
import { SolidError } from '@utils';

export const useNotification = (inboxRoot, owner, schema) => {
  const [notifications, setNotifications] = useState({ notifications: [], unread: 0 });

  const createInbox = useCallback(async () => {
    try {
      const notify = new Notification(owner, inboxRoot, schema);
      if (owner) await notify.createInbox();
    } catch (error) {
      throw error;
    }
  }, [owner, inboxRoot]);

  const createNotification = useCallback(
    async (content, to) => {
      try {
        const notify = new Notification(owner, inboxRoot, schema);
        await notify.create(content, to);
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
        const notificationList = await notify.fetch();
        /**
         * Get unread notifications
         * @type {number}
         */
        const unread = Array.isArray(notificationList)
          ? notificationList.filter(item => item.read === 'false').length
          : 0;

        /**
         * Set notifications list and unread notification count
         */
        setNotifications({
          ...notifications,
          notifications: notificationList,
          unread
        });
      }
    } catch (error) {
      throw new SolidError(error.message, 'Fetch Notification', error.status);
    }
  }, [inboxRoot]);

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
