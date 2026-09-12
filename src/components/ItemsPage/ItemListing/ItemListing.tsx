import { Globe, Star } from "lucide-react";
import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import { ItemFavicon } from "../../ItemFavicon/ItemFavicon";
import "./ItemListing.css";

interface ItemListingProps {
    item: EncryptedVaultItem;
    onClick: (item: EncryptedVaultItem) => void;
    onFavourite: (itemId: string, favouriteStatus: boolean) => void;
}

function ItemListing({ item, onClick, onFavourite }: ItemListingProps) {
    const handleClick = () => {
        onClick(item);
    };

    const handleFavourite = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        onFavourite(item.id, !item.is_favourite);
    };

    return (
        <div className="item-listing-container" onClick={handleClick}>
            <div className="item-listing-icon">
                <ItemFavicon url={item.urls[0]} size={16} ></ItemFavicon>
            </div>

            <div className="item-listing-content">
                <span className="item-listing-name">
                    {item.name}
                </span>

                <span className="item-listing-username">
                    {item.username}
                </span>
            </div>

            <button
                type="button"
                className={`item-listing-favourite-button ${
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

export { ItemListing };