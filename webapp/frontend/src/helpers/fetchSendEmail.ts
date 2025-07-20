import { Email } from '../../../../addon/packages/interface/src/types/modelTypes';

export async function fetchSendEmail(url: string, accessToken: string, email: Email) {
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessToken,
      to: email.to,
      subject: email.subject,
      emailBody: email.body,
    }),
  });
}
