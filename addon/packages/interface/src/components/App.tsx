import { ProjectEnvProps } from "../types/types";
import EmailSender from "./EmailSender";
import IconIFO from "./IconIFO";
import SettingsMenu from "./SettingsMenu";
import "./App.css";

/**
 * - The App component is universal and used by both addon and webapp
 */
export default function App({
    environment,
    sendEmailFn,
    sendEmailPreflightFn,
    HeaderButtonsComponent,
}: ProjectEnvProps) {
    return (
        <div className="scrollable">
            <header className="header">
                <div className="IFO-and-settings">
                    <IconIFO isHovering={false} />
                    <div className="header-section-align-right">
                        {HeaderButtonsComponent}
                        <SettingsMenu />
                    </div>
                </div>
            </header>
            <EmailSender
                environment={environment}
                sendEmailFn={sendEmailFn}
                sendEmailPreflightFn={sendEmailPreflightFn}
            />
        </div>
    );
}
