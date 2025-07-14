import { useMsal } from '@azure/msal-react';
import { Route, Routes } from 'react-router-dom';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { PATH_WEBAPP } from '../constants/constants';
import App from '../../../../addon/packages/interface/src/components/App';
import { getProjectEnvironment } from '../../../../addon/packages/interface/src/helpers/getProjectEnvironment';
import { pingBackend } from '../helpers/pingBackend';
import { loginRequest } from '../auth/authConfig';
import { sendEmailMS } from '../auth/sendMailMS';
import EmailSenderInfo from './EmailSenderInfo';
import LogIn from './LogIn';
import Page404 from './Page404';
import ProtectedRoute from './ProtectedRoute';

function SetProjectEnvironment() {
  const environment = getProjectEnvironment();

  const { instance, accounts } = useMsal();
  const { scopes } = loginRequest;

  const sendMailFn = async (email: Email) => await sendEmailMS({ email, instance, accounts, scopes });
  const sendEmailPreflightFn = pingBackend;
  const InfoComponent = <EmailSenderInfo accounts={accounts} />;

  return (
    <Routes>
      <Route index element={<LogIn />} />
      <Route element={<ProtectedRoute />}>
        <Route path={PATH_WEBAPP}>
          <Route
            index
            element={
              <App
                environment={environment}
                sendEmailFn={sendMailFn}
                sendEmailPreflightFn={sendEmailPreflightFn}
                InfoComponent={InfoComponent}
              />
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default SetProjectEnvironment;
