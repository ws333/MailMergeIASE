/**
 * Separate file for contants using import.meta as they cause vite bulid error when in
 * constants.ts which is imported by vite.config.ts
 */
import {
  PATH_WEBAPP,
  PATH_WEBAPP_REDIRECT,
  SERVER_DEV,
  SERVER_PROD,
  URL_BACKEND_DEV,
  URL_BACKEND_PROD,
} from './constants';
import { PATH_SEND_EMAIL_GOOGLE, PATH_SEND_EMAIL_MS } from './constantsEndpointPaths';

export const REDIRECT_URI = import.meta.env.PROD
  ? `${SERVER_PROD}/${PATH_WEBAPP_REDIRECT}`
  : `${SERVER_DEV}/${PATH_WEBAPP_REDIRECT}`;

export const POST_LOGOUT_REDIRECT_URI = import.meta.env.PROD
  ? `${SERVER_PROD}/${PATH_WEBAPP}`
  : `${SERVER_DEV}/${PATH_WEBAPP}`;

export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD : URL_BACKEND_DEV;

export const URL_SEND_EMAIL_GOOGLE = `${URL_BACKEND}/${PATH_SEND_EMAIL_GOOGLE}`;
export const URL_SEND_EMAIL_MS = `${URL_BACKEND}/${PATH_SEND_EMAIL_MS}`;
