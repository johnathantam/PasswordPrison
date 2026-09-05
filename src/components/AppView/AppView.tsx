import "./AppView.css";
import { Sidebar } from "../Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import { ItemsPage } from "../ItemsPage/ItemsPage";

function AppView() {
    return (
        <div className="app-view">
            <Sidebar />
            <div className="app-content">
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                    <Route path="/" element={<ItemsPage />} />
                    {/* <Route path="/favourites" element={<FavouritesPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/generator" element={<GeneratorPage />} />
                    <Route path="/trash" element={<TrashPage />} /> */}
                </Routes>
            </div>
        </div>
    );
}

export { AppView };