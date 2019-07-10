import { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { Notification } from '@classes';
import { SolidError } from '@utils';

export const useNotification = owner => {
  const [notification, setNotifications] = useState({
    notifications: [],
    originalNotifications: [],
    unread: 0,
    notify: null
  });

  const createInbox = useCallback(
    async (inboxPath, appPath) => {
      try {
        const notify = new Notification(owner);
        if (owner && notify) await notify.createInbox(inboxPath, appPath);
      } catch (error) {
        throw error;
      }
    },
    [notification, owner]
  );

  const createNotification = useCallback(
    async (content, to) => {
      try {
        // const { notify } = notification;
        const notify = new Notification(owner);
        await notify.create(content, to);
      } catch (error) {
        throw new SolidError(error.message, 'Create notification', error.status);
      }
    },
    [notification, owner]
  );

  const fetchNotification = useCallback(
    async (url, options) => {
      const { notify } = notification;
      try {
        if (notify) {
          let notificationList = await notify.fetch(url, options);
          notificationList = notificationList.sort(
            (a, b) =>
              // eslint-disable-next-line no-nested-ternary
              moment(b.sent).format('YYYYMMDD') - moment(a.sent).format('YYYYMMDD')
          );
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
            ...notification,
            notifications: notificationList,
            originalNotifications: notificationList,
            unread
          });
        }
      } catch (error) {
        throw new SolidError(error.message, 'Fetch Notification', error.status);
      }
    },
    [notification, owner]
  );

  const deleteNotification = useCallback(
    async fileName => {
      try {
        const { notify } = notification;
        await notify.delete(fileName);
      } catch (error) {
        throw new SolidError(error.message, 'Delete Notification', error.status);
      }
    },
    [notification, owner]
  );

  const deleteInbox = useCallback(async () => {
    try {
      const { notify } = notification;
      notify.deleteInbox();
    } catch (error) {
      throw new SolidError(error.message, 'Delete Inbox Error', error.status);
    }
  }, [notification, owner]);

  const markAsReadNotification = useCallback(
    async (notificationPath, id) => {
      try {
        const { notify } = notification;
        /**
         * Update notification read to true
         */
        if (id) {
          const { notifications: list, unread } = notification;
          const updatedNotification = list.map(item =>
            item.id === id ? { ...item, read: 'true' } : item
          );
          const updatedUnread = unread === 0 ? 0 : unread - 1;
          setNotifications({
            ...notification,
            notifications: updatedNotification,
            unread: updatedUnread
          });
        }
        await notify.markAsRead(notificationPath);
      } catch (error) {
        throw new SolidError(error.message, 'Update Notification', error.status);
      }
    },
    [notification, owner]
  );

  const filterNotification = useCallback(
    name => {
      const { originalNotifications } = notification;
      let filteredNotifications = [];
      if (name) {
        filteredNotifications = originalNotifications.filter(
          notification => notification.inboxName === name
        );
      } else {
        filteredNotifications = originalNotifications;
      }

      setNotifications({ ...notification, notifications: filteredNotifications });
    },
    [notification.notifications]
  );

  const discoveryInbox = useCallback(async () => {
    const { notify } = notification;
    return notify.discoveryInbox();
  });

  useEffect(() => {
    if (owner) {
      const notify = new Notification(owner);
      setNotifications({ ...notification, notify });
    }
  }, [owner]);

  return {
    fetchNotification,
    createNotification,
    filterNotification,
    deleteNotification,
    markAsReadNotification,
    discoveryInbox,
    createInbox,
    notification,
    deleteInbox
  };
};
