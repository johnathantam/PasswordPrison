import { useState } from "react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import { ItemEditControlsView } from "./ItemEditControlsView/ItemEditControlsView";
import { ItemDeleteControlsView } from "./ItemDeleteControlsView/ItemDeleteControlsView";
import { VaultItem } from "../../../../types/vaultItem";
import "./ItemViewControls.css";

interface ItemViewControlsProps {
    item: EncryptedVaultItem;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
}

function ItemViewControls({item, onEdit, onRemove,}: ItemViewControlsProps) {
    const [showItemControls, setShowItemControls] = useState(false);

    let handleEditItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        onEdit(itemId, masterKey, newItemContent);
    }

    let handleDeleteItem = (itemId: string) => {
        onRemove(itemId);
    }

    return (
        <div className="item-view-controls">
            <button
                type="button"
                className="item-view-controls-header"
                onClick={() =>
                    setShowItemControls((currentValue) => !currentValue)
                }
            >
                <div>
                    <h3>Controls</h3>
                    <p>Manage this password and its stored data.</p>
                </div>

                <span className={`item-view-controls-chevron ${showItemControls ? "open" : ""}`}>
                    ▼
                </span>
            </button>

            {showItemControls && (
                <div className="item-view-controls-list">
                    <ItemEditControlsView item={item} onEdit={handleEditItem}></ItemEditControlsView>
                    <ItemDeleteControlsView item={item} onRemove={handleDeleteItem}></ItemDeleteControlsView> 
                </div>
            )}
        </div>
    );
}

export { ItemViewControls };