import { ContactI3C } from "../types/typesI3C";
import {
    CONTACTS_CSV_URL,
    ERROR_EMPTY_CONTACTS_ARRAY,
    ERROR_FETCHING_CONTACTS,
    NATIONS_CSV_URL,
    NATION_OPTIONS_FALLBACK,
} from "../constants/constants";
import { checkNoOverlapActiveDeletedContacts } from "./checkNoOverlapActiveDeleted";
import { csvParse } from "./csvParse";
import { fetchWithTimeout } from "./fetchWithTimeout";
import {
    getActiveContacts,
    initializeStorage,
    removeActiveContactByUid,
    storeActiveContacts,
    storeDeletedContacts,
} from "./indexedDB";

export async function fetchOnlineNations(): Promise<string[]> {
    try {
        const response = await fetchWithTimeout({ url: NATIONS_CSV_URL, errorMessage: ERROR_FETCHING_CONTACTS }); // Display the same error as for contacts in the ErrorBoundary
        const csvText = await response.text();
        const nations = /^[A-Z,]+$/.exec(csvText)?.toString().split(","); // Only allow uppercase letters and commas
        return nations ?? NATION_OPTIONS_FALLBACK;
    } catch (error) {
        console.warn("fetchOnlineNations:", error);
        throw error;
    }
}

async function fetchOnlineContacts(): Promise<ContactI3C[]> {
    try {
        const response = await fetchWithTimeout({ url: CONTACTS_CSV_URL, errorMessage: ERROR_FETCHING_CONTACTS });
        const csvText = await response.text();
        return csvParse<ContactI3C>(csvText).data;
    } catch (error) {
        console.warn("fetchOnlineContacts:", error);
        throw error;
    }
}

export async function fetchAndMergeContacts(fetchFn = fetchOnlineContacts): Promise<ContactI3C[]> {
    const onlineContacts = await fetchFn();
    if (!onlineContacts.length) throw ERROR_EMPTY_CONTACTS_ARRAY;

    await initializeStorage(onlineContacts); // Initialize indexedDB storage
    const localContacts = await getActiveContacts();

    // Create a Set of online UIDs for O(1) lookups
    const onlineContactUids = new Set(onlineContacts.map((contact) => contact.uid));

    // Find local contacts that are not in onlineContacts - O(n) operation
    const deletedContacts = localContacts.filter(
        (localContact) => !onlineContactUids.has(localContact.uid) && localContact.sc > 0
    );

    // Set deletionDate
    const now = Date.now();
    deletedContacts.forEach((contact) => {
        contact.dd = now;
    });
    if (deletedContacts.length) {
        console.log("Deleted contacts:");
        console.table(deletedContacts);
    }

    // Update indexedDB store deletedContacts
    await storeDeletedContacts(deletedContacts);

    // Remove deleted contacts from indexedDB store activeContacts
    for await (const contact of deletedContacts) {
        await removeActiveContactByUid(contact.uid);
    }

    // Check for no overlap between active and deleted contacts in indexedDB
    const isOverlap = await checkNoOverlapActiveDeletedContacts();
    if (isOverlap) console.error("Overlap between active and deleted contacts in indexedDB!");

    // Create a Map for local contacts using UID as key for O(1) lookups
    const localContactsMap = new Map(localContacts.map((contact) => [contact.uid, contact]));

    // Merge the online contacts with the local contacts - O(n) operation
    const mergedContacts = onlineContacts.map((oc): ContactI3C => {
        const local = localContactsMap.get(oc.uid);
        return local?.sd
            ? {
                  ...oc,
                  sd: local.sd,
                  sc: local.sc,
                  cf1: local.cf1,
                  cf2: local.cf2,
              }
            : oc;
    });

    await storeActiveContacts(mergedContacts);

    return mergedContacts;
}
