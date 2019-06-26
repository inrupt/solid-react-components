import { useCallback, useEffect } from 'react';
import { Notification } from '@classes';

export const useNotification = (inboxRoot, owner, schema = '/shapes/notification.json') => {
  const notify = new Notification(owner, inboxRoot, schema);
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

  const createNotification = useCallback(
    async content => {
      await notify.create(content);
    },
    [inboxRoot]
  );

  const fetchNotification = useCallback(async () => {
    await notify.fetch();
  }, [inboxRoot]);

  useEffect(() => {}, [inboxRoot, owner]);

  return {
    fetchNotification,
    createNotification,
    createInbox
  };
};
