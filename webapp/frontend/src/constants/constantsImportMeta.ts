/**
 * Separate file for contants using import.meta as they cause vite bulid error when in
 * constants.ts which is imported by vite.config.ts
 */
import { URL_BACKEND_DEV, URL_BACKEND_PROD } from './constants';

export const URL_BACKEND = import.meta.env.PROD ? URL_BACKEND_PROD.href : URL_BACKEND_DEV.href;
