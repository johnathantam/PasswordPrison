import "./AppView.css";
import { Sidebar } from "../Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import { AllItemsPage } from "../AllItemsPage/AllItemsPage";

function AppView() {
    return (
        <div className="app-view">
            <Sidebar />
            <div className="app-content">
                <Routes>
                    {/* <Route path="/" element={<HomePage />} /> */}
                    <Route path="/" element={<AllItemsPage />} />
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