import { Star } from "lucide-react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import { ItemFavicon } from "../../../ItemFavicon/ItemFavicon";
import "./FavouriteItemViewHeader.css";

interface FavouriteItemViewHeaderProps {
    item: EncryptedVaultItem;
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function FavouriteItemViewHeader({ item, onFavourite }: FavouriteItemViewHeaderProps) {
    const toggleFavourite = () => {
        onFavourite(item.id, !item.is_favourite);
    };

    return (
        <div className="favourite-item-view-header">
            <div className="favourite-item-view-icon">
                <ItemFavicon url={item.urls[0]} size={20}/>
            </div>

            <div className="favourite-item-view-header-content">
                <h2>{item.name}</h2>
                <span>{item.username}</span>
            </div>

            <button
                type="button"
                className={`favourite-item-view-favourite-button ${
                    item.is_favourite ? "favourite" : ""
                }`}
                onClick={toggleFavourite}
                aria-label={
                    item.is_favourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                }
                title={
                    item.is_favourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                }
            >
                <Star
                    size={19}
                    fill={item.is_favourite ? "currentColor" : "none"}
                />
            </button>
        </div>
    );
}

export { FavouriteItemViewHeader };