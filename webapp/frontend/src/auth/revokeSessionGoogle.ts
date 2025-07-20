import { RevokeSessionGoogleResponseBody } from '../types/typesBackend';
import { PATH_REVOKE_SESSION_GOOGLE } from '../constants/constantsEndpointPaths';
import { URL_BACKEND } from '../constants/constantsImportMeta';

export async function revokeSessionGoogle() {
  const url = `${URL_BACKEND}/${PATH_REVOKE_SESSION_GOOGLE}`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // To send cookies
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    console.log('Google session revoked!');
  } else {
    console.warn(`Failed to revoke Google session: ${response.status} ${response.statusText}`);
    const { error } = (await response.json()) as RevokeSessionGoogleResponseBody;
    if (error) console.warn(`Error from backend: ${error}`);
  }
}
