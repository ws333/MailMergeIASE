import { CSSProperties } from "react";

function Header() {
    return <h1 style={headerStyles}>Interstellar Alliance Social Experiment Step 3</h1>;
}

export default Header;

const headerStyles: CSSProperties = {
    whiteSpace: "nowrap",
    margin: "0rem 2rem",
    marginBottom: "1rem",
};
