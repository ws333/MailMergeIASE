import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useStoreActions } from '../../../../addon/packages/interface/src/hooks/storeHooks';
import { getLastLoginButtonClicked } from '../helpers/localstorageHelpers';

export function useSetCurrentLoginMS() {
  const { accounts } = useMsal();

  const setCurrentLogin = useStoreActions((actions) => actions.auth.setCurrentLogin);

  useEffect(() => {
    const lastButton = getLastLoginButtonClicked();
    if (accounts.length > 0 && lastButton === 'MS') {
      setCurrentLogin({ provider: 'MS', userEmail: accounts[0].username });
    }
  }, [accounts, setCurrentLogin]);
}
