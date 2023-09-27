import { FC } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const ErrorPage: FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  return (
    <div id="error-page" className="error-page">
      <span className="oops-title">Oops!</span>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {error.status} - {error.statusText || error.message}
        </i>
      </p>

      <Button onClick={() => navigate('/')}>Back to home</Button>
    </div>
  );
};

export default ErrorPage;
