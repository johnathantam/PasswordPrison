import "./AppView.css";
import { Sidebar } from "../Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import { TrashedItemsPage } from "../TrashedItemsPage/TrashedItemsPage";
import { FavouriteItemsPage } from "../FavouriteItemsPage/FavouriteItemsPage";
import { ItemsPage } from "../ItemsPage/ItemsPage";
import { HomePage } from "../HomePage/HomePage";

function AppView() {
    return (
        <div className="app-view">
            <Sidebar />
            <div className="app-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/" element={<ItemsPage />} />
                    <Route path="/allItems" element={<ItemsPage />} />
                    <Route path="/favouriteItems" element={<FavouriteItemsPage />} />
                    {/* <Route path="/security" element={<SecurityPage />} /> */}
                    {/* <Route path="/generator" element={<GeneratorPage />} /> */}
                    <Route path="/trashedItems" element={<TrashedItemsPage />} />
                </Routes>
            </div>
        </div>
    );
}

export { AppView };