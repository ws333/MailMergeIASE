import { useMsal } from '@azure/msal-react';
import { POST_LOGOUT_REDIRECT_URI } from '../constants/constantsImportMeta';
import { useStoreActions } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';

const MSLogOut = () => {
  const { instance } = useMsal();
  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);

  const onClickLogout = () => {
    instance
      .logoutRedirect({
        account: instance.getActiveAccount(),
        postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
      })
      .then(() => {
        removeLastLoginButtonClicked();
        resetCurrentLogin();
      })
      .catch((error: unknown) => console.error('Error logging out', error));
  };

  return (
    <button className="logout-button" onClick={onClickLogout}>
      Logout
    </button>
  );
};

export default MSLogOut;
