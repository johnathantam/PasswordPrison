import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { NewItemView } from "./NewItemView/NewItemView";
import { Item } from "../../types/item";
import { invoke } from "@tauri-apps/api/core";
import "./AllItemsPage.css";

enum ActiveActionItemView {
    NewItemView,
    ItemView
}

function AllItemsPage() {
    const navigate = useNavigate();

    const [activeActionItem, setActiveActionItem] = useState<Item | null>(null);
    const [actionActionItemView, setActionActionItemView] = useState<ActiveActionItemView>(ActiveActionItemView.NewItemView);

    const handleSaveNewItem = (newItem: Item) => {

    }

    console.log("AM I LOADED")

    useEffect(() => {
        console.log("HELLO YAS")
        invoke("save_item_in_vault", {
            item: {
                name: "GitHub",
                username: "john",
                password: "mypassword",
                master_key: "my-master-password",
                urls: ["https://github.com"],
                notes: "Test account",
            },
        })
            .then(() => {
                console.log("ITEM SAVED");
            })
            .catch((error) => {
                console.error("SAVE FAILED:", error);
            });
    }, [])

    return (
        <>
            <div className="all-items-page">
                <div className="all-items-header-container">
                    <div className="header-left">
                        <button className="header-nav-btn" onClick={() => navigate(-1)}>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="header-nav-btn" onClick={() => navigate(1)}>
                            <ChevronRight size={18} />
                        </button>

                        <div className="header-search">
                            <Search size={15} className="header-search-icon" />
                            <input
                                type="text"
                                placeholder="Search passwords..."
                                className="header-search-input"
                            />
                        </div>
                    </div>

                    <button className="header-new-item-btn">
                        <Plus size={16} />
                        <span>New Item</span>
                    </button>
                </div>

                <Group orientation="horizontal">
                    <Panel defaultSize={35} minSize={20}>
                        <div className="all-items-page-panel">
                            <h2>Passwords</h2>
                        </div>
                    </Panel>

                    <Separator className="all-items-page-resize-handle" />

                    <Panel defaultSize={65} minSize={"210px"}>
                        <div className="all-items-page-panel">
                            <NewItemView onCancel={() => { }} onSave={() => { }}></NewItemView>
                        </div>
                    </Panel>
                </Group>
            </div>
        </>
    )
}

export { AllItemsPage }