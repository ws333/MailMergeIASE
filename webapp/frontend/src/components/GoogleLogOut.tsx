import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useStoreActions } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { revokeSessionGoogle } from '../auth/revokeSessionGoogle';

const GoogleLogOut = () => {
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);
  const navigate = useNavigate();

  const onClickLogout = async () => {
    await revokeSessionGoogle();
    googleLogout();
    removeLastLoginButtonClicked();
    resetCurrentLogin();
    void navigate('/', { replace: true });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <button className="logout-button" onClick={onClickLogout}>
      Logout
    </button>
  );
};

export default GoogleLogOut;
