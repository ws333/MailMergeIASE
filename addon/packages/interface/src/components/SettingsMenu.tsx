import styled from "styled-components";
import { TrashBinIcon } from "ui-kit";
import { InfoIcon } from "ui-kit";
import { DownloadIcon } from "ui-kit";
import { Menu, MenuOption, MenuOptionProps, OpenMenuButton } from "ui-kit";
import { DOCS_URL } from "../constants/constants";
import { useStoreActions, useStoreState } from "../hooks/storeHooks";
import { exportFromLocalStorage } from "../helpers/exportFromLocalStorage";
import { showDeleteHistoryDialog } from "../helpers/showDeleteHistoryDialog";
import MenuOptionFullSendingLog from "./MenuOptionFullSendingLog";
import MenuOptionImport from "./MenuOptionImport";

const StyledTitle = styled.span`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.toCssValue()};
`;

function SettingsMenu() {
    const emailsSent = useStoreState((state) => state.contactList.emailsSent);
    const setUserDialog = useStoreActions((actions) => actions.userDialog.setUserDialog);
    const initiateForcedRender = useStoreActions((actions) => actions.render.initiateForcedRender);

    const importSendingHistory = "Import sending history";
    const viewFullSendingLog = "View full sending log";

    return (
        <Menu
            title={<StyledTitle>Settings</StyledTitle>}
            renderOpener={({ props: { ref, ...props } }) => <OpenMenuButton ref={ref} {...props} />}
            renderContent={({ view, onClose }) => {
                const options: MenuOptionProps[] = [
                    {
                        text: "View online documentation",
                        onSelect: () => {
                            window.open(DOCS_URL, "_blank");
                            onClose();
                        },
                        icon: <InfoIcon />,
                    },
                    {
                        // Dummy to position menu option in MenuList below
                        text: viewFullSendingLog,
                        onSelect: () => {},
                    },
                    {
                        // Dummy to position menu option in MenuList below
                        text: importSendingHistory,
                        onSelect: () => {},
                    },
                    {
                        text: "Export sending history",
                        onSelect: () => {
                            exportFromLocalStorage();
                            onClose();
                        },
                        icon: <DownloadIcon />,
                    },
                    {
                        text: "Reset sending history",
                        kind: "alert",
                        onSelect: () => {
                            showDeleteHistoryDialog({ initiateForcedRender, setUserDialog });
                            onClose();
                        },
                        icon: <TrashBinIcon />,
                    },
                ];

                const optionEndActiveSession: MenuOptionProps = {
                    text: "Sending session in progress! Click the 'Stop and/or End session' button to enable settings",
                    kind: "alert",
                    onSelect: () => {
                        onClose();
                    },
                    icon: <InfoIcon />,
                };

                const MenuList = options.map((props, index) =>
                    props.text === viewFullSendingLog ? (
                        <MenuOptionFullSendingLog key={index} view={view} onClose={onClose} />
                    ) : props.text === importSendingHistory ? (
                        <MenuOptionImport key={index} view={view} onClose={onClose} />
                    ) : (
                        <MenuOption key={index} view={view} {...props} />
                    )
                );
                return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {emailsSent ? <MenuOption key={1} view={view} {...optionEndActiveSession} /> : MenuList}
                    </div>
                );
            }}
        />
    );
}
export default SettingsMenu;
