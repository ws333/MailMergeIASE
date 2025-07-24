import { useEffect, useState } from 'react';
import { VerifySessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_VERIFY_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

export function useIsActiveGoogleLogin() {
  const [isActiveGoogleLogin, setIsActiveGoogleLogin] = useState({ status: false, userEmail: '' });

  useEffect(() => {
    let isUnmounted = false;
    async function checkSession() {
      try {
        const urlVerify = `${URL_BACKEND}/${PATH_VERIFY_SESSION_GOOGLE}`;
        const res = await fetch(urlVerify, { credentials: 'include' });
        if (!res.ok) return;

        const { valid, userEmail } = (await res.json()) as VerifySessionGoogleResponseBody;
        if (!isUnmounted && userEmail) {
          setIsActiveGoogleLogin({ status: valid, userEmail });
        }
      } catch (error) {
        console.warn(`Error checking for active Google login: ${error}`);
      }
    }
    void checkSession();
    return () => {
      isUnmounted = true;
    };
  }, []);

  return { isActiveGoogleLogin };
}
