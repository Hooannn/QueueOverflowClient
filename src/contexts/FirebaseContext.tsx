import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../@core/store';
import { setEnabledPushNotifications, setFcmToken as setSavedFcmToken } from '../slices/app.slice';
import { useMutation } from 'react-query';
import useAxiosIns from '../hooks/useAxiosIns';
import { IResponseData } from '../types';
import { onError } from '../utils/error-handlers';
import { toast } from '../components/ui/use-toast';
const FirebaseContext = createContext<{
  instance: firebase.FirebaseApp | null;
  disabledPushNotifications?: (toastOnFinishing: boolean) => Promise<void>;
  enabledPushNotifications?: (toastOnFinishing: boolean) => Promise<void>;
}>({
  instance: null,
});

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children, config }: PropsWithChildren<{ config: firebase.FirebaseOptions }>) => {
  const [firebaseApp, setFirebaseApp] = useState<firebase.FirebaseApp | null>(null);
  const dispatch = useDispatch();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const isEnabledPushNotifications = useSelector((state: RootState) => state.app.enabledPushNotifications);
  const axios = useAxiosIns();

  const registerFcmTokenMutation = useMutation({
    mutationFn: (token: string) => axios.post<IResponseData<any>>('/v1/notifications/fcm/token', { web: token }),
    onError: onError,
  });

  const disabledPushNotifications = async (toastOnFinishing: boolean) => {
    if (firebaseApp) {
      await deleteToken(getMessaging(firebaseApp));
      dispatch(setEnabledPushNotifications(false));
      if (toastOnFinishing)
        toast({
          title: 'Success',
          description: 'Disabled push notifications',
        });
    }
  };

  const enabledPushNotifications = async (toastOnFinishing: boolean) => {
    if (firebaseApp) {
      const res = new Promise<void>((resolve, reject) => {
        getToken(getMessaging(firebaseApp), {
          vapidKey: 'BOO_V42pfMSOmGKaXoKqnUbGL1KdD9p4p7Xw3cyhCj6kH4xxn6BWiD7ZdmRsXJ-Av6iYzdWEHu6efV7NHb6Yvk0',
        })
          .then(token => {
            resolve();
            dispatch(setEnabledPushNotifications(true));
            registerFcmTokenMutation.mutateAsync(token).then(() => {
              dispatch(setSavedFcmToken(token));
            });
            if (toastOnFinishing)
              toast({
                title: 'Success',
                description: 'Enabled push notifications',
              });
          })
          .catch(err => {
            reject(err.message);
            dispatch(setEnabledPushNotifications(false));
            toast({
              variant: 'destructive',
              title: 'Error',
              description: err.message || JSON.stringify(err),
            });
          });
      });

      onMessage(getMessaging(firebaseApp), payload => {
        console.log('Message received. ', payload);
        // ...
      });

      return res;
    }
  };

  useEffect(() => {
    if (!isLogged || !firebaseApp) return;
    if (isEnabledPushNotifications) enabledPushNotifications(false);
  }, [firebaseApp, isLogged]);

  useEffect(() => {
    if (!firebaseApp) {
      const app = firebase.initializeApp(config);
      setFirebaseApp(app);
    }

    return () => {};
  }, [config, firebaseApp]);

  return (
    <FirebaseContext.Provider value={{ instance: firebaseApp, disabledPushNotifications, enabledPushNotifications }}>
      {children}
    </FirebaseContext.Provider>
  );
};
