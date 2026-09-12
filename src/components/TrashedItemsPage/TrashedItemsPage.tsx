import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Search } from "lucide-react";
import { EncryptedVault } from "../../types/encryptedVault";
import { EncryptedVaultItem } from "../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import { TrashedItemListing } from "./TrashedItemListing/TrashedItemListing";
import { TrashedItemView } from "./TrashedItemView/TrashedItemView";
import { VaultItemCategory } from "../../enums/vaultItemCategory";
import { VaultItem } from "../../types/vaultItem";
import "./TrashedItemsPage.css";
import { TrashedItemListingEmpty } from "./TrashedItemListingEmpty/TrashedItemListingEmpty";

function TrashedItemsPage() {
    const [vaultItems, setVaultItems] = useState<EncryptedVaultItem[]>([]);
    const [activeActionItem, setActiveActionItem] = useState<EncryptedVaultItem | null>(null);

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

    const switchActiveActionItem = (newActiveActionItem: EncryptedVaultItem) => {
        setActiveActionItem(newActiveActionItem);
    }

    const selectItemListing = (itemSelected: EncryptedVaultItem) => {
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
                setVaultItems(encryptedVault.trashed_items);
                setActiveActionItem(encryptedVault.trashed_items.find((item) => item.id === itemId) ?? null);
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
                setVaultItems(encryptedVault.trashed_items);
                setActiveActionItem(encryptedVault.trashed_items.find((item) => item.id === itemId) ?? null);
            })
            .catch((error) => {
                alert(error);
            })
    }

    const removeItem = (itemId: string) => {
        invoke("remove_item_in_trash", {
            itemId: itemId
        })
            .then(() => {
                // Grab new elements
                return invoke<EncryptedVault>("get_vault_items");
            })
            .then((encryptedVault: EncryptedVault) => {
                // Update elements in ui
                setVaultItems(encryptedVault.trashed_items);
                setActiveActionItem(null);
            })
            .catch((error) => {
                alert(error);
            })
    }

    // On page load
    useEffect(() => {
        // Fetch trashed items
        invoke<EncryptedVault>("get_vault_items")
            .then((encryptedVault) => {
                setVaultItems(encryptedVault.trashed_items);
            })
            .catch((error) => {
                console.error("GET VAULT ITEMS FAILED:", error);
            });
    }, [])

    return (
        <>
            <div className="trashed-items-page">
                <div className="trashed-items-header-container">
                    <div className="header-left">
                        <div className="trashed-header-search">
                            <Search size={15} className="trashed-header-search-icon" />
                            <input
                                type="text"
                                placeholder="Search trasheds..."
                                className="trashed-header-search-input"
                                value={searchItemsQuery}
                                onChange={(e) => setSearchItemsQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Group orientation="horizontal">
                    <Panel defaultSize={35} minSize={20}>
                        <div className="trashed-items-page-panel">
                            <div className="trashed-items-listings-header">
                                <h2 className="trashed-items-listings-title">Trash Items</h2>

                                <select
                                    className="trashed-items-category-filter"
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

                            <div className="trashed-items-listings">
                                {searchedItems.length === 0 ? (
                                    <TrashedItemListingEmpty />
                                ) : (
                                    searchedItems.map((item) => (
                                        <TrashedItemListing
                                            key={item.id}
                                            item={item}
                                            onClick={(item: EncryptedVaultItem) => selectItemListing(item) }
                                            onFavourite={( itemId: string, favouriteStatus: boolean ) => favouriteItem(itemId, favouriteStatus) }
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </Panel>

                    <Separator className="all-items-page-resize-handle" />

                    <Panel defaultSize={35} minSize={20}>
                        <div className="all-items-page-panel">
                            <TrashedItemView key={activeActionItem?.id}
                                item={activeActionItem}
                                onEdit={editItem}
                                onRemove={removeItem}
                                onFavourite={favouriteItem}
                            />
                        </div>
                    </Panel>
                </Group>
            </div>
        </>
    )
}

export { TrashedItemsPage }