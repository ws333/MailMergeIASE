import { Email, ProjectEnvProps } from '../../../../addon/packages/interface/src/types/types';
import { sendEmailGoogle } from '../helpers/sendEmailGoogle';
import { sendEmailMS } from '../helpers/sendEmailMS';
import { loginRequest } from '../auth/authConfigMS';
import { useStoreState } from '../store/storeWithHooks';
import { useCheckAndSetCurrentLoginMS } from './useCheckAndSetCurrentLoginMS';
import { useHandleGoogleAuthCode } from './useHandleGoogleAuthCode';

export function useCurrentLogin() {
  const { accountsMS, inProgressMS, instanceMS } = useCheckAndSetCurrentLoginMS();
  useHandleGoogleAuthCode();

  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  const { scopes } = loginRequest;
  const { provider, userEmail } = currentLogin;

  let sendEmailFn: ProjectEnvProps['sendEmailFn'] = (_email: Email) =>
    new Promise<void>((_resolve, _reject) => {
      throw new Error('Not logged in!');
    });

  if (provider === 'Google') {
    sendEmailFn = async (email: Email) =>
      await sendEmailGoogle({ accessToken: currentLogin.accessToken ?? '', email: { ...email, from: userEmail } });
  }

  if (provider === 'MS') {
    sendEmailFn = async (email: Email) =>
      await sendEmailMS({ email: { ...email, from: userEmail }, instance: instanceMS, accounts: accountsMS, scopes });
  }

  return { accountsMS, inProgressMS, instanceMS, userEmail, provider, sendEmailFn };
}
