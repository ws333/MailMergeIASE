import { MouseEventHandler } from "react";
import { Button } from "ui-kit";
import { useStoreState } from "../store/store";

type Props = {
    checkInProgress: boolean;
    preflightInProgress: boolean;
    disabled: boolean | string;
    endSession: boolean;
    leftToSendCount: number;
    onClick: MouseEventHandler;
};

function ButtonSendEmails({
    checkInProgress,
    preflightInProgress,
    disabled,
    endSession,
    leftToSendCount,
    onClick,
}: Props) {
    const emailsSent = useStoreState((state) => state.contactList.emailsSent);
    const selectedNations = useStoreState((state) => state.contactList.selectedNations);

    const buttonText =
        checkInProgress || endSession || preflightInProgress
            ? "Please wait..."
            : !selectedNations.length
              ? "No contacts selected"
              : !leftToSendCount
                ? "Selected contacts already processed"
                : !emailsSent
                  ? "Send emails"
                  : "Continue";
    return (
        <Button className="session_buttons" isDisabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonSendEmails;
