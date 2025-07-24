import { Route, Routes } from 'react-router-dom';
import { ProjectEnvironment } from '../../../../addon/packages/interface/src/types/types';
import { PATH_PROTECTED } from '../constants/constants';
import App from '../../../../addon/packages/interface/src/components/App';
import { useCurrentLogin } from '../hooks/useCurrentLogin';
import { pingBackend } from '../helpers/pingBackend';
import GoogleHeaderButtons from './GoogleHeaderButtons';
import LogIn from './LogIn';
import MSHeaderButtons from './MSHeaderButtons';
import Page404 from './Page404';
import ProtectedRoute from './ProtectedRoute';

function SetProjectEnvironment() {
  const environment: ProjectEnvironment = 'webapp';

  const { accountsMS, inProgressMS, instanceMS, userEmail, provider, sendEmailFn } = useCurrentLogin();

  const sendEmailPreflightFn = pingBackend;

  const HeaderButtonsComponent =
    provider === 'MS' ? (
      <MSHeaderButtons accounts={accountsMS} instance={instanceMS} />
    ) : (
      <GoogleHeaderButtons userEmail={userEmail} />
    );

  return (
    <Routes>
      <Route path="/" element={<LogIn accountsMS={accountsMS} instanceMS={instanceMS} />} />
      <Route element={<ProtectedRoute accountsMS={accountsMS} inProgressMS={inProgressMS} />}>
        <Route
          path={PATH_PROTECTED}
          element={
            <App
              environment={environment}
              sendEmailFn={sendEmailFn}
              sendEmailPreflightFn={sendEmailPreflightFn}
              HeaderButtonsComponent={HeaderButtonsComponent}
            />
          }
        />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default SetProjectEnvironment;
