import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from 'react-router-dom';
import { store } from './@core/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import getRouter from './@core/router/index';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FirebaseProvider } from './contexts/FirebaseContext';
import type { FirebaseOptions } from 'firebase/app';

const isDev = import.meta.env.VITE_NODE_ENV === 'dev';
const persistor = persistStore(store);
const queryClient = new QueryClient();

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyBRKICAxr19oPPoMMZQXNOlFIFNLVA0Pn4',
  authDomain: 'queueoverflow-acf55.firebaseapp.com',
  projectId: 'queueoverflow-acf55',
  storageBucket: 'queueoverflow-acf55.appspot.com',
  messagingSenderId: '211966932578',
  appId: '1:211966932578:web:3175ffe1575cb9729a833b',
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider config={firebaseConfig}>
          <RouterProvider router={getRouter(isDev)}></RouterProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </PersistGate>
    <ToastContainer />
  </Provider>,
);
