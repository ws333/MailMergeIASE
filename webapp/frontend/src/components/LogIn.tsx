import { useMsal } from '@azure/msal-react';
import { CSSProperties } from 'react';
import HeaderWithIFO from '../../../../addon/packages/interface/src/components/HeaderWithIFO';
import { loginRequest } from '../auth/authConfig';

const divStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100%',
};

const LogIn = () => {
  const { instance } = useMsal();

  const onClickLogin = () => {
    instance
      .loginRedirect({
        ...loginRequest,
      })
      .catch((error: unknown) => console.log(error));
  };

  return (
    <div style={divStyles}>
      <HeaderWithIFO />
      <button onClick={onClickLogin}>Login with Microsoft</button>
    </div>
  );
};

export default LogIn;
