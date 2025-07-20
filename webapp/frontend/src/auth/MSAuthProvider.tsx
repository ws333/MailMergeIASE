import { AuthenticationResult, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfigMS';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const MSAuthProvider = ({ children }: AuthProviderProps) => {
  /**
   * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
   */
  const msalInstance = new PublicClientApplication(msalConfig);

  if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getActiveAccount());
  }

  // Listen for sign-in event and set active account
  msalInstance.addEventCallback((event: EventMessage) => {
    const authenticationResult = event.payload as AuthenticationResult | null;
    const account = authenticationResult?.account;
    if (event.eventType === EventType.LOGIN_SUCCESS && account) {
      msalInstance.setActiveAccount(account);
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};
