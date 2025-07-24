export const __DEV__ = import.meta.env.DEV;

export const DOCS_URL = "https://iase.one";
export const IASE_URL = "https://www.bashar.org/socialexperiment";
export const IPINFO_URL = "https://ipinfo.io/ip";
export const NATIONS_CSV_URL = "https://iase.one/contact_lists/nations.csv";
export const CONTACTS_CSV_URL = "https://iase.one/contact_lists/contactsI3C.csv";
export const CHECK_IF_ONLINE_URLS = [CONTACTS_CSV_URL, IPINFO_URL]; // If both fails we are offline, if only one fail the host is down and any cached data can be used.
export const COUNTRYCODE_URL = "https://ipapi.co/";

export const defaultFetchTimeout = 5000;

export const ERROR_ENVIRONMENT_UNKNOWN = "Not able to determine if running as an addon or as a web app!";
export const ERROR_NETWORK_OFFLINE = "You seem to be offline, please make sure you are connected to the Internet!";
export const ERROR_FETCHING_COUNTRYCODE = "Failed to download country code, please make sure that you are online...";
export const ERROR_FETCHING_CONTACTS = "Failed to download contact lists, please make sure that you are online...";
export const ERROR_EMPTY_CONTACTS_ARRAY = "Empty contacts array returned by fetchOnlineContacts";
export const ERROR_EMPTY_COUNTRY_CODES_ARRAY = "Not able to retrieve country codes, make sure you are online!";
export const ERROR_OVERLAP_ACTIVE_DELETED = "Overlap between active and deleted contacts in indexedDB!";

export const STORAGE_KEY = {
    CONTACTS: "contactsI3C",
    CONTACTS_DELETED: "contactsI3C_deleted",
    SENDING_LOG: "contactsI3C_sendingLog",
    LAST_IMPORT_EXPORT_DATE: "contactsI3C_lastImportExportDate",
    EXPORT_DATE: "contactsI3C_exportDate",
} as const;

export type StorageKey = keyof typeof STORAGE_KEY;

export const minSendingDelay = 1; // Minimum delay between emails being sent in seconds
export const defaultSendingDelay = 3;
export const defaultRandomWindow = 1;
export const fullProgressBarDelay = 2;

export const logsToDisplaySize = 1000;

export const maxCountOptions = [5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
export const defaultMaxCount = maxCountOptions[5];

export const sessionFinishedText = "Session finished!";

export const sessionStateKey = "sessionState";

export const zeroWidtSpace = "\u200b";

export const zipPassword = "Shivai2027!";
