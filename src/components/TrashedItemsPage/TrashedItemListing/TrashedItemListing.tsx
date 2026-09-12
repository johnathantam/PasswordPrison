import { Star } from "lucide-react";
import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import { ItemFavicon } from "../../ItemFavicon/ItemFavicon";
import "./TrashedItemListing.css";

interface TrashedItemListingProps {
    item: EncryptedVaultItem;
    onClick: (item: EncryptedVaultItem) => void;
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function TrashedItemListing({ item, onClick, onFavourite }: TrashedItemListingProps) {
    const handleClick = () => {
        onClick(item);
    };

    const handleFavourite = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        onFavourite(item.id, !item.is_favourite);
    };

    return (
        <div className="trashed-item-listing-container" onClick={handleClick}>
            <div className="trashed-item-listing-icon">
                <ItemFavicon url={item.urls[0]} size={16} />
            </div>

            <div className="trashed-item-listing-content">
                <span className="trashed-item-listing-name">
                    {item.name}
                </span>

                <span className="trashed-item-listing-username">
                    {item.username}
                </span>
            </div>

            <button
                type="button"
                className={`trashed-item-listing-favourite-button ${
                    item.is_favourite ? "favourite" : ""
                }`}
                onClick={handleFavourite}
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
                    size={17}
                    fill={item.is_favourite ? "currentColor" : "none"}
                />
            </button>
        </div>
    );
}

export { TrashedItemListing };