import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Search, Plus } from "lucide-react";
import { ItemListing } from "./ItemListing/ItemListing";
import { NewItemView } from "./NewItemView/NewItemView";
import { EncryptedVault } from "../../types/encryptedVault";
import { EncryptedVaultItem } from "../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import { VaultItem } from "../../types/vaultItem";
import { ItemView } from "./ItemView/ItemView";
import { VaultItemCategory } from "../../enums/vaultItemCategory";
import "./ItemsPage.css";

enum ActiveActionItemView {
    NewItemView,
    ItemListingView
}

function ItemsPage() {
    const [vaultItems, setVaultItems] = useState<EncryptedVaultItem[]>([]);
    const [activeActionItem, setActiveActionItem] = useState<EncryptedVaultItem | null>(null);
    const [activeActionItemView, setActiveActionItemView] = useState<ActiveActionItemView>(ActiveActionItemView.NewItemView);

    const [searchItemsQuery, setSearchItemsQuery] = useState("");    
    const [selectedCategory, setSelectedCategory] = useState<VaultItemCategory | "all">("all");
    const searchedItems: EncryptedVaultItem[] = vaultItems.filter((item) => {
        const query = searchItemsQuery.trim().toLowerCase();

        const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query) ||
            item.urls.some((url) => url.toLowerCase().includes(query));

        const matchesCategory =
            selectedCategory === "all" ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
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

    const favouriteItem = (itemId: string, newFavouriteStatus: boolean) => {
        invoke("favourite_item_in_vault", {
            itemId: itemId,
            newFavouriteStatus: newFavouriteStatus
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
                            <div className="item-listings-header">
                                <h2 className="item-listings-title">Items</h2>

                                <select
                                    className="item-category-filter"
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(
                                            e.target.value as VaultItemCategory | "all"
                                        )
                                    }
                                >
                                    <option value="all">All categories</option>

                                    {Object.values(VaultItemCategory).map((category) => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="item-listings">
                                {searchedItems.map((item) => (
                                    <ItemListing
                                        key={item.id}
                                        item={item}
                                        onClick={(item: EncryptedVaultItem) => selectItemListing(item)}
                                        onFavourite={(itemId: string, favouriteStatus: boolean) => favouriteItem(itemId, favouriteStatus)}
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
                                <ItemView key={activeActionItem?.id}
                                    item={activeActionItem} 
                                    onEdit={editItem}
                                    onRemove={removeItem}
                                    onFavourite={favouriteItem}
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