import { CSSProperties } from "styled-components";
import { Button, Text } from "ui-kit";
import { exportFromLocalStorage } from "../../helpers/exportFromLocalStorage";

const onClickExportButton = () => {
    exportFromLocalStorage();
};

const styles: CSSProperties = {
    margin: 0,
};

const TextDeletingData = (
    <>
        <Text style={{ ...styles, color: "orange" }}>You are about to delete all sending history!</Text>
        <Text style={styles}>
            This means that information about last sending date and sending count to individual contacts will be
            removed.
        </Text>
        <Text style={styles}>
            If you intend to continue sending later or on another computer make sure to export the data first!
        </Text>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={onClickExportButton} style={{ margin: "2rem", width: "60%" }}>
                Export data
            </Button>
        </div>
        <Text style={{ ...styles, textAlign: "center" }}>Are you sure you want to delete the sending history?</Text>
    </>
);

export default TextDeletingData;
