import { MouseEventHandler } from "react";
import { Button } from "ui-kit";

type Props = {
    aborted?: boolean;
    checkInProgress?: boolean;
    disabled?: boolean | string;
    onClick: MouseEventHandler;
    toSendCount: number;
};

function ButtonStopSending({ aborted, checkInProgress, disabled, onClick, toSendCount }: Props) {
    const buttonText = aborted || checkInProgress || !toSendCount ? "Please wait..." : "Stop sending";
    return (
        <Button isDisabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonStopSending;
