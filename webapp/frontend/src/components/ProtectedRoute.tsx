import { Navigate, Outlet } from 'react-router-dom';
import { PATH_WEBAPP } from '../constants/constants';
import Loading from '../../../../addon/packages/interface/src/components/Loading';
import { useStoreState } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { useVerifyAndRefreshSession } from '../hooks/useVerifyAndRefreshSession';
import { getLoginGoogleInProgress } from '../helpers/localstorageHelpers';

function ProtectedRoute() {
  const loginInProgress = getLoginGoogleInProgress();

  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  const { accountsMS, inProgressMS, verifyInProgessGoogle, lastClickedLogin } = useVerifyAndRefreshSession({
    loginGoogleInProgress: loginInProgress,
  });

  // Wait for MSAL and verifyAndRefreshSessionGoogle to finish processing before checking authentication
  // Checking loginInProgress === 'cleanedup' is for handling user navigating away from Google login before done
  // This leaves localstorage key loginGoogleInprogress set to 'true'. Hook useVerifyAndRefreshSession detects this
  // edge case and sets it to 'cleanup' to show Loading component until verification of authentication is done
  if (
    inProgressMS !== 'none' ||
    ((loginInProgress === 'cleanedup' || verifyInProgessGoogle) && lastClickedLogin === 'Google')
  ) {
    return <Loading showSpinner={false} />;
  }

  const isAuthenticatedMS = accountsMS.length > 0 && lastClickedLogin === 'MS';
  const isAuthenticatedGoogle = currentLogin.provider === 'Google' && lastClickedLogin === 'Google';

  const isAuthenticated = isAuthenticatedMS || isAuthenticatedGoogle;

  return isAuthenticated ? <Outlet /> : <Navigate to={`/${PATH_WEBAPP}`} replace />;
}

export default ProtectedRoute;
