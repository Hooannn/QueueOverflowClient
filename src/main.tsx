import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
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
import './libs/i18n';

const isDev = import.meta.env.VITE_NODE_ENV === 'dev';
const persistor = persistStore(store);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider
    theme={{ token: { colorPrimary: '#2D2727' } }}
    children={
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={getRouter(isDev)} />
          </QueryClientProvider>
        </PersistGate>
        <ToastContainer />
      </Provider>
    }
  ></ConfigProvider>,
);
