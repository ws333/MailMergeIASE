import { CurrentLogin } from '../../../../addon/packages/interface/src/types/types';

export type LastLoginButtonValue = NonNullable<CurrentLogin['provider']>;

export type LoginGoogleInProgress = 'true' | 'cleanedup';

export type { AccountInfo, IPublicClientApplication, InteractionStatus } from '@azure/msal-browser';

export type { Provider } from '../../../../addon/packages/interface/src/types/types';
