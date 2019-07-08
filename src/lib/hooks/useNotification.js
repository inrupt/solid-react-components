import { useCallback, useState, useEffect } from 'react';
import { Notification } from '@classes';
import { SolidError } from '@utils';

export const useNotification = owner => {
  const [notifications, setNotifications] = useState({
    notifications: [],
    unread: 0,
    notify: null
  });

  const createInbox = useCallback(
    async inboxPath => {
      try {
        if (owner && notifications.notify) await notifications.notify.createInbox(inboxPath);
      } catch (error) {
        throw error;
      }
    },
    [notifications]
  );

  const createNotification = useCallback(
    async (content, to) => {
      try {
        const { notify } = notifications;
        await notify.create(content, to);
      } catch (error) {
        throw new SolidError(error.message, 'Create notification', error.status);
      }
    },
    [notifications]
  );

  const fetchNotification = useCallback(
    async (url, shape) => {
      const { notify } = notifications;
      try {
        if (notify) {
          const notificationList = await notify.fetch(url, shape);
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
    },
    [notifications]
  );

  const deleteNotification = useCallback(
    async fileName => {
      try {
        const { notify } = notifications;
        await notify.delete(fileName);
      } catch (error) {
        throw new SolidError(error.message, 'Delete Notification', error.status);
      }
    },
    [notifications]
  );

  const deleteInbox = useCallback(async () => {
    try {
      const { notify } = notifications;
      notify.deleteInbox();
    } catch (error) {
      throw new SolidError(error.message, 'Delete Inbox Error', error.status);
    }
  }, [notifications]);

  const markAsReadNotification = useCallback(
    async (notificationPath, id) => {
      try {
        const { notify } = notifications;
        /**
         * Update notification read to true
         */
        if (id) {
          const { notifications: list, unread } = notifications;
          const updatedNotification = list.map(item =>
            item.id === id ? { ...item, read: 'true' } : item
          );
          const updatedUnread = unread === 0 ? 0 : unread - 1;
          setNotifications({
            ...notifications,
            notifications: updatedNotification,
            unread: updatedUnread
          });
        }
        await notify.markAsRead(notificationPath);
      } catch (error) {
        throw new SolidError(error.message, 'Update Notification', error.status);
      }
    },
    [notifications]
  );

  useEffect(() => {
    if (owner) {
      const notify = new Notification(owner);
      setNotifications({ ...notifications, notify });
    }
  }, [owner]);

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
