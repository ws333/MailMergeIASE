import { AccountInfo, IPublicClientApplication } from '../types/types';
import HeaderButtons from './HeaderButtons';
import MSLogOut from './MSLogOut';

type Props = {
  accounts: AccountInfo[];
  instance: IPublicClientApplication;
};

function MSHeaderButtons({ accounts, instance }: Props) {
  const LogOutComponent = <MSLogOut instance={instance} />;
  const userEmail = accounts[0].username;
  return <HeaderButtons userEmail={userEmail} LogOutComponent={LogOutComponent} />;
}

export default MSHeaderButtons;
