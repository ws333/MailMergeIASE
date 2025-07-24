import { COUNTRYCODE_URL, ERROR_FETCHING_COUNTRYCODE, IPINFO_URL } from "../constants/constants";
import { fetchWithTimeout } from "./fetchWithTimeout";

type CountryCode = {
    country_code: string;
    in_eu: string;
};

/**
 * - Get country code by IP address
 * - Docs at https://ip-api.com/docs/api:json
 */
export async function getCountryCodeByIP() {
    const errorMessage = ERROR_FETCHING_COUNTRYCODE;
    try {
        const responsePublicIP = await fetchWithTimeout({ url: IPINFO_URL, errorMessage });
        const publicIP = await responsePublicIP.text();
        if (!publicIP) return "";

        const countryCodeUrl = `${COUNTRYCODE_URL}${publicIP}/json/`;
        const response = await fetchWithTimeout({ url: countryCodeUrl, errorMessage });
        if (response.ok) {
            const respJson = (await response.json()) as CountryCode;
            return "country_code" in respJson ? respJson.country_code : "";
        } else {
            console.warn("Not able to get country code");
            return "";
        }
    } catch (error) {
        console.warn("Error getting country code:", error);
        return "";
    }
}
