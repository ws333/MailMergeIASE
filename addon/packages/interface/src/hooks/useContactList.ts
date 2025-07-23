import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { threeMonths } from "../constants/timeConstants";
import { fetchAndMergeContacts, fetchOnlineNations } from "../helpers/fetchAndMergeContacts";
import { getCountryCodeByIP } from "../helpers/getCountryCodeByIP";
import { getCountryCode, getDeletedContacts } from "../helpers/indexedDB";
import { isOnline } from "../helpers/isOnline";
import { useStoreActions, useStoreState } from "../store/store";

function useContactList() {
    const contacts = useStoreState((state) => state.contactList.contacts);
    const setContact = useStoreActions((actions) => actions.contactList.setContact);
    const setContacts = useStoreActions((actions) => actions.contactList.setContacts);
    const selectedContacts = useStoreState((state) => state.contactList.selectedContacts);
    const setDeletedContacts = useStoreActions((actions) => actions.contactList.setDeletedContacts);

    const setCountryCode = useStoreActions((actions) => actions.emailOptions.setCountryCode);

    const endSession = useStoreState((state) => state.contactList.endSession);
    const setEndSession = useStoreActions((actions) => actions.contactList.setEndSession);

    const emailsSent = useStoreState((state) => state.contactList.emailsSent);
    const setEmailsSent = useStoreActions((actions) => actions.contactList.setEmailsSent);

    const forcedRender = useStoreState((state) => state.render.forcedRender);

    const maxCount = useStoreState((state) => state.emailOptions.maxCount);

    const nationOptions = useStoreState((state) => state.contactList.nationOptions);
    const setNationOptionsFetched = useStoreActions((actions) => actions.contactList.setNationOptionsFetched);
    const selectedNations = useStoreState((state) => state.contactList.selectedNations);
    const setIsSelectedAllNations = useStoreActions((actions) => actions.contactList.setIsSelectedAllNations);

    useSuspenseQuery({
        queryKey: ["isOnline", forcedRender],
        queryFn: async () => await isOnline(),
        retry: 1,
        staleTime: 0,
        gcTime: 0,
    });

    const { data: _nationOptions } = useSuspenseQuery({
        queryKey: ["nations", forcedRender, { shouldFetch: !nationOptions.length }],
        queryFn: async () => fetchOnlineNations(),
    });

    const { data: _contacts } = useSuspenseQuery({
        queryKey: ["contacts", forcedRender, { shouldFetch: !contacts.length }],
        queryFn: async () => fetchAndMergeContacts(),
    });

    const { data: _deletedContacts } = useSuspenseQuery({
        queryKey: ["deletedContacts", forcedRender],
        queryFn: async () => await getDeletedContacts(),
    });

    const { data: _countryCode } = useSuspenseQuery({
        queryKey: ["countryCode", forcedRender],
        queryFn: async () => {
            const countryCode = await getCountryCodeByIP();
            if (countryCode) return countryCode;
            // Fall back to stored country code if IP lookup fails
            return await getCountryCode();
        },
    });

    useEffect(() => {
        setNationOptionsFetched(_nationOptions);
        setContacts(_contacts);
        setDeletedContacts(_deletedContacts);
        setCountryCode(_countryCode === "GB" ? "UK" : _countryCode); // Needs to be after setNationOptionsFetched
    }, [
        _contacts,
        _countryCode,
        _deletedContacts,
        _nationOptions,
        setContacts,
        setCountryCode,
        setDeletedContacts,
        setIsSelectedAllNations,
        setNationOptionsFetched,
    ]);

    const threeMonthsAgo = Date.now() - threeMonths;
    const selectedContactsNotSent = selectedContacts.filter((contact) => contact.sd < threeMonthsAgo);
    const maxSelectedContactsNotSent = Math.min(selectedContactsNotSent.length, maxCount);
    const nextContactNotSent = selectedContactsNotSent[0] || {
        n: "",
        e: "",
    };

    return {
        endSession,
        setEndSession,
        emailsSent,
        setEmailsSent,
        maxCount,
        maxSelectedContactsNotSent,
        selectedContactsNotSent,
        nextContactNotSent,
        selectedNations,
        setContact,
    };
}

export { useContactList };
export type UseContactListReturnType = ReturnType<typeof useContactList>;
