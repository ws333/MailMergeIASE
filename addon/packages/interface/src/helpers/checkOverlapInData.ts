import { ERROR_OVERLAP_ACTIVE_DELETED } from "../constants/constants";
import { isDevMode } from "./getSetDevMode";
import { getActiveContacts, getDeletedContacts } from "./indexedDB";

export async function checkOverlapIndexedDBActiveAndDeletedContacts() {
    const activeContacts = await getActiveContacts();
    const deletedContactsFromIndexedDB = await getDeletedContacts();
    const activeContactUids = new Set(activeContacts.map((contact) => contact.uid));
    const deletedContactUids = new Set(deletedContactsFromIndexedDB.map((contact) => contact.uid));
    const intersectionActiveDeleted = new Set([...activeContactUids].filter((uid) => deletedContactUids.has(uid)));
    const isOverlap = intersectionActiveDeleted.size > 0;
    if (isOverlap) {
        if (isDevMode()) {
            console.log(ERROR_OVERLAP_ACTIVE_DELETED); // This is for output when running tests
        } else {
            console.warn(ERROR_OVERLAP_ACTIVE_DELETED);
        }
        const overlappingContacts = activeContacts.filter((contact) => intersectionActiveDeleted.has(contact.uid));
        console.table(overlappingContacts);
    }
    return isOverlap;
}

/**
 * Check for local contacts not found in online contacts (should not happen if deletions were successful)
 * This would not affect the user though as mergedContacts only contains the uids from onlineContacts
 */
export async function checkIfActiveAndOnlineContactsSynced(onlineContactUids: Set<number>) {
    const localContacts = await getActiveContacts();
    const localContactsNotOnline = localContacts.filter((lc) => !onlineContactUids.has(lc.uid));
    const { length } = localContactsNotOnline;
    if (length) {
        console.log(`Found ${length} active local contact${length > 1 ? "s" : ""} not found online (not synced):`);
        console.table(localContactsNotOnline);
    }
    return length;
}
