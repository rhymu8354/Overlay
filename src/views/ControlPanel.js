import React from "react";

import AlfredControls from "./AlfredControls";
import ControlPanelHeader from "./ControlPanelHeader";
import LogInControls from "./LogInControls";
import LogOutControls from "./LogOutControls";
import ObsControls from "./ObsControls";
import UserWelcome from "./UserWelcome";

import "./ControlPanel.css";

const ControlPanel = () => {
    return (
        <div className="ControlPanel">
            <div className="ControlPanel-content">
                <ControlPanelHeader />
                <LogInControls />
                <UserWelcome />
                <LogOutControls />
                <ObsControls />
                <AlfredControls />
            </div>
        </div>
    );
}

export default ControlPanel;

