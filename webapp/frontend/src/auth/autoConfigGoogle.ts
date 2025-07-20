import { REDIRECT_URI } from '../constants/constantsImportMeta';

export const GOOGLE_OAUTH_CLIENT_ID = '854752915737-5sh7ikrs9e65o0qoptpob3fi92c1aill.apps.googleusercontent.com';

export const GOOGLE_LOGIN_CONFIG = {
  flow: 'auth-code',
  ux_mode: 'redirect',
  redirect_uri: REDIRECT_URI,
  scope: 'openid email profile https://www.googleapis.com/auth/gmail.send',
} as const;
