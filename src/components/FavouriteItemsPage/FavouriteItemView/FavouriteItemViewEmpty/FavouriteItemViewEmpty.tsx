import { LockKeyhole } from "lucide-react";
import "./FavouriteItemViewEmpty.css";

function FavouriteItemViewEmpty() {
    return (
        <div className="favourite-item-view-empty">
            <div className="favourite-item-view-empty-icon">
                <LockKeyhole size={30} />
            </div>

            <h2>No item selected</h2>

            <p>
                Select a item from the list to view its details.
            </p>
        </div>
    )
}

export { FavouriteItemViewEmpty }