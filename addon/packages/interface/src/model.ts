/*
 * A model for a Redux store (using easy-peasy) for all mailmerge code.
 * All persistent state is stored via this model.
 */
import { action, computed, thunk, thunkOn } from "easy-peasy";
import type { Model, Prefs } from "./types/modelTypes";
import { defaultMaxCount, defaultSendingDelay } from "./constants/constants";
import { countryCodes_EU } from "./constants/countryCodes";
import {
    customSubjectTitlesArray,
    defaultLanguage,
    defaultLanguageOptions,
    emailComponents,
    subjects,
} from "./constants/emailTemplates";
import TextEndingSession from "./components/dialogTexts/TextEndingSession";
import { storeOptionsKey } from "./helpers/indexedDB";
import { messageParent } from "./service";
import { delay as delayPromise, formatTime, parseSpreadsheet } from "./utils";

export const model: Model = {
    locale: {
        strings: {},
        updateStrings: action((state, payload) => {
            return { ...state, strings: { ...payload } };
        }),
    },
    prefs: {
        delay: 0,
        sendmode: "now",
        range: "",
        fileName: "",
        fileContents: [],
        updatePref: thunk(async (actions, payload, { getState }) => {
            const newPrefs = { ...getState(), ...payload };

            // First send an update to the host window, then update the state.
            await messageParent({
                type: "SET_PREFERENCES",
                data: {
                    prefs: newPrefs,
                },
            });

            actions.updatePrefNosync(newPrefs);
        }),
        updatePrefNosync: action((state, payload) => {
            return { ...state, ...payload };
        }),
        fetchPrefs: thunk(async (actions) => {
            // Send a signal to get the preferences
            const data = await messageParent({ type: "GET_PREFERENCES" });
            if (data?.prefs) {
                actions.updatePrefNosync(data.prefs);
            }
        }),
    },
    data: {
        spreadsheetData: [[]],
        updateSpreadsheetData: action((state, payload) => {
            return { ...state, spreadsheetData: [...payload] };
        }),
        emails: [],
    },
    initialise: thunk(async (actions) => {
        await actions.prefs.fetchPrefs();
        const data = await messageParent({
            type: "GET_LOCALIZED_STRINGS",
        });
        if (data?.strings) {
            actions.locale.updateStrings(data.strings);
        }
    }),
    cancel: thunk(async () => {
        await messageParent({ type: "CANCEL" });
    }),
    parseSpreadsheet: thunk(async (_actions, _payload, { dispatch, getState }) => {
        // Presuming raw data has been loaded into .prefs, parse with XLSX.js
        const state = getState();
        const { fileContents } = state.prefs;

        const sheetArray = parseSpreadsheet(fileContents || []);
        dispatch.data.updateSpreadsheetData(sheetArray);
    }),
    sendEmails: thunk(async (actions, _payload, { getState }) => {
        const {
            data,
            prefs: { delay },
            locale: { strings },
        } = getState();

        // Start a timer that updates the time throughout the whole process
        const startTime = Date.now();
        const intervalHandle = window.setInterval(
            () =>
                actions.sendDialog.update({
                    time: formatTime(Date.now() - startTime),
                }),
            500
        );

        let current = 0;
        // Set the initial dialog properties
        actions.sendDialog.update({
            open: true,
            abort: false,
            progress: 0,
            current,
            total: data.emails.length,
            time: "",
        });

        try {
            function shouldAbort() {
                const {
                    sendDialog: { abort },
                } = getState();
                return abort || false;
            }
            for (const email of data.emails) {
                // Check for the abort state before we send an email
                if (shouldAbort()) {
                    break;
                }
                current += 1;
                actions.sendDialog.update({
                    current,
                    progress: current / (data.emails.length + 1),
                    status: strings.sending,
                });
                await actions.sendEmail(email);
                actions.sendDialog.update({
                    status: strings.waiting,
                });

                // Compute how long to wait before sending the next email
                const waitTime = delay ? 1000 * delay * current - (Date.now() - startTime) : 0;
                await delayPromise(waitTime, shouldAbort);
            }
        } catch (e) {
            console.error(e);
        }

        // Cleanup
        clearTimeout(intervalHandle);
        actions.sendDialog.update({
            open: false,
        });
    }),
    sendEmail: thunk(async (_actions, payload) => {
        const sendmode: Prefs["sendmode"] = "now";
        await messageParent({ type: "SEND_EMAIL", data: { email: payload, sendmode } });
    }),
    // Everything associated with an email being sent
    sendDialog: {
        open: false,
        abort: false,
        progress: 0,
        current: 1,
        time: "",
        total: 0,
        status: "",
        update: action((state, payload) => ({
            ...state,
            ...payload,
        })),
        cancel: thunk((actions) => {
            actions.update({ abort: true });
        }),
    },
    openUrl: thunk(async (_actions, payload) => {
        await messageParent({ type: "OPEN_URL", data: { url: payload } });
    }),
    userDialog: {
        title: "",
        message: "",
        confirmActionText: "Confirm",
        isOpen: false,
        closeDialog: thunk((actions) => {
            actions.setUserDialog({ ...model.userDialog });
        }),
        setUserDialog: action((state, payload) => ({ ...state, isOpen: true, ...payload })),
        showConfirmationModal: true,
    },
    contactList: {
        contacts: [],
        setContact: action((state, payload) => ({
            ...state,
            contacts: state.contacts.map((contact) => (contact.uid === payload.uid ? payload : contact)),
        })),
        setContacts: action((state, payload) => ({ ...state, contacts: [...payload] })),
        selectedContacts: computed([(state) => state, (_state, storeState) => storeState], (state, storeState) =>
            state.contacts.filter((contact) => storeState.contactList.selectedNations.includes(contact.na))
        ),

        deletedContacts: [],
        setDeletedContacts: action((state, payload) => ({ ...state, deletedContacts: [...payload] })),

        emailsSent: 0,
        setEmailsSent: action((state, payload) => ({
            ...state,
            emailsSent: typeof payload === "number" ? payload : payload(state.emailsSent),
        })),

        endSession: false,
        setEndSession: action((state, payload) => ({ ...state, endSession: payload })),

        nationOptions: [],
        setNationOptions: action((state, payload) => ({ ...state, nationOptions: [...payload] })),
        updateSelectedNations: thunkOn(
            (actions) => actions.setNationOptions,
            (actions, target, { getState }) => {
                const state = getState();
                const selected = state.selectedNations.filter((nation) => target.payload.includes(nation));
                actions.setSelectedNations(selected);
            }
        ),
        nationOptionsByCountryCode: computed(
            [(state) => state, (_state, storeState) => storeState],
            (_state, storeState) => {
                const nobcc: string[] = [];
                const { countryCode } = storeState.emailOptions;
                const { nationOptionsFetched } = storeState.contactList;
                if (nationOptionsFetched.includes(countryCode)) nobcc.push(countryCode);
                if (countryCodes_EU.includes(countryCode)) nobcc.push("EU");
                return nobcc;
            }
        ),

        nationOptionsFetched: [],
        setNationOptionsFetched: action((state, payload) => ({ ...state, nationOptionsFetched: [...payload] })),
        updateNationOptions: thunkOn(
            (actions) => actions.setNationOptionsFetched,
            (actions, target) => {
                actions.setNationOptions([...target.payload]);
                storeOptionsKey(target.payload, "countryCodesFetched");
            }
        ),

        selectedNations: [],
        setSelectedNations: action((state, payload) => ({ ...state, selectedNations: [...payload] })),
        setSelectedNation: action((state, payload) => {
            const { checked, nation } = payload;

            return {
                ...state,
                selectedNations: checked
                    ? [...state.selectedNations, nation]
                    : state.selectedNations.filter((n) => n !== nation),
            };
        }),
        updateIsSelectedAllNations: thunkOn(
            (actions) => [actions.setSelectedNation, actions.setSelectedNations],
            (actions, _target, { getState }) => {
                const state = getState();

                const checked =
                    (state.isSelectedAllNations && state.selectedNations.length !== 0) ||
                    (!state.isSelectedAllNations && state.selectedNations.length === state.nationOptions.length);

                // Don't update unless there is a change since the action also sets selectedNations
                if (checked !== state.isSelectedAllNations) {
                    actions.setIsSelectedAllNations(checked);
                }
            }
        ),

        isSelectedAllNations: false,
        setIsSelectedAllNations: action((state, payload) => ({
            ...state,
            isSelectedAllNations: payload,
            selectedNations: payload ? [...state.nationOptions] : [],
        })),
        toggleIsSelectedAllNations: thunk((actions, _, { getState }) => {
            const state = getState();
            actions.setIsSelectedAllNations(!state.isSelectedAllNations);
        }),
    },
    emailOptions: {
        countryCode: "",
        setCountryCode: action((state, payload) => ({ ...state, countryCode: payload })),
        updateNationAndLanguageOptions: thunkOn(
            (actions) => actions.setCountryCode,
            (actions, target, { getStoreState, getStoreActions }) => {
                const storeState = getStoreState();
                const storeActions = getStoreActions();

                const newLanguageOptions = [...defaultLanguageOptions];
                if (target.payload === "NO") newLanguageOptions.push("Norwegian");
                if (target.payload === "IT") newLanguageOptions.push("Italian");
                actions.setLanguageOptions(newLanguageOptions);

                storeOptionsKey(target.payload, "countryCode");
                storeActions.contactList.setNationOptions(storeState.contactList.nationOptionsByCountryCode);
            }
        ),

        delay: defaultSendingDelay,
        setDelay: action((state, payload) => ({ ...state, delay: payload })),
        storeDelay: thunkOn(
            (actions) => actions.setDelay,
            async (_actions, target) => {
                storeOptionsKey(target.payload, "delay");
            }
        ),

        maxCount: defaultMaxCount,
        _setMaxCount: action((state, payload) => ({ ...state, maxCount: payload })), // Internal use only, use setMaxCount to update state.
        setMaxCount: thunk((actions, payload, { getStoreState, getStoreActions }) => {
            const storeState = getStoreState();
            const storeActions = getStoreActions();
            if (payload <= storeState.contactList.emailsSent) {
                storeActions.userDialog.setUserDialog({
                    title: "Ending session!",
                    message: TextEndingSession,
                    onConfirm: () => {
                        actions._setMaxCount(payload);
                        storeActions.contactList.setEndSession(true);
                    },
                });
                return;
            }
            actions._setMaxCount(payload);
            storeOptionsKey(payload, "maxCount");
            return { ...storeState, maxCount: payload };
        }),

        language: defaultLanguage,
        setLanguage: action((state, payload) => ({
            ...state,
            language: payload.language,
            subjectPerLanguage: payload.subjectPerLanguage
                ? {
                      ...state.subjectPerLanguage,
                      ...payload.subjectPerLanguage,
                  }
                : state.subjectPerLanguage,
        })),
        storeLanguageAndUpdateNationOptions: thunkOn(
            (actions) => actions.setLanguage,
            async (_actions, target, { getStoreState, getStoreActions }) => {
                const { payload } = target;
                const storeState = getStoreState();
                const storeActions = getStoreActions();

                if (payload.language === "Norwegian") {
                    storeActions.contactList.setNationOptions(["NO"]);
                } else if (payload.language === "Italian") {
                    storeActions.contactList.setNationOptions(["IT"]);
                } else {
                    storeActions.contactList.setNationOptions(storeState.contactList.nationOptionsByCountryCode);
                }

                storeOptionsKey(target.payload.language, "language");
            }
        ),

        languageOptions: defaultLanguageOptions,
        setLanguageOptions: action((state, payload) => ({ ...state, languageOptions: [...payload] })),
        updateLanguage: thunkOn(
            (actions) => actions.setLanguageOptions,
            async (actions, target) => {
                actions.setLanguage({ language: target.payload[0] });
            }
        ),

        subject: computed((state) => state.subjectPerLanguage[state.language]!),
        subjectPerLanguage: defaultLanguageOptions.reduce(
            (acc, language) => ({ ...acc, [language]: subjects[language][0] }),
            {}
        ),
        setSubjectPerLanguage: action((state, payload) => ({
            ...state,
            subjectPerLanguage: { ...state.subjectPerLanguage, ...payload },
        })),
        storeSubjectPerLanguage: thunkOn(
            (actions) => actions.setSubjectPerLanguage,
            async (_actions, target, { getState }) => {
                const storeState = getState();
                storeOptionsKey({ ...storeState.subjectPerLanguage, ...target.payload }, "subject");
            }
        ),

        customSubject: "",
        setCustomSubject: action((state, payload) => ({ ...state, customSubject: payload })),
        storeCustomSubject: thunkOn(
            (actions) => actions.setCustomSubject,
            async (_actions, target) => {
                storeOptionsKey(target.payload, "customSubject");
            }
        ),
        customSubjectVisible: computed((state) => customSubjectTitlesArray.includes(state.subject)),

        EmailComponent: computed((state) => emailComponents[state.language]),
    },
    auth: {
        currentLogin: { provider: null, userEmail: "" },
        setCurrentLogin: action((state, payload) => ({ ...state, currentLogin: payload })),
        resetCurrentLogin: action((state) => ({
            ...state,
            currentLogin: { provider: null, userEmail: "", accessToken: "" },
        })),
    },
    render: {
        forcedRender: 1,
        initiateForcedRender: action((state) => ({ ...state, forcedRender: state.forcedRender + 1 })),
    },
};
