/**
 * Used for testing with postman
 */

const accessToken = 'REPLACE WITH TOKEN';
const email = 'REPLACE WITH EMAIL';
const emailBody = 'REPLACE WITH EMAIL TEMPLATE';

export function createJSONFetchPayload() {
  const payload = JSON.stringify({
    accessToken,
    to: email,
    subject: 'Some random subject',
    text: emailBody,
  });
  console.log(payload);
  return payload;
}

createJSONFetchPayload();
