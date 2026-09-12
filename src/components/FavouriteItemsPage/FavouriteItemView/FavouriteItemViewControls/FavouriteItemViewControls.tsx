import { useState } from "react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import { FavouriteItemEditControlsView } from "./FavouriteItemEditControlsView/FavouriteItemEditControlsView";
import { FavouriteItemDeleteControlsView } from "./FavouriteItemDeleteControlsView/FavouriteItemDeleteControlsView";
import { VaultItem } from "../../../../types/vaultItem";
import "./FavouriteItemViewControls.css";

interface FavouriteItemViewControlsProps {
    item: EncryptedVaultItem;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
}

function FavouriteItemViewControls({item, onEdit, onRemove,}: FavouriteItemViewControlsProps) {
    const [showItemControls, setShowItemControls] = useState(false);

    let handleEditItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        onEdit(itemId, masterKey, newItemContent);
    }

    let handleDeleteItem = (itemId: string) => {
        onRemove(itemId);
    }

    return (
        <div className="favourite-item-view-controls">
            <button
                type="button"
                className="favourite-item-view-controls-header"
                onClick={() =>
                    setShowItemControls((currentValue) => !currentValue)
                }
            >
                <div>
                    <h3>Controls</h3>
                    <p>Manage this password and its stored data.</p>
                </div>

                <span className={`favourite-item-view-controls-chevron ${showItemControls ? "open" : ""}`}>
                    ▼
                </span>
            </button>

            {showItemControls && (
                <div className="favourite-item-view-controls-list">
                    <FavouriteItemEditControlsView item={item} onEdit={handleEditItem}></FavouriteItemEditControlsView>
                    <FavouriteItemDeleteControlsView item={item} onRemove={handleDeleteItem}></FavouriteItemDeleteControlsView> 
                </div>
            )}
        </div>
    );
}

export { FavouriteItemViewControls };