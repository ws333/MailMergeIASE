import { useMsal } from '@azure/msal-react';
import { Route, Routes } from 'react-router-dom';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { ROUTE_PATH } from '../constants/constants';
import App from '../../../../addon/packages/interface/src/components/App';
import { getProjectEnvironment } from '../../../../addon/packages/interface/src/helpers/getProjectEnvironment';
import { loginRequest } from '../auth/authConfig';
import { sendEmailMSAL } from '../auth/sendMailMSAL';
import EmailSenderInfo from './EmailSenderInfo';
import LogIn from './LogIn';
import Page404 from './Page404';
import ProtectedRoute from './ProtectedRoute';

function ProjectEnvironment() {
  const environment = getProjectEnvironment();

  const { instance, accounts } = useMsal();
  const { scopes } = loginRequest;

  const sendMailFn = async (email: Email) => await sendEmailMSAL({ email, instance, accounts, scopes });
  const InfoComponent = <EmailSenderInfo accounts={accounts} />;

  return (
    <div>
      <Routes>
        <Route index element={<LogIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE_PATH}>
            <Route
              index
              element={<App environment={environment} sendEmailFn={sendMailFn} InfoComponent={InfoComponent} />}
            />
          </Route>
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default ProjectEnvironment;
