import { useMsal } from '@azure/msal-react';
import { useGoogleLogin } from '@react-oauth/google';
import { CSSProperties } from 'react';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { setLastLoginButtonClicked, setLoginGoogleInProgress } from '../helpers/localstorageHelpers';
import { loginRequest } from '../auth/authConfigMS';
import { GOOGLE_LOGIN_CONFIG } from '../auth/autoConfigGoogle';

const outerDivStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
};

const buttonDivStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  marginTop: '2rem',
};

const LogIn = () => {
  const { instance } = useMsal();

  const onClickLoginMS = () => {
    setLastLoginButtonClicked('MS');
    instance
      .loginRedirect({
        ...loginRequest,
      })
      .catch((error: unknown) => console.log(error));
  };

  const googleLogin = useGoogleLogin(GOOGLE_LOGIN_CONFIG);

  const onClickGoogleLogin = () => {
    setLastLoginButtonClicked('Google');
    setLoginGoogleInProgress('true');
    googleLogin();
  };

  return (
    <div style={outerDivStyles}>
      <HeaderWithIFO />
      <div style={buttonDivStyles}>
        <button onClick={onClickLoginMS}>Login with Microsoft</button>
        <button onClick={onClickGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default LogIn;
