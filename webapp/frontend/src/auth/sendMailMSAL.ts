import { AccountInfo, IPublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';
import { URL_SEND_EMAIL } from '../constants/constants';
import { fetchSendEmail } from '../helpers/fetchSendEmail';

type Args = {
  email: Email;
  instance: IPublicClientApplication;
  accounts: AccountInfo[];
  scopes: string[];
};

export async function sendEmailMSAL({ email, instance, accounts, scopes }: Args): Promise<string> {
  // setMessage("Sending email, please wait...");

  try {
    const tokenResponse = await instance.acquireTokenSilent({
      scopes,
      account: accounts[0],
    });
    const accessToken = tokenResponse.accessToken;

    const response = await fetchSendEmail(URL_SEND_EMAIL, accessToken, email);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status.toString()}`);

    const data = await response.text();
    const message = `${data} - ${new Date().toLocaleString()}`;

    // setMessage(message);

    return message;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      const tokenResponse = await instance.acquireTokenPopup({ scopes });
      const accessToken = tokenResponse.accessToken;

      const response = await fetchSendEmail(URL_SEND_EMAIL, accessToken, email);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status.toString()}`);

      const message = await response.text();
      //   setMessage(message);

      return message;
    } else {
      const message = `Failed to send email: ${(error as Error).message}`;
      return message;
    }
  }
}
