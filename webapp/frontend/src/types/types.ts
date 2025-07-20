import { CurrentLogin } from '../../../../addon/packages/interface/src/types/types';

export type LastLoginButtonValue = NonNullable<CurrentLogin['provider']>;

export type LoginGoogleInProgress = 'true' | 'cleanedup';
