import { VaultItem } from "../../../types/vaultItem";
import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import { FavouriteItemViewEmpty } from "./FavouriteItemViewEmpty/FavouriteItemViewEmpty";
import { FavouriteItemViewHeader } from "./FavouriteItemViewHeader/FavouriteItemViewHeader";
import { FavouriteItemViewContent } from "./FavouriteItemViewContent/FavouriteItemViewContent";
import { FavouriteItemViewControls } from "./FavouriteItemViewControls/FavouriteItemViewControls";
import "./FavouriteItemView.css"

interface FavouriteItemViewProps {
    item: EncryptedVaultItem | null;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
    onRemove: (itemId: string) => void;
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function FavouriteItemView({ item, onEdit, onRemove, onFavourite }: FavouriteItemViewProps) {
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
            <FavouriteItemViewEmpty></FavouriteItemViewEmpty>
        ) : (
            <div className="favourite-item-view-container">
                <FavouriteItemViewHeader item={item} onFavourite={handleFavouriteItem}></FavouriteItemViewHeader>
                <FavouriteItemViewContent item={item}></FavouriteItemViewContent>
                <FavouriteItemViewControls item={item} onEdit={handleEditItem} onRemove={handleDeleteItem}></FavouriteItemViewControls>
            </div>
        )
    );
}

export { FavouriteItemView };