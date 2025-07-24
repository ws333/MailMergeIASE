import { Navigate, Outlet } from 'react-router-dom';
import { AccountInfo, InteractionStatus } from '../types/types';
import Loading from '../../../../addon/packages/interface/src/components/Loading';
import { useCheckAndSetCurrentLoginMS } from '../hooks/useCheckAndSetCurrentLoginMS';
import { useVerifyAndRefreshSession } from '../hooks/useVerifyAndRefreshSession';
import { getLoginGoogleInProgress } from '../helpers/localstorageHelpers';
import { useStoreState } from '../store/storeWithHooks';

type Props = {
  accountsMS: AccountInfo[];
  inProgressMS: InteractionStatus;
};

function ProtectedRoute({ accountsMS, inProgressMS }: Props) {
  const loginGoogleInProgress = getLoginGoogleInProgress();

  const currentLogin = useStoreState((state) => state.auth.currentLogin);

  useCheckAndSetCurrentLoginMS();

  const { verifyInProgessGoogle, lastClickedLogin } = useVerifyAndRefreshSession({
    loginGoogleInProgress,
  });

  // Wait for MSAL and verifyAndRefreshSessionGoogle to finish processing before checking authentication
  // Checking loginInProgress === 'cleanedup' is for handling user navigating away from Google login before done
  // This leaves localstorage key loginGoogleInprogress set to 'true'. Hook useVerifyAndRefreshSession detects this
  // edge case and sets it to 'cleanup' to show Loading component until verification of authentication is done
  if (
    inProgressMS !== 'none' ||
    ((loginGoogleInProgress === 'cleanedup' || verifyInProgessGoogle) && lastClickedLogin === 'Google') ||
    (currentLogin.provider == null && lastClickedLogin === 'Google')
  ) {
    return <Loading showSpinner={false} />;
  }

  const isAuthenticatedMS = accountsMS.length > 0 && lastClickedLogin === 'MS';
  const isAuthenticatedGoogle = currentLogin.provider === 'Google' && lastClickedLogin === 'Google';

  const isAuthenticated = isAuthenticatedMS || isAuthenticatedGoogle;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
