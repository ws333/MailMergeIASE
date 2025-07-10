import { CSSProperties } from "styled-components";
import { Text } from "ui-kit";

const styles: CSSProperties = {
    margin: 1,
    marginLeft: "1rem",
    padding: 0,
    paddingLeft: "1rem",
    paddingRight: "1rem",
};

const TextFullSendingLog = (fullSendingLog: string[]) => {
    return (
        <>
            <Text size={13} color="alert" style={{ ...styles }}>
                - Note that this view is not updated while sending! Press the esc or space key to close -
            </Text>
            {fullSendingLog.map((log, index) => (
                <Text size={13} key={index} style={styles}>
                    {log}
                </Text>
            ))}
        </>
    );
};

export default TextFullSendingLog;
