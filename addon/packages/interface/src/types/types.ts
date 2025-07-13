import type { ChangeEvent, FocusEvent, JSX } from "react";
import { Email, Prefs } from "./modelTypes";

export type StatusBackend = {
    status: "OK" | "ERROR";
    message: string;
    errorString?: string;
};

export type ProjectEnvProps = {
    environment: ProjectEnvironment;
    sendEmailFn: (email: Email) => Promise<StatusBackend> | Promise<void>;
    sendEmailPreflightFn?: () => Promise<StatusBackend>;
    InfoComponent?: React.ReactElement;
};

export type EmailComponentProps = {
    name: string;
};

export type ProjectEnvironment = "addon" | "webapp" | "unknown";

export type TEmailComponent = ({ name }: EmailComponentProps) => JSX.Element;

export type FileContent = number[];

export type ParseRangeReturnType = number[];

// An array of arrays of cell values, which can be anything to support custom cell data types, but by default is `string | number | boolean | undefined`.
// See /node_modules/handsontable/common.d.ts // Todo - Package handsontable is removed so related code can also be removed
export type SpreadsheetData = string[][];

export type Strings = Record<string, string>;

export type UpdatePrefEvent = ChangeEvent<HTMLSelectElement> | FocusEvent<HTMLInputElement>;

export type MessagePayload = {
    type:
        | "ECHO"
        | "GET_DEFAULT_PREFERENCES"
        | "GET_PREFERENCES"
        | "SET_PREFERENCES"
        | "GET_LOCALIZED_STRINGS"
        | "SEND_EMAILS"
        | "SEND_EMAIL"
        | "SEND_EMAIL_STATUS" // Used to keep EmailSender updated in case of failure or cancellation
        | "OPEN_URL"
        | "CANCEL"
        | "INITIALIZE_PARENT";
    id?: string | number;
    source?: "CHILD" | "PARENT";
    reply_id?: string | number;
    data?: {
        prefs?: Partial<Prefs>;
        strings?: Strings;
        emails?: Email[];
        email?: Email;
        sendEmailStatus?: browser.compose._SendMessageReturnReturn;
        sendmode?: Prefs["sendmode"];
        url?: string;
    };
};
