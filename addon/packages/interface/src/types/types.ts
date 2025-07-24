import type { ChangeEvent, FocusEvent, JSX } from "react";

export type Provider = "MS" | "Google";

export type CurrentLogin = {
    provider: Provider | null;
    userEmail: string;
    accessToken?: string;
};

export type Email = Pick<browser.compose.ComposeDetails, "from" | "to" | "subject" | "body">;

export type StatusBackend = {
    status: "OK" | "ERROR";
    message: string; // Message to display to user
    error?: string;
};

export type ProjectEnvProps = {
    environment: ProjectEnvironment;
    sendEmailFn: (email: Email) => Promise<StatusBackend> | Promise<void>;
    sendEmailPreflightFn?: () => Promise<StatusBackend>;
    HeaderButtonsComponent?: React.ReactElement;
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
        | "SEND_EMAIL"
        | "SEND_EMAIL_STATUS" // Used to keep EmailSender updated in case of failure or cancellation
        | "CANCEL"
        | "INITIALIZE_PARENT";
    id?: string | number;
    source?: "CHILD" | "PARENT";
    reply_id?: string | number;
    data?: {
        email?: Email;
        sendEmailStatus?: browser.compose._SendMessageReturnReturn;
    };
};
