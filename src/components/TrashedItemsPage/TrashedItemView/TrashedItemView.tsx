import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import { TrashedItemViewEmpty } from "./TrashedItemViewEmpty/TrashedItemViewEmpty";
import { TrashedItemViewHeader } from "./TrashedItemViewHeader/TrashedItemViewHeader";
import { TrashedItemViewContent } from "./TrashedItemViewContent/TrashedItemViewContent";
import { TrashedItemViewControls } from "./TrashedItemViewControls/TrashedItemViewControls";
import { VaultItem } from "../../../types/vaultItem";
import "./TrashedItemView.css"

interface TrashedItemViewProps {
    item: EncryptedVaultItem | null;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function TrashedItemView({ item, onEdit, onRemove, onFavourite }: TrashedItemViewProps) {
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
            <TrashedItemViewEmpty></TrashedItemViewEmpty>
        ) : (
            <div className="trashed-item-view-container">
                <TrashedItemViewHeader item={item} onFavourite={handleFavouriteItem}></TrashedItemViewHeader>
                <TrashedItemViewContent item={item}></TrashedItemViewContent>
                <TrashedItemViewControls item={item} onRemove={handleDeleteItem} onEdit={handleEditItem}></TrashedItemViewControls>
            </div>
        )
    );
}

export { TrashedItemView };