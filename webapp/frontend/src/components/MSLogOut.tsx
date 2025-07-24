import { Button } from '@lib/ui/index';
import { IPublicClientApplication } from '../types/types';
import { POST_LOGOUT_REDIRECT_URI } from '../constants/constantsImportMeta';
import { removeLastLoginButtonClicked } from '../helpers/localstorageHelpers';
import { useStoreActions } from '../store/storeWithHooks';

type Props = {
  instance: IPublicClientApplication;
};

const MSLogOut = ({ instance }: Props) => {
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

  return <Button onClick={onClickLogout}>Logout</Button>;
};

export default MSLogOut;
