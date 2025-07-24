import { CHECK_IF_ONLINE_URLS, ERROR_NETWORK_OFFLINE } from "../constants/constants";
import { FetchWithTimeoutInit, fetchWithTimeout } from "./fetchWithTimeout";

export async function isOnline() {
    const [url1, url2] = CHECK_IF_ONLINE_URLS;
    const errorMessage = ERROR_NETWORK_OFFLINE;
    const init: FetchWithTimeoutInit = {
        method: "HEAD",
        cache: "no-store",
    };

    let _isOnline = false;

    try {
        await fetchWithTimeout({
            url: url1,
            errorMessage,
            init,
        });
        _isOnline = true;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.warn(`${url1} is not reachable!`);

        try {
            await fetchWithTimeout({
                url: url2,
                errorMessage,
                init,
            });
            _isOnline = true;
        } catch (error) {
            console.warn(`${url1} is still not reachable!`);
            console.debug(error);
            throw error;
        }
    }

    return _isOnline;
}
