import { useState } from "react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import { TrashedItemEditControlsView } from "./TrashedItemEditControlsView/TrashedItemEditControlsView";
import { TrashedItemDeleteControlsView } from "./TrashedItemDeleteControlsView/TrashedItemDeleteControlsView";
import { VaultItem } from "../../../../types/vaultItem";
import "./TrashedItemViewControls.css";

interface TrashedItemViewControlsProps {
    item: EncryptedVaultItem;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
}

function TrashedItemViewControls({item, onEdit, onRemove,}: TrashedItemViewControlsProps) {
    const [showItemControls, setShowItemControls] = useState(false);

    let handleEditItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        onEdit(itemId, masterKey, newItemContent);
    }

    let handleDeleteItem = (itemId: string) => {
        onRemove(itemId);
    }

    return (
        <div className="trashed-item-view-controls">
            <button
                type="button"
                className="trashed-item-view-controls-header"
                onClick={() =>
                    setShowItemControls((currentValue) => !currentValue)
                }
            >
                <div>
                    <h3>Controls</h3>
                    <p>Manage this password and its stored data.</p>
                </div>

                <span className={`trashed-item-view-controls-chevron ${showItemControls ? "open" : ""}`}>
                    ▼
                </span>
            </button>

            {showItemControls && (
                <div className="trashed-item-view-controls-list">
                    <TrashedItemEditControlsView item={item} onEdit={handleEditItem}></TrashedItemEditControlsView>
                    <TrashedItemDeleteControlsView item={item} onRemove={handleDeleteItem}></TrashedItemDeleteControlsView> 
                </div>
            )}
        </div>
    );
}

export { TrashedItemViewControls };