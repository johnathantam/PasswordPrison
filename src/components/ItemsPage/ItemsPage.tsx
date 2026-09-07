import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { ItemListing } from "./ItemListing/ItemListing";
import { NewItemView } from "./NewItemView/NewItemView";
import { EncryptedVault } from "../../types/encryptedVault";
import { EncryptedVaultItem } from "../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import { VaultItem } from "../../types/vaultItem";
import { ItemView } from "./ItemView/ItemView";
import "./ItemsPage.css";

enum ActiveActionItemView {
    NewItemView,
    ItemListingView
}

function ItemsPage() {
    const navigate = useNavigate();

    const [vaultItems, setVaultItems] = useState<EncryptedVaultItem[]>([]);
    const [activeActionItem, setActiveActionItem] = useState<EncryptedVaultItem | null>(null);
    const [activeActionItemView, setActiveActionItemView] = useState<ActiveActionItemView>(ActiveActionItemView.NewItemView);

    const [searchItemsQuery, setSearchItemsQuery] = useState("");    
    const searchedItems: EncryptedVaultItem[] = vaultItems.filter((item) => {
        const query = searchItemsQuery.trim().toLowerCase();
        if (!query) {
            return true;
        }

        return (
            item.name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query) ||
            item.urls.some((url) => url.toLowerCase().includes(query))
        );
    });

    const switchActiveActionItemView = (newActiveActionItemView: ActiveActionItemView) => {
        setActiveActionItemView(newActiveActionItemView);
    }

    const switchActiveActionItem = (newActiveActionItem: EncryptedVaultItem) => {
        setActiveActionItem(newActiveActionItem);
    }

    const selectItemListing = (itemSelected: EncryptedVaultItem) => {
        switchActiveActionItemView(ActiveActionItemView.ItemListingView);
        switchActiveActionItem(itemSelected);
    }

    const editItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        invoke("edit_item_in_vault", {
            itemId: itemId,
            masterKey: masterKey,
            editedItem: newItemContent
        })
            .then(() => {
                // Grab new elements
                return invoke<EncryptedVault>("get_vault_items");
            })
            .then((encryptedVault: EncryptedVault) => {
                // Update elements in ui
                setVaultItems(encryptedVault.items);
                setActiveActionItem(encryptedVault.items.find((item) => item.id === itemId) ?? null);
                setActiveActionItemView(ActiveActionItemView.ItemListingView);
            })
            .catch((error) => {
                alert(error);
            })
    }   

    const addItem = (masterKey: string, newItem: VaultItem) => {
        invoke("add_item_in_vault", {
            masterKey: masterKey,
            item: newItem
        })
            .then(() => {
                // Grab new elements
                return invoke<EncryptedVault>("get_vault_items");
            })
            .then((encryptedVault: EncryptedVault) => {
                // Update elements in ui
                setVaultItems(encryptedVault.items);
                setActiveActionItem(encryptedVault.items[encryptedVault.items.length - 1]);
                setActiveActionItemView(ActiveActionItemView.ItemListingView);
            })
            .catch((error) => {
                alert(error);
            })
    }

    const removeItem = (itemId: string) => {
        invoke("remove_item_in_vault", {
            itemId: itemId
        })
            .then(() => {
                // Grab new elements
                return invoke<EncryptedVault>("get_vault_items");
            })
            .then((encryptedVault: EncryptedVault) => {
                // Update elements in ui
                setVaultItems(encryptedVault.items);
                setActiveActionItem(null);
                setActiveActionItemView(ActiveActionItemView.ItemListingView);
            })
            .catch((error) => {
                alert(error);
            })
    }

    // On page load
    useEffect(() => {
        // Fetch items
        invoke<EncryptedVault>("get_vault_items")
            .then((encryptedVault) => {
                setVaultItems(encryptedVault.items);
            })
            .catch((error) => {
                console.error("GET VAULT ITEMS FAILED:", error);
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
                                value={searchItemsQuery}
                                onChange={(e) => setSearchItemsQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="header-new-item-btn" onClick={() => switchActiveActionItemView(ActiveActionItemView.NewItemView)}>
                        <Plus size={16} />
                        <span>New Item</span>
                    </button>
                </div>

                <Group orientation="horizontal">
                    <Panel defaultSize={35} minSize={20}>
                        <div className="all-items-page-panel">
                            <h2>Passwords</h2>

                            <div className="item-listings">
                                {searchedItems.map((item) => (
                                    <ItemListing
                                        key={item.id}
                                        item={item}
                                        onClick={(item: EncryptedVaultItem) => selectItemListing(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    </Panel>

                    <Separator className="all-items-page-resize-handle" />

                    <Panel defaultSize={65} minSize={"210px"}>
                        <div className="all-items-page-panel">
                            {activeActionItemView === ActiveActionItemView.NewItemView ? (
                                <NewItemView 
                                    onCancel={() => switchActiveActionItemView(ActiveActionItemView.ItemListingView)} 
                                    onConfirm={(masterKey: string, newVaultItem: VaultItem) => addItem(masterKey, newVaultItem)}
                                />
                            ) : (
                                <ItemView 
                                    item={activeActionItem} 
                                    onEdit={editItem}
                                    onRemove={removeItem}
                                />
                            )}
                        </div>
                    </Panel>
                </Group>
            </div>
        </>
    )
}

export { ItemsPage }