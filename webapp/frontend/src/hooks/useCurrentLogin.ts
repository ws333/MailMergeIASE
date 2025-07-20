import { useMsal } from '@azure/msal-react';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { ProjectEnvProps } from '../../../../addon/packages/interface/src/types/types';
import { useStoreState } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { isDevMode } from '../../../../addon/packages/interface/src/helpers/getSetDevMode';
import { sendEmailGoogle } from '../helpers/sendEmailGoogle';
import { sendEmailMS } from '../helpers/sendEmailMS';
import { loginRequest } from '../auth/authConfigMS';
import { useHandleGoogleAuthCode } from './useHandleGoogleAuthCode';
import { useSetCurrentLoginMS } from './useSetCurrentLoginMS';

export function useCurrentLogin() {
  useSetCurrentLoginMS();
  useHandleGoogleAuthCode();

  const currentLogin = useStoreState((state) => state.auth.currentLogin);
  if (isDevMode() && currentLogin.provider) console.log('*Debug* -> useCurrentLogin -> currentLogin:', currentLogin);

  const { instance, accounts } = useMsal();
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
      await sendEmailMS({ email: { ...email, from: userEmail }, instance, accounts, scopes });
  }

  return { accounts, userEmail, provider, sendEmailFn };
}
