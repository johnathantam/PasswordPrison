import { KeyRound } from "lucide-react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import "./ItemViewHeader.css";

interface ItemViewHeaderProps {
    item: EncryptedVaultItem;
}

function ItemViewHeader({ item }: ItemViewHeaderProps) {
    return (
        <div className="item-view-header">
            <div className="item-view-icon">
                <KeyRound size={20} />
            </div>

            <div className="item-view-header-content">
                <h2>{item.name}</h2>
                <span>{item.username}</span>
            </div>
        </div>
    )
}

export { ItemViewHeader }