import { ToastContainer } from "react-toastify";
import { ProjectEnvProps } from "../types/types";
import EmailSender from "./EmailSender";
import IconIFO from "./IconIFO";
import SettingsMenu from "./SettingsMenu";
import "./App.css";

export default function App({ environment, sendEmailFn, InfoComponent }: ProjectEnvProps) {
    return (
        <div className="scrollable">
            <header className="header">
                <div className="IFO-and-settings">
                    <IconIFO isHovering={false} />
                    <SettingsMenu />
                </div>
            </header>
            <EmailSender environment={environment} sendEmailFn={sendEmailFn} InfoComponent={InfoComponent} />
            <ToastContainer />
        </div>
    );
}
