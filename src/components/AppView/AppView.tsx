import "./AppView.css";
import { Panel, Group, Separator } from "react-resizable-panels";
import { Sidebar } from "../Sidebar/Sidebar";

function AppView() {
    return (
        <div className="app-view">
            <Group orientation="horizontal">
                <Panel defaultSize={20} minSize={"60px"}>
                    <Sidebar></Sidebar>
                </Panel>

                <Separator className="resize-handle" />

                <Panel defaultSize={50} minSize={30}>
                    <div className="panel">Middle: Detail view</div>
                </Panel>

                <Separator className="resize-handle" />

                <Panel defaultSize={30} minSize={15}>
                    <div className="panel">Right: Password generator / notes</div>
                </Panel>
            </Group>
        </div>
    );
}

export { AppView };