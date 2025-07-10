import { Action, Computed, Thunk, ThunkOn } from "easy-peasy";
import { JSX } from "react";
import { LanguageOption, SubjectPerLanguage } from "../constants/emailTemplates.ts";
import type { SpreadsheetData, Strings, TEmailComponent } from "./types.ts";
import { ContactI3C } from "./typesI3C.ts";

export interface Model {
    locale: Locale;
    prefs: Prefs;
    data: Data;
    initialise: Thunk<Model>;
    cancel: Thunk<Model>;
    parseSpreadsheet: Thunk<Model, undefined, never, Model>;
    sendEmails: Thunk<Model, undefined, never, Model>;
    sendEmail: Thunk<Model, Email>;
    sendDialog: SendDialog;
    openUrl: Thunk<Model, string>;
    userDialog: UserDialog;
    contactList: ContactList;
    emailOptions: EmailOptions;
    render: Render;
}

interface Locale {
    strings: Strings;
    updateStrings: Action<Locale, Strings>;
}

export interface Prefs {
    delay: number;
    sendmode: "now" | "later";
    range: string;
    fileName: string;
    fileContents: number[];
    fetchPrefs: Thunk<Prefs>;
    updatePref: Thunk<Prefs, Partial<Prefs>>;
    updatePrefNosync: Action<Prefs, Partial<Prefs>>;
}

interface Data {
    spreadsheetData: SpreadsheetData;
    updateSpreadsheetData: Action<Data, SpreadsheetData>;
    emails: Email[];
}

interface SendDialog {
    open: boolean;
    abort: boolean;
    progress: number;
    current: number;
    time: string;
    total: number;
    status: string;
    update: Action<SendDialog, Partial<SendDialog>>;
    cancel: Thunk<SendDialog>;
}

interface ContactList {
    contacts: ContactI3C[];
    setContact: Action<ContactList, ContactI3C>;
    setContacts: Action<ContactList, ContactI3C[]>;
    selectedContacts: Computed<ContactList, ContactI3C[], Model>;

    deletedContacts: ContactI3C[];
    setDeletedContacts: Action<ContactList, ContactI3C[]>;

    emailsSent: number;
    setEmailsSent: Action<ContactList, number | ((prev: number) => number)>;

    endSession: boolean;
    setEndSession: Action<ContactList, boolean>;

    nationOptions: string[];
    setNationOptions: Action<ContactList, string[]>;
    updateSelectedNations: ThunkOn<ContactList>;
    nationOptionsByCountryCode: Computed<ContactList, string[], Model>;

    nationOptionsFetched: string[];
    setNationOptionsFetched: Action<ContactList, string[]>;
    updateNationOptions: ThunkOn<ContactList>;

    selectedNations: string[];
    setSelectedNations: Action<ContactList, string[]>;
    setSelectedNation: Action<ContactList, { nation: string; checked: boolean }>;
    updateIsSelectedAllNations: ThunkOn<ContactList>;

    isSelectedAllNations: boolean;
    setIsSelectedAllNations: Action<ContactList, boolean>;
    toggleIsSelectedAllNations: Thunk<ContactList>;
}

interface EmailOptions {
    countryCode: string;
    setCountryCode: Action<EmailOptions, string>;
    updateNationAndLanguageOptions: ThunkOn<EmailOptions, undefined, Model>;

    delay: number;
    setDelay: Action<EmailOptions, number>;
    storeDelay: ThunkOn<EmailOptions, number>;

    language: LanguageOption;
    setLanguage: Action<EmailOptions, { language: LanguageOption; subjectPerLanguage?: SubjectPerLanguage }>;
    storeLanguageAndUpdateNationOptions: ThunkOn<EmailOptions, undefined, Model>;

    languageOptions: LanguageOption[];
    setLanguageOptions: Action<EmailOptions, LanguageOption[]>;
    updateLanguage: ThunkOn<EmailOptions, undefined, Model>;

    subject: Computed<EmailOptions, string>;
    subjectPerLanguage: SubjectPerLanguage;
    setSubjectPerLanguage: Action<EmailOptions, SubjectPerLanguage>;
    storeSubjectPerLanguage: ThunkOn<EmailOptions, SubjectPerLanguage>;

    customSubject: string;
    setCustomSubject: Action<EmailOptions, string>;
    storeCustomSubject: ThunkOn<EmailOptions, string>;
    customSubjectVisible: Computed<EmailOptions, boolean>;

    EmailComponent: Computed<EmailOptions, TEmailComponent>;

    maxCount: number;
    _setMaxCount: Action<EmailOptions, number>; // Internal use only, use setMaxCount to update state.
    setMaxCount: Thunk<EmailOptions, number, undefined, Model>;
}

interface Render {
    forcedRender: number;
    initiateForcedRender: Action<Render>;
}

export interface UserDialog {
    title?: string;
    message: string | JSX.Element;
    confirmActionText?: string;
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    closeDialog: Thunk<UserDialog>;
    setUserDialog: Action<UserDialog, Partial<UserDialog>>;
    showConfirmationModal?: boolean;
}

// Type based on defaultTemplate in packages/thunderbird-iframe-service/src/thunderbird-iframe-service.js
export type Email = {
    from?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    replyTo?: string;
    attachment?: string;
    subject?: string;
    body?: string;
};
