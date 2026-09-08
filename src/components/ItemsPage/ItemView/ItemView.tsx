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
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function ItemView({ item, onEdit, onRemove, onFavourite }: ItemViewProps) {
    const handleEditItem = (itemId: string, masterKey: string, newItemContent: VaultItem) => {
        console.log(newItemContent)
        onEdit?.(itemId, masterKey, newItemContent);
    }

    const handleDeleteItem = (itemId: string) => {
        onRemove?.(itemId);
    }

    const handleFavouriteItem = (itemId: string, favouriteStatus: boolean) => {
        onFavourite(itemId, favouriteStatus);
    }

    return (
        item === null ? (
            <ItemViewEmpty></ItemViewEmpty>
        ) : (
            <div className="item-view-container">
                <ItemViewHeader item={item} onFavourite={handleFavouriteItem}></ItemViewHeader>
                <ItemViewContent item={item}></ItemViewContent>
                <ItemViewControls item={item} onEdit={handleEditItem} onRemove={handleDeleteItem}></ItemViewControls>
            </div>
        )
    );
}

export { ItemView };