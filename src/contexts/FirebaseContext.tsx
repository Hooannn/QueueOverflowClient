import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import toastConfig from '../configs/toast';
import * as firebase from 'firebase/app';
import { Messaging, getMessaging, getToken } from 'firebase/messaging';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../@core/store';
import { setFcmToken as setSavedFcmToken } from '../slices/app.slice';
import useNotifications from '../services/notifications';
const FirebaseContext = createContext<firebase.FirebaseApp | null>(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children, config }: PropsWithChildren<{ config: firebase.FirebaseOptions }>) => {
  const [firebaseApp, setFirebaseApp] = useState<firebase.FirebaseApp | null>(null);
  const [fcmToken, setFcmToken] = useState<string>();
  const dispatch = useDispatch();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const savedFcmToken = useSelector((state: RootState) => state.app.fcmToken);
  const { registerFcmTokenMutation } = useNotifications();
  useEffect(() => {
    if (fcmToken && fcmToken !== savedFcmToken) {
      registerFcmTokenMutation.mutateAsync(fcmToken).then(() => {
        dispatch(setSavedFcmToken(fcmToken));
      });
    }
  }, [fcmToken]);

  useEffect(() => {
    if (!isLogged || !firebaseApp) return;
    const messaging = getMessaging(firebaseApp);
    getToken(messaging, { vapidKey: 'BOO_V42pfMSOmGKaXoKqnUbGL1KdD9p4p7Xw3cyhCj6kH4xxn6BWiD7ZdmRsXJ-Av6iYzdWEHu6efV7NHb6Yvk0' })
      .then(token => {
        setFcmToken(token);
      })
      .catch(err => {
        toast(err.message || JSON.stringify(err), toastConfig('error'));
      });
  }, [firebaseApp, isLogged]);

  useEffect(() => {
    if (!firebaseApp) {
      const app = firebase.initializeApp(config);
      setFirebaseApp(app);
    }

    return () => {};
  }, [config, firebaseApp]);

  return <FirebaseContext.Provider value={firebaseApp}>{children}</FirebaseContext.Provider>;
};
