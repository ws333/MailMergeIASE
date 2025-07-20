import { Provider, StatusBackend } from '../../../../addon/packages/interface/src/types/types';
import { SendEmailGoogleResponseBody, SendEmailMSResponseBody } from '../types/typesBackend';

export async function sendEmailResponseErrorParser<T extends SendEmailMSResponseBody | SendEmailGoogleResponseBody>(
  provider: Provider,
  response: Response,
): Promise<StatusBackend> {
  const { error: responseError } = (await response.json()) as T;
  console.warn(`sendEmail${provider} -> error from backend:`, responseError);
  const message = `Failed to send the email! The server responded with ${response.statusText}`;
  const error = `HTTP error: ${response.status} - Error from backend: ${responseError}`;
  return { status: 'ERROR', message, error };
}
