import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginGoogleInProgress } from '../types/types';
import { RefreshSessionGoogleResponseBody, VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_REDIRECT } from '../constants/constants';
import { PATH_REFRESH_SESSION_GOOGLE, PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import {
  getLastLoginButtonClicked,
  removeLoginGoogleInProgress,
  setLoginGoogleInProgress,
} from '../helpers/localstorageHelpers';
import { useStoreActions, useStoreState } from '../store/storeWithHooks';

interface Args {
  loginGoogleInProgress: LoginGoogleInProgress;
}

export function useVerifyAndRefreshSession({ loginGoogleInProgress }: Args) {
  const setCurrentLogin = useStoreActions((state) => state.auth.setCurrentLogin);
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  const [verifyInProgessGoogle, setVerifyInProgressGoogle] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const lastClickedLogin = getLastLoginButtonClicked();

  // Check if we're in a legitimate Google OAuth flow
  const hasGoogleOAuthParams = location.search.includes('code=');

  useEffect(() => {
    async function verifyAndRefreshSessionGoogle(): Promise<void> {
      const failedPrefix = 'Failed to verify Google session:';

      try {
        const urlVerify = `${URL_BACKEND}/${PATH_VERIFY_SESSION_GOOGLE}`;
        const resVerify = await fetch(urlVerify, { credentials: 'include' });

        if (resVerify.status === 401) {
          // Not authorized - refresh access token
          const urlRefresh = `${URL_BACKEND}/${PATH_REFRESH_SESSION_GOOGLE}`;
          const resRefresh = await fetch(urlRefresh, { credentials: 'include' });

          if (resRefresh.ok) {
            const { userEmail, accessToken } = (await resRefresh.json()) as RefreshSessionGoogleResponseBody;

            if (userEmail && accessToken) {
              setCurrentLogin({ provider: 'Google', userEmail, accessToken });
            } else {
              console.warn(`${failedPrefix} no userEmail/accessToken received from backend`);
              resetCurrentLogin();
            }
            return;
          } else {
            // Status for resRefresh is not 200
            console.warn(`${failedPrefix} ${resRefresh.status} ${resRefresh.statusText}`);
            const { error } = (await resRefresh.json()) as RefreshSessionGoogleResponseBody;
            if (error) console.warn(`Error from backend: ${error}`);
            resetCurrentLogin();
            return;
          }
        } else if (!resVerify.ok) {
          // Status for resVerify is not 200 and other than 401 not authorized - reset currentLogin just in case
          resetCurrentLogin();
          return console.warn(`${failedPrefix} ${resVerify.status} ${resVerify.statusText}`);
        }

        // Session is still valid if we get this far
        const { valid, userEmail, accessToken, error } = (await resVerify.json()) as VerifySessionGoogleResponseBody;

        if (valid && userEmail && accessToken) {
          setCurrentLogin({ provider: 'Google', userEmail, accessToken });
        } else {
          console.warn(`${failedPrefix} error: ${error}`);
        }
      } catch (catchError) {
        console.error(`${failedPrefix} ${catchError}`);
      } finally {
        setVerifyInProgressGoogle(false);
        removeLoginGoogleInProgress(); // Remove any loginGoogleInProgress key left in localStorage when verification completes
      }
    }

    // Handle Google login flow
    if (lastClickedLogin === 'Google') {
      // If loginInProgress is true, but we're not in a legitimate OAuth flow, the user cancelled a Google Login.
      // Sets localstorage key loginGoogleInProgress to 'cleanedup' to show the Loading component while checking if already
      // authenticated when navigating to protected page. This prevents a brief display of the LogIn page.
      if (loginGoogleInProgress === 'true' && !hasGoogleOAuthParams) {
        setLoginGoogleInProgress('cleanedup');
        void navigate(`/${PATH_REDIRECT}`, { replace: true });
        return;
      }

      // Case 1: Fresh login in progress - wait for it to complete
      if (loginGoogleInProgress === 'true' && hasGoogleOAuthParams && !verifyInProgessGoogle) {
        setVerifyInProgressGoogle(true);
      }

      // Case 2: Login completed, now verify session
      if (loginGoogleInProgress !== 'true' && verifyInProgessGoogle) {
        void verifyAndRefreshSessionGoogle();
      }

      // Case 3: Returning user without current login state - verify existing session
      if (loginGoogleInProgress !== 'true' && !verifyInProgessGoogle && !currentLogin.provider) {
        setVerifyInProgressGoogle(true);
        void verifyAndRefreshSessionGoogle();
      }
    }
  }, [
    lastClickedLogin,
    loginGoogleInProgress,
    verifyInProgessGoogle,
    currentLogin.provider,
    hasGoogleOAuthParams,
    resetCurrentLogin,
    setCurrentLogin,
    navigate,
  ]);

  return { verifyInProgessGoogle, lastClickedLogin };
}
