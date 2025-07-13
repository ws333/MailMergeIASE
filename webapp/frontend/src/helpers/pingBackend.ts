import { StatusBackend } from '../../../../addon/packages/interface/src/types/types';
import { PING_BACKEND } from '../constants/constants';
import { URL_BACKEND } from '../constants/constantsImportMeta';
import { fetchWithTimeout } from '../../../../addon/packages/interface/src/helpers/fetchWithTimeout';
import { waitRandomSeconds } from '../../../../addon/packages/interface/src/helpers/waitRandomSeconds';

const BACKEND_NOT_RESPONDING: StatusBackend = {
  status: 'ERROR',
  message:
    'There is no connection to the server sending the emails\nVerify that you are online. If you are online, the server is probably down.',
  errorString: 'Backend not responding to ping! Server might be down or client is offline',
};

export async function pingBackend(): Promise<StatusBackend> {
  const fetchPing = () =>
    fetchWithTimeout({
      url: new URL(PING_BACKEND, URL_BACKEND),
      errorMessage: BACKEND_NOT_RESPONDING.errorString ?? '',
    });

  // First check if backend is responding
  let responsePing = await fetchPing()
    .catch(async (_error: unknown) => {
      // Try once more
      await waitRandomSeconds();
      responsePing = await fetchPing();
    })
    .catch((_error: unknown) => {
      // Give up and log error
      console.warn(BACKEND_NOT_RESPONDING.errorString);
    });

  const pingAnswer = await responsePing?.text();
  return pingAnswer === PING_BACKEND ? { status: 'OK', message: pingAnswer } : BACKEND_NOT_RESPONDING;
}
