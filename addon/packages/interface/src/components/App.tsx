import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useStoreActions, useStoreState } from "../hooks/storeHooks";
import { getProjectEnvironment } from "../helpers/projectEnvironment";
import EmailSender from "./EmailSender";
import IconIFO from "./IconIFO";
import SettingsMenu from "./SettingsMenu";
import "./App.css";

export default function App() {
    const environment = getProjectEnvironment(); // Check if running as addon or webapp

    const initialise = useStoreActions((actions) => actions.initialise);
    const sendEmail = useStoreActions((actions) => actions.sendEmail);

    useEffect(() => {
        initialise();
    }, [initialise]);

    const prefs = useStoreState((state) => state.prefs);
    const parseSpreadsheet = useStoreActions((actions) => actions.parseSpreadsheet);
    useEffect(() => {
        parseSpreadsheet();
    }, [prefs.fileName, parseSpreadsheet]);

    const InfoComponent = <div>Running as addon</div>;

    return (
        <div className="scrollable">
            <header className="header">
                <div className="IFO-and-settings">
                    <IconIFO isHovering={false} />
                    <SettingsMenu />
                </div>
            </header>
            <EmailSender environment={environment} sendEmailFn={sendEmail} InfoComponent={InfoComponent} />
            <ToastContainer />
        </div>
    );
}
