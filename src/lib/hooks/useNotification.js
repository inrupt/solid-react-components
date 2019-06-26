import { useCallback, useEffect } from 'react';
import { Notification } from '@classes';

export const useNotification = (inboxRoot, owner) => {
  const notify = new Notification();
  const createInbox = useCallback(async () => {
    try {
      if (owner) {
        console.log(owner);
        await notify.createInbox(inboxRoot, owner);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [inboxRoot, owner]);

  const createNotification = useCallback(async () => {
    await notify.create(inboxRoot);
  }, [inboxRoot]);

  const fetchNotification = useCallback(async () => {
    await notify.fetch(inboxRoot);
  }, [inboxRoot]);

  useEffect(() => {}, [inboxRoot, owner]);

  return {
    fetchNotification,
    createNotification,
    createInbox
  };
};
