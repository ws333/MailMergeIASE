import { MouseEventHandler } from "react";
import { Button } from "ui-kit";

type Props = {
    disabled?: boolean | string;
    onClick: MouseEventHandler;
};

function ButtonEndSession({ disabled, onClick }: Props) {
    const buttonText = "End session";
    return (
        <Button className="session_buttons" isDisabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonEndSession;
