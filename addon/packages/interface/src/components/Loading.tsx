import { CSSProperties } from "react";
import { Spinner } from "ui-kit";
import { Text } from "ui-kit";
import HeaderWithIFO from "./HeaderWithIFO";

const divStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
};

type Props = {
    showSpinner?: boolean;
};

function Loading({ showSpinner = true }: Props) {
    return (
        <>
            <div style={divStyles}>
                <HeaderWithIFO />
                <br />
                <Text size={42}>{showSpinner && <Spinner />}</Text>
            </div>
        </>
    );
}

export default Loading;
