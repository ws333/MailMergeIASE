import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginGoogleRequest, LoginGoogleResponseBody } from '../types/typesBackend';
import { PATH_LOGIN_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import { useStoreActions, useStoreState } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { getLoginGoogleInProgress, removeLoginGoogleInProgress } from '../helpers/localstorageHelpers';
import { useQueryParam } from './useQueryParam';

const failedPrefix = 'Failed to exchange code for tokens:';

export function useHandleGoogleAuthCode() {
  const [codeIsProcessed, setCodeIsProcessed] = useState(false);

  const currentLogin = useStoreState((state) => state.auth.currentLogin);
  const setCurrentLogin = useStoreActions((actions) => actions.auth.setCurrentLogin);
  const navigate = useNavigate();

  const code = useQueryParam('code');

  useEffect(() => {
    if (!code || codeIsProcessed) return;
    setCodeIsProcessed(true);

    async function exchangeGoogleAuthCode() {
      try {
        if (!code) return;

        const url = `${URL_BACKEND}/${PATH_LOGIN_GOOGLE}`;
        const payload: LoginGoogleRequest['body'] = { code };
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include', // To send cookies
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const { userEmail, accessToken, error } = (await response.json()) as LoginGoogleResponseBody;

          if (userEmail && accessToken) {
            setCurrentLogin({ provider: 'Google', userEmail, accessToken });
          } else {
            console.warn(`${failedPrefix} no userEmail/accessToken received from backend: ${error}`);
          }
        } else {
          console.warn(`${failedPrefix} ${response.status} ${response.statusText}`);
          const { error } = (await response.json()) as LoginGoogleResponseBody;
          if (error) console.warn(`Error from backend: ${error}`);
        }
      } catch (error) {
        if (error instanceof Error) console.warn(`${failedPrefix} ${error.message}`);
      } finally {
        removeLoginGoogleInProgress();
      }
    }

    const loginInProgress = getLoginGoogleInProgress();
    if (loginInProgress === 'true') void exchangeGoogleAuthCode();
  }, [code, setCurrentLogin, navigate, codeIsProcessed, setCodeIsProcessed, currentLogin.provider]);
}
