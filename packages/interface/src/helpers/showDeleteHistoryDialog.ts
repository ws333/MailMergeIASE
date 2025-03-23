import { ActionCreator } from "easy-peasy";
import { UserDialog } from "../types/modelTypes";
import TextDeletingData from "../components/dialogTexts/TextDeletingData";
import { resetLocalStorage } from "./localStorage";

type Args = {
    initiateForcedRender: ActionCreator<void>;
    setUserDialog: ActionCreator<Partial<UserDialog>>;
};

export function showDeleteHistoryDialog({ initiateForcedRender, setUserDialog }: Args) {
    setUserDialog({
        title: "Deletion warning!",
        message: TextDeletingData,
        confirmActionText: "Confirm deletion",
        onConfirm: () => {
            resetLocalStorage();
            setUserDialog({ message: "Sending history deleted!" });
            initiateForcedRender();
            console.log("Sending data has been deleted!");
        },
    });
}
