import { ProjectEnvProps } from "../types/types";
import EmailSender from "./EmailSender";
import IconIFO from "./IconIFO";
import SettingsMenu from "./SettingsMenu";
import "./App.css";

/**
 * - The App component is universal and used by both addon and webapp
 */
export default function App({ environment, sendEmailFn, sendEmailPreflightFn, InfoComponent }: ProjectEnvProps) {
    return (
        <div className="scrollable">
            <header className="header">
                <div className="IFO-and-settings">
                    <IconIFO isHovering={false} />
                    <SettingsMenu />
                </div>
            </header>
            <EmailSender
                environment={environment}
                sendEmailFn={sendEmailFn}
                sendEmailPreflightFn={sendEmailPreflightFn}
                InfoComponent={InfoComponent}
            />
        </div>
    );
}
