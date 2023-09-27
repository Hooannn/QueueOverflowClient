import OneSignal from 'react-onesignal';
const ONE_SIGNAL_APPID = import.meta.env.VITE_ONE_SIGNAL_APPID;

export default () => {
  const initialize = async (uid?: string) => {
    await OneSignal.init({
      appId: ONE_SIGNAL_APPID,
    });
    if (uid) OneSignal.setExternalUserId(uid);
    const status = await OneSignal.getNotificationPermission();
    if (status === 'denied') {
      OneSignal.showSlidedownPrompt();
    }
  };

  return { initialize };
};
