import GoogleLogOut from './GoogleLogOut';
import HeaderButtons from './HeaderButtons';

type Props = {
  userEmail: string;
};

function GoogleHeaderButtons({ userEmail }: Props) {
  const LogOutComponent = <GoogleLogOut />;
  return <HeaderButtons userEmail={userEmail} LogOutComponent={LogOutComponent} />;
}

export default GoogleHeaderButtons;
