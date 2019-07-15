/**
 * Notification hook
 * Create, delete notification and inbox.
 * We are using ldflex, solid-auth-client and N3.
 * Append permission on notifications: create a new file(notification) into the the receiver container(inbox)
 * An user can have more than one inbox to receive notifications.
 */
import { useCallback, useState, useEffect } from 'react';
import { Notification } from '@classes';
import { SolidError } from '@utils';

export const useNotification = owner => {
  const [notification, setNotifications] = useState({
    notifications: [],
    originalNotifications: [],
    unread: 0,
    notify: null
  });

  /**
   * Create container(inbox) with all the permissions ready to receive notifications
   * @type {Function}
   * @param {String} inboxPath container path where will leave the container into the pod.
   * @param {String} appPath file where will leave the path link(reference) for the user inbox.
   */
  const createInbox = useCallback(
    async (inboxPath, appPath) => {
      try {
        const { notify } = notification;
        if (owner && notify) await notify.createInbox(inboxPath, appPath);
      } catch (error) {
        throw error;
      }
    },
    [notification, owner]
  );

  /**
   * Create a notification file and send to user
   * @type {Function}
   * @param {Object} content object that has the content for the notification
   * @param {String} to path of the user that will receive the notification
   */
  const createNotification = useCallback(
    async (content, to) => {
      try {
        const { notify } = notification;
        await notify.create(content, to);
      } catch (error) {
        throw new SolidError(error.message, 'Create notification', error.status);
      }
    },
    [notification, owner]
  );

  /**
   * Fetch user notifications from an inboxes path
   * @type {Function}
   * @param {String} inboxes an array of inbox paths
   */
  const fetchNotification = useCallback(
    async inboxes => {
      const { notify } = notification;
      try {
        if (notify) {
          let notificationList = await notify.fetch(inboxes);
          notificationList = notificationList.sort(
            (a, b) => new Date(b.datetime) - new Date(a.datetime)
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
  /**
   * Delete notification file from user pod.
   * @type {Function}
   * @param {String} file full path where is located it the notification
   */
  const deleteNotification = useCallback(
    async file => {
      try {
        const { notify } = notification;
        await notify.delete(file);
      } catch (error) {
        throw new SolidError(error.message, 'Delete Notification', error.status);
      }
    },
    [notification, owner]
  );

  /**
   * Delete inbox container from user pod
   * @type {Function}
   * @param {String} inbox path of container to delete
   */
  const deleteInbox = useCallback(
    async inbox => {
      try {
        const { notify } = notification;
        notify.deleteInbox(inbox);
      } catch (error) {
        throw new SolidError(error.message, 'Delete Inbox Error', error.status);
      }
    },
    [notification, owner]
  );
  /**
   * Mark as read or unread a notification
   * @type {Function}
   * @param {String} file full path of notification
   * @param {String} id notification unique id
   */
  const markAsReadNotification = useCallback(
    async (file, id, status = 'true') => {
      try {
        const { notify } = notification;
        /**
         * Update notification read to true
         */
        if (id) {
          let updatedUnread;
          const { notifications: list, unread } = notification;
          const updatedNotification = list.map(item =>
            item.id === id ? { ...item, read: status } : item
          );

          if (status === 'true') {
            updatedUnread = unread === 0 ? 0 : unread - 1;
          } else {
            updatedUnread = unread + 1;
          }

          setNotifications({
            ...notification,
            notifications: updatedNotification,
            unread: updatedUnread
          });
        }
        await notify.markAsRead(file);
      } catch (error) {
        throw new SolidError(error.message, 'Update Notification', error.status);
      }
    },
    [notification, owner]
  );

  /**
   * Filter notification by inbox container
   * @type {Function}
   * @param {String} notification inbox name
   */
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

  /**
   * Find inbox container from a user document
   * @type {function(*=): (*|Promise<boolean|*|undefined>)}
   * @param {String} document url of the file into the pod.
   */
  const discoveryInbox = useCallback(
    async document => {
      const { notify } = notification;
      return notify.discoveryInbox(document);
    },
    [owner, notification.notify]
  );

  /**
   * init Notification instance when hook mount
   */
  useEffect(() => {
    const notify = new Notification(null);
    setNotifications({ ...notification, notify });
  }, []);

  /**
   * After hook receive the owner will set it into Notification instance
   */
  useEffect(() => {
    if (notification.notify) {
      const { notify } = notification;
      notify.setOwner(owner);
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
