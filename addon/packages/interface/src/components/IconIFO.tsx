import { CSSProperties } from "react";
import { IASE_URL } from "../constants/constants";
import icon from "../../../thunderbird-extension/public/skin/icon64.png";
import "./IconIFO.css";

type Props = {
    isHovering?: boolean;
};

function IconIFO({ isHovering = true }: Props) {
    return (
        <a href={IASE_URL} target="_blank" rel="noopener noreferrer">
            <img
                className={`icon_ifo ${isHovering ? "hovering_ifo" : ""}`}
                style={iconStyles}
                src={icon}
                alt="Interstellar Alliance Social Experiment Step 3 icon"
            />
        </a>
    );
}
export default IconIFO;

const iconSize = 70;

const iconStyles: CSSProperties = {
    width: iconSize,
    height: iconSize,
};
