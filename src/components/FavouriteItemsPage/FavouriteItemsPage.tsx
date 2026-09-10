import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Search, Plus } from "lucide-react";
import { FavouriteItemListing } from "./FavouriteItemListing/FavouriteItemListing";
import { NewFavouriteItemView } from "./NewFavouriteItemView/NewFavouriteItemView";
import { EncryptedVault } from "../../types/encryptedVault";
import { EncryptedVaultItem } from "../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import { VaultItem } from "../../types/vaultItem";
import { FavouriteItemView } from "./FavouriteItemView/FavouriteItemView";
import { VaultItemCategory } from "../../enums/vaultItemCategory";
import "./FavouriteItemsPage.css";

enum ActiveActionItemView {
    NewItemView,
    ItemListingView
}

function FavouriteItemsPage() {
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
                return encryptedVault.items.filter((item: EncryptedVaultItem) => item.is_favourite);
            })
            .then((encryptedItems: EncryptedVaultItem[]) => {
                // Update elements in ui
                setVaultItems(encryptedItems);
                setActiveActionItem(encryptedItems.find((item) => item.id === itemId) ?? null);
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
                return encryptedVault.items.filter((item: EncryptedVaultItem) => item.is_favourite);
            })
            .then((encryptedItems: EncryptedVaultItem[]) => {
                // Update elements in ui
                setVaultItems(encryptedItems);
                setActiveActionItem(encryptedItems.find((item) => item.id === itemId) ?? null);
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
                return encryptedVault.items.filter((item: EncryptedVaultItem) => item.is_favourite);
            })
            .then((encryptedItems: EncryptedVaultItem[]) => {
                // Update elements in ui
                setVaultItems(encryptedItems);
                setActiveActionItem(encryptedItems[encryptedItems.length - 1]);
                setActiveActionItemView(ActiveActionItemView.ItemListingView);
            })
            .catch((error) => {
                alert(error);
            })
    }

    const removeItem = (itemId: string) => {
        invoke("trash_item_in_vault", {
            itemId: itemId
        })
            .then(() => {
                // Grab new elements
                return invoke<EncryptedVault>("get_vault_items");
            })
            .then((encryptedVault: EncryptedVault) => {
                return encryptedVault.items.filter((item: EncryptedVaultItem) => item.is_favourite);
            })
            .then((encryptedItems: EncryptedVaultItem[]) => {
                // Update elements in ui
                setVaultItems(encryptedItems);
                setActiveActionItem(null);
                setActiveActionItemView(ActiveActionItemView.ItemListingView);
            })
            .catch((error) => {
                alert(error);
            })
    }

    // On page load
    useEffect(() => {
        // Fetch items and filter for favourites
        invoke<EncryptedVault>("get_vault_items")
            .then((encryptedVault) => {
                setVaultItems(encryptedVault.items.filter((item: EncryptedVaultItem) => item.is_favourite));
            })
            .catch((error) => {
                console.error("GET VAULT ITEMS FAILED:", error);
            });
    }, [])

    return (
        <>
            <div className="favourite-items-page">
                <div className="favourite-items-header-container">
                    <div className="header-left">
                        <div className="favourite-header-search">
                            <Search size={15} className="favourite-header-search-icon" />
                            <input
                                type="text"
                                placeholder="Search favourites..."
                                className="favourite-header-search-input"
                                value={searchItemsQuery}
                                onChange={(e) => setSearchItemsQuery(e.target.value)} 
                            />
                        </div>
                    </div>

                    <button className="favourite-header-new-item-btn" onClick={() => switchActiveActionItemView(ActiveActionItemView.NewItemView)}>
                        <Plus size={16} />
                        <span>New Favourite Item</span>
                    </button>
                </div>

                <Group orientation="horizontal">
                    <Panel defaultSize={35} minSize={20}>
                        <div className="favourite-items-page-panel">
                            <div className="favourite-items-listings-header">
                                <h2 className="favourite-items-listings-title">Items</h2>

                                <select
                                    className="favourite-items-category-filter"
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

                            <div className="favourite-items-listings">
                                {searchedItems.map((item) => (
                                    <FavouriteItemListing
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
                                <NewFavouriteItemView
                                    onCancel={() => switchActiveActionItemView(ActiveActionItemView.ItemListingView)} 
                                    onConfirm={(masterKey: string, newVaultItem: VaultItem) => addItem(masterKey, newVaultItem)}
                                />
                            ) : (
                                <FavouriteItemView key={activeActionItem?.id}
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

export { FavouriteItemsPage }