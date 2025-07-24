import { CSSProperties } from "react";
import Header from "./Header";
import IconIFO from "./IconIFO";

function HeaderWithIFO() {
    return (
        <>
            <IconIFO />
            <div style={divDynamicGapStyles}></div>
            <Header />
        </>
    );
}

export default HeaderWithIFO;

const divDynamicGapStyles: CSSProperties = {
    height: "3%",
};
