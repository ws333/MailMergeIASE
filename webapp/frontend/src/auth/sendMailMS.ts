import { AccountInfo, IPublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { StatusBackend } from '../../../../addon/packages/interface/src/types/types';
import { PATH_SEND_EMAIL_MS } from '../constants/constants';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import { fetchSendEmail } from '../helpers/fetchSendEmail';

type Args = {
  email: Email;
  instance: IPublicClientApplication;
  accounts: AccountInfo[];
  scopes: string[];
};

export async function sendEmailMS({ email, instance, accounts, scopes }: Args): Promise<StatusBackend> {
  async function sendEmail(accessToken: string): Promise<StatusBackend> {
    const url = `${URL_BACKEND}/${PATH_SEND_EMAIL_MS}`;
    const response = await fetchSendEmail(url, accessToken, email);

    if (!response.ok) {
      const message = `Failed to send the email! The server responded with ${response.statusText}`;
      const errorString = `HTTP error! status: ${response.status.toString()}`;
      return { status: 'OK', message, errorString: errorString };
    }

    const responseText = await response.text();
    const message = `${responseText} - ${new Date().toLocaleString()}`;
    return { status: 'OK', message };
  }

  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes,
      account: accounts[0],
    });
    const accessToken = tokenResponse.accessToken;

    return await sendEmail(accessToken);
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const tokenResponse = await instance.acquireTokenPopup({ scopes });
      const accessToken = tokenResponse.accessToken;

      return await sendEmail(accessToken);
    } else {
      const errorMessage = (error as Error).message;
      const errorString = `Unhandled error in sendEmailMSAL: ${errorMessage}`;
      const message = `Failed to send email! An unexpected error occured, please contact support.`;
      return { status: 'ERROR', message, errorString };
    }
  }
}
