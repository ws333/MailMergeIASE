import { useMsal } from '@azure/msal-react';
import { Route, Routes } from 'react-router-dom';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import EmailSender from '../../../../addon/packages/interface/src/components/EmailSender';
import { getProjectEnvironment } from '../../../../addon/packages/interface/src/helpers/projectEnvironment';
import { loginRequest } from '../auth/authConfig';
import { sendEmailMSAL } from '../auth/sendMailMSAL';
import EmailSenderInfo from './EmailSenderInfo';
import LogIn from './LogIn';
import Page404 from './Page404';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const environment = getProjectEnvironment(); // Check if running as addon or webapp
  console.log('*Debug* -> App -> environment:', environment);

  const { instance, accounts } = useMsal();
  const { scopes } = loginRequest;

  const sendMailFn = async (email: Email) => await sendEmailMSAL({ email, instance, accounts, scopes });
  const InfoComponent = <EmailSenderInfo accounts={accounts} />;

  return (
    <div>
      <Routes>
        <Route index element={<LogIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="step3">
            <Route
              index
              element={<EmailSender environment={environment} sendEmailFn={sendMailFn} InfoComponent={InfoComponent} />}
            />
          </Route>
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
