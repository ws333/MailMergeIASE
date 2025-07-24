import { ContactI3C } from "../types/typesI3C";
import {
    CONTACTS_CSV_URL,
    ERROR_EMPTY_CONTACTS_ARRAY,
    ERROR_EMPTY_COUNTRY_CODES_ARRAY,
    ERROR_FETCHING_CONTACTS,
    NATIONS_CSV_URL,
} from "../constants/constants";
import {
    checkIfActiveAndOnlineContactsSynced,
    checkOverlapIndexedDBActiveAndDeletedContacts,
} from "./checkOverlapInData";
import { csvParse } from "./csvParse";
import { fetchWithTimeout } from "./fetchWithTimeout";
import { getDevMode } from "./getSetDevMode";
import {
    getActiveContacts,
    getCountryCodesFetched,
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
        const countrycodes = nations ?? (await getCountryCodesFetched());
        if (!countrycodes.length) throw new Error(ERROR_EMPTY_COUNTRY_CODES_ARRAY);
        return countrycodes;
    } catch (error) {
        console.warn("Error in fetchOnlineNations:", error);
        throw error;
    }
}

async function fetchOnlineContacts(): Promise<ContactI3C[]> {
    try {
        const response = await fetchWithTimeout({ url: CONTACTS_CSV_URL, errorMessage: ERROR_FETCHING_CONTACTS });
        const csvText = await response.text();
        return csvParse<ContactI3C>(csvText).data;
    } catch (error) {
        console.warn("Error in fetchOnlineContacts:", error);
        throw error;
    }
}

export async function fetchAndMergeContacts(fetchFn = fetchOnlineContacts): Promise<ContactI3C[]> {
    const onlineContacts = await fetchFn();
    if (!onlineContacts.length) throw new Error(ERROR_EMPTY_CONTACTS_ARRAY);

    await initializeStorage(onlineContacts); // Initialize indexedDB storage
    const localContacts = await getActiveContacts();

    // Create a Set of online UIDs for O(1) lookups
    const onlineContactUids = new Set(onlineContacts.map((contact) => contact.uid));

    // Find and remove all active local contacts not in onlineContacts from indexedDB store activeContacts - O(n) operation
    // If the contact has a sent count then first store it in indexedDB store deletedContacts to retain sending history
    const now = Date.now();
    const deletedContacts = localContacts.filter((localContact) => !onlineContactUids.has(localContact.uid));
    for await (const contact of deletedContacts) {
        if (contact.sc > 0) {
            contact.dd = now;
            await storeDeletedContacts(contact);
        }
        await removeActiveContactByUid(contact.uid);
    }

    // Verify that there is no overlap between active and deleted contacts in indexedDB
    await checkOverlapIndexedDBActiveAndDeletedContacts();

    // Verify that active local contacts are synced with online contacts
    await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

    // Create a Map for local contacts using UID as key for O(1) lookups
    // Then merge the online contacts with the local contacts - O(n) operation
    const localContactsMap = new Map(localContacts.map((contact) => [contact.uid, contact]));
    const updatedContacts: ContactI3C[] = [];
    const mergedContacts = onlineContacts.map((oc): ContactI3C => {
        const lc = localContactsMap.get(oc.uid);
        const mergedContact: ContactI3C = lc?.uid
            ? {
                  ...oc,
                  sd: lc.sd,
                  sc: lc.sc,
                  cf1: lc.cf1,
                  cf2: lc.cf2,
              }
            : oc;
        if (lc && new Date(oc.ud) > new Date(lc.ud)) updatedContacts.push(mergedContact);
        return mergedContact;
    });

    // Log any changes made
    const isDev = getDevMode();
    const addedContacts = onlineContacts.filter((onlineContact) => !localContactsMap.has(onlineContact.uid));
    if (addedContacts.length) {
        console.log(`Added ${addedContacts.length} contact${addedContacts.length > 1 ? "s" : ""}:`);
        if (isDev) console.table(addedContacts);
    }
    if (deletedContacts.length) {
        console.log(`Deleted ${deletedContacts.length} contact${deletedContacts.length > 1 ? "s" : ""}:`);
        if (isDev) console.table(deletedContacts);
    }
    if (updatedContacts.length) {
        console.log(`Updated ${updatedContacts.length} contact${updatedContacts.length > 1 ? "s" : ""}:`);
        if (isDev) console.table(updatedContacts);
    }

    await storeActiveContacts(mergedContacts);

    return mergedContacts;
}
