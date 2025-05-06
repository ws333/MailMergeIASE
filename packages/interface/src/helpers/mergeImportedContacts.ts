import { ContactI3C, ImportData, ImportStats } from "../types/typesI3C";

export interface ContactState {
    active: ContactI3C[]; // List of currently active contacts (dd = 0)
    deleted: ContactI3C[]; // List of deleted contacts (dd > 0)
    lastImportExportDate: number; // Timestamp of the most recent import/export applied
}

type ImportContactsStats = Pick<ImportStats, "contactsDeleted" | "contactsProcessed">;
/**
 * - Merge imported contacts with local contacts, handling active and deleted contacts separately
 */
export function mergeImportedContacts(
    current: ContactState,
    importData: ImportData
): [ContactState, ImportContactsStats, Error?] {
    const currentActive = [...current.active];
    const currentDeleted = [...current.deleted];

    const importContactsStats: ImportContactsStats = {
        contactsDeleted: 0,
        contactsProcessed: 0,
    };

    const exportDate = importData.metadata.find((item) => item.key === "exportDate")?.value;
    if (!exportDate) return [current, importContactsStats, new Error("Invalid import\nNo export date found!")];

    for (const importContact of importData.contacts.active) {
        const stillActiveIndex = currentActive.findIndex((c) => c.uid === importContact.uid);
        const alreadyDeletedIndex = currentDeleted.findIndex((c) => c.uid === importContact.uid);

        if (stillActiveIndex !== -1) {
            // Contact still active so merge sc, sd, cf1, cf2 using the following rules
            const currentContact = currentActive[stillActiveIndex];

            if (importContact.sd > currentContact.sd) {
                currentActive[stillActiveIndex] = {
                    ...currentContact,
                    sd: importContact.sd,
                    sc: importContact.sc,
                    cf1: importContact.cf1,
                    cf2: importContact.cf2,
                };
                importContactsStats.contactsProcessed++;
            } else if (importContact.sd <= currentContact.sd && exportDate > current.lastImportExportDate) {
                // In case user has sent to the contact after the export was written to file and this file has not yet been imported
                // we add the sc, but leave the sd as is.
                currentActive[stillActiveIndex] = {
                    ...currentContact,
                    sc: currentContact.sc + importContact.sc,
                    cf1: importContact.cf1,
                    cf2: importContact.cf2,
                };
                importContactsStats.contactsProcessed++;
            } else {
                // Contact still active, but not changed
                importContactsStats.contactsProcessed++;
            }
        } else if (alreadyDeletedIndex !== -1) {
            // Contact already deleted, skipping.
            // This can only happen if using two different devices around the time when the contact is deleted.
            // Having two instances of the IndexedDB, and the contact has sc > 0 on both.
            // Then exporting from one device and importing to the other.
            // This is not intended use and can cause sent counts to be scewed.
            importContactsStats.contactsProcessed++;
            continue;
        } else {
            // Contact from import not in active contacts and not in IndexedDB deleted contacts, add to deleted list if sc > 0
            if (importContact.sc > 0) {
                currentDeleted.push({
                    uid: importContact.uid,
                    na: "",
                    i: "",
                    s: "",
                    n: "",
                    e: "",
                    ud: "",
                    cb1: "",
                    cb2: "",
                    sd: importContact.sd,
                    sc: importContact.sc,
                    cf1: importContact.cf1,
                    cf2: importContact.cf2,
                    dd: exportDate,
                });
                importContactsStats.contactsDeleted++;
            }
            importContactsStats.contactsProcessed++;
        }
    }

    // Merge deleted contacts from the import
    for (const importContact of importData.contacts.deleted) {
        const activeIndex = currentActive.findIndex((c) => c.uid === importContact.uid);
        const deletedIndex = currentDeleted.findIndex((c) => c.uid === importContact.uid);

        if (activeIndex !== -1) {
            const currentContact = currentActive[activeIndex];
            currentActive.splice(activeIndex, 1);
            currentDeleted.push({
                ...currentContact,
                sd: importContact.sd,
                sc: importContact.sc,
                dd: importContact.dd,
                cf1: importContact.cf1,
                cf2: importContact.cf2,
            });
            importContactsStats.contactsProcessed++;
            importContactsStats.contactsDeleted++;
        } else if (deletedIndex !== -1) {
            const deletedContact = currentDeleted[deletedIndex];
            if (
                // Don't merge imported contact if already deleted and lower sc count.
                // This can only happen if first sending to the contact with two different devices that are then refreshed/synced after the online contact was deleted.
                // I.e. having two instances of the IndexedDB, and the contact has sc > 0 on both, then exporting from one device and importing on the other.
                // This is not intended use and can cause sent counts to be scewed.
                importContact.sc < deletedContact.sc
            ) {
                importContactsStats.contactsProcessed++;
                continue;
            } else if (importContact.sd > deletedContact.sd && exportDate > current.lastImportExportDate) {
                currentDeleted[deletedIndex] = {
                    ...deletedContact,
                    sd: importContact.sd,
                    sc: importContact.sc,
                    dd: importContact.dd,
                    cf1: importContact.cf1,
                    cf2: importContact.cf2,
                };
            } else if (
                importContact.sd <= deletedContact.sd &&
                importContact.sd <= deletedContact.dd &&
                exportDate > current.lastImportExportDate
            ) {
                currentDeleted[deletedIndex] = {
                    ...deletedContact,
                    sc: deletedContact.sc + importContact.sc,
                    cf1: importContact.cf1,
                    cf2: importContact.cf2,
                };
            }
            importContactsStats.contactsProcessed++;
        } else {
            currentDeleted.push({
                uid: importContact.uid,
                na: "",
                i: "",
                s: "",
                n: "",
                e: "",
                ud: "",
                cb1: "",
                cb2: "",
                sd: importContact.sd,
                sc: importContact.sc,
                cf1: importContact.cf1,
                cf2: importContact.cf2,
                dd: importContact.dd,
            });
            importContactsStats.contactsProcessed++;
            importContactsStats.contactsDeleted++;
        }
    }

    const newLastImportExportDate =
        exportDate > current.lastImportExportDate ? exportDate : current.lastImportExportDate;

    // Ensure all imported contacts have been processed by the import logic
    const contactsToProcessCount = importData.contacts.active.length + importData.contacts.deleted.length;
    if (contactsToProcessCount !== importContactsStats.contactsProcessed) {
        console.warn(`Import logic contacts processed count mismatch!`);
    }

    return [
        { active: currentActive, deleted: currentDeleted, lastImportExportDate: newLastImportExportDate },
        importContactsStats,
    ];
}

export function deleteContact(state: ContactState, uid: number, deletionTime: number): ContactState {
    const activeIndex = state.active.findIndex((c) => c.uid === uid);
    if (activeIndex === -1) return state;

    const contact = state.active[activeIndex];
    const newActive = state.active.filter((_, i) => i !== activeIndex);
    const newDeleted: ContactI3C[] = [...state.deleted, { ...contact, dd: deletionTime }];

    return { active: newActive, deleted: newDeleted, lastImportExportDate: state.lastImportExportDate };
}

export function getDeletedSentCount(state: ContactState): number {
    return state.deleted.reduce((sum, c) => sum + c.sc, 0);
}
