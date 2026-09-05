import { Globe } from "lucide-react";
import { EncryptedVaultItem } from "../../../types/encryptedVaultItem";
import "./ItemListing.css";

interface ItemListingProps {
    item: EncryptedVaultItem;
    onClick: (item: EncryptedVaultItem) => void;
}

function ItemListing({ item, onClick }: ItemListingProps) {
    const handleClick = () => {
        onClick?.(item);
    }

    return (
        <div className="item-listing-container" onClick={handleClick}>
            <div className="item-listing-icon">
                <Globe size={16} />
            </div>

            <div className="item-listing-content">
                <span className="item-listing-name">
                    {item.name}
                </span>

                <span className="item-listing-username">
                    {item.username}
                </span>
            </div>
        </div>
    );
}

export { ItemListing };