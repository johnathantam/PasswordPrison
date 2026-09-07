import { VaultItem } from "../../../types/vaultItem";
import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import { ItemViewEmpty } from "./ItemViewEmpty/ItemViewEmpty";
import { ItemViewHeader } from "./ItemViewHeader/ItemViewHeader";
import { ItemViewContent } from "./ItemViewContent/ItemViewContent";
import { ItemViewControls } from "./ItemViewControls/ItemViewControls";
import "./ItemView.css"

interface ItemViewProps {
    item: EncryptedVaultItem | null;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
}

function ItemView({ item, onEdit, onRemove }: ItemViewProps) {
    const handleEditItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        onEdit?.(itemId, masterKey, newItemContent);
    }

    const handleDeleteItem = (itemId: string) => {
        onRemove?.(itemId);
    }

    return (
        item === null ? (
            <ItemViewEmpty></ItemViewEmpty>
        ) : (
            <div className="item-view-container">
                <ItemViewHeader item={item}></ItemViewHeader>
                <ItemViewContent item={item}></ItemViewContent>
                <ItemViewControls item={item} onEdit={handleEditItem} onRemove={handleDeleteItem}></ItemViewControls>
            </div>
        )
    );
}

export { ItemView };