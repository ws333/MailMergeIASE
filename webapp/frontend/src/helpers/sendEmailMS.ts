import { AccountInfo, IPublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { StatusBackend } from '../../../../addon/packages/interface/src/types/types';
import { SendEmailMSResponseBody } from '../types/typesBackend';
import { ERROR_FAILED_SENDING_EMAIL } from '../constants/constants';
import { URL_SEND_EMAIL_MS } from '../constants/constantsImportMeta';
import { fetchSendEmail } from './fetchSendEmail';
import { sendEmailResponseErrorParser } from './sendEmailResponseErrorParser';

type Args = {
  email: Email;
  instance: IPublicClientApplication;
  accounts: AccountInfo[];
  scopes: string[];
};

export async function sendEmailMS({ email, instance, accounts, scopes }: Args): Promise<StatusBackend> {
  async function sendEmail(accessToken: string): Promise<StatusBackend> {
    const response = await fetchSendEmail(URL_SEND_EMAIL_MS, accessToken, email);

    if (!response.ok) {
      return await sendEmailResponseErrorParser<SendEmailMSResponseBody>('MS', response);
    }

    const { message } = (await response.json()) as SendEmailMSResponseBody;
    return { status: 'OK', message: `${message ?? ''} - ${new Date().toLocaleString()}` };
  }

  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes,
      account: accounts[0],
    });
    const accessToken = tokenResponse.accessToken;

    return await sendEmail(accessToken);
  } catch (catchError) {
    if (catchError instanceof InteractionRequiredAuthError) {
      const tokenResponse = await instance.acquireTokenPopup({ scopes });
      const accessToken = tokenResponse.accessToken;

      return await sendEmail(accessToken);
    } else {
      const message = ERROR_FAILED_SENDING_EMAIL;
      const error = `Unhandled error in sendEmailMS: ${catchError instanceof Error ? catchError.message : catchError}`;
      console.warn(error);
      return { status: 'ERROR', message, error };
    }
  }
}
