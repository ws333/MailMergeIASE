import { Request } from 'express';

// Keep this synced between backend and frontend
export interface LoginGoogleRequest extends Request {
  body: {
    code: string;
  };
}

// Keep this synced between backend and frontend
export interface LoginGoogleResponseBody {
  userEmail?: string;
  accessToken?: string | null;
  error?: string;
}

// Keep this synced between backend and frontend
export interface VerifySessionGoogleResponseBody {
  valid: boolean;
  userEmail?: string;
  accessToken?: string | null;
  error?: string;
}

// Keep this synced between backend and frontend
export type RefreshSessionGoogleResponseBody = Omit<VerifySessionGoogleResponseBody, 'valid'>;

// Keep this synced between backend and frontend
export interface RevokeSessionGoogleResponseBody {
  error?: string;
}

// Keep this synced between backend and frontend
export interface SendEmailGoogleRequest extends Request {
  body: {
    accessToken: string;
    to: string;
    subject: string;
    emailBody: string; // HTML content
  };
}

// Keep this synced between backend and frontend
export interface SendEmailGoogleResponseBody {
  message?: string;
  error?: string;
}

// Keep this synced between backend and frontend
export interface SendEmailMSRequest extends Request {
  body: {
    accessToken: string;
    to: string;
    subject: string;
    emailBody: string; // HTML content
  };
}

// Keep this synced between backend and frontend
export interface SendEmailMSResponseBody {
  message?: string;
  error?: string;
}
