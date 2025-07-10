import styled from "styled-components";
import { Modal } from "ui-kit";
import { Button, ConfirmationModal, VStack } from "ui-kit";
import { UserDialog } from "../types/modelTypes";
import { useStoreActions } from "../hooks/storeHooks";

type Props = Partial<UserDialog>;

// Inject styles into ConfirmationModal
const StyledConfirmationModal = styled(ConfirmationModal)`
    overflow-y: auto;
    overflow: hidden auto;

    /* Target the confirm button to allow text wrapping */
    button {
        white-space: normal;
        word-break: break-word;
        height: auto;
        min-height: 40px;
        padding: 8px 16px;
        text-align: center;
    }
`;

// Inject styles into Modal
const StyledModal = styled(Modal)`
    overflow-y: auto;
    overflow: hidden auto;
    width: 92%;
`;

function Dialog({
    title = "Confirmation",
    message,
    confirmActionText = "Confirm",
    onClose = () => {},
    onConfirm = () => {},
    showConfirmationModal,
}: Props) {
    const closeDialog = useStoreActions((actions) => actions.userDialog.closeDialog);

    const _onClose = () => {
        onClose();
        closeDialog();
    };

    return showConfirmationModal ? (
        <StyledConfirmationModal
            title={title}
            onClose={_onClose}
            noCloseOnClickBackdrop
            confirmActionText={confirmActionText}
            onConfirm={onConfirm}
        >
            <VStack gap={12}>{message}</VStack>
        </StyledConfirmationModal>
    ) : (
        <StyledModal title={title} onClose={_onClose} footer={<Button onClick={_onClose}>{confirmActionText}</Button>}>
            {message}
        </StyledModal>
    );
}

export default Dialog;
