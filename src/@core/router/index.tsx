import rootRouter from './RootRouter';
import authRouter from './AuthRouter';
import devRouter from './DevRouter';
import { createBrowserRouter } from 'react-router-dom';

const production = createBrowserRouter([...rootRouter, ...authRouter]);
const dev = createBrowserRouter([...rootRouter, ...authRouter, ...devRouter]);
const getRouter = (isDev: boolean) => (isDev ? dev : production);

export default getRouter;
