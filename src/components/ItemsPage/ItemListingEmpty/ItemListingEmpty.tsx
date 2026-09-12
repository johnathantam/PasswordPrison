import { Globe, Star } from "lucide-react";
import "./ItemListingEmpty.css";

function ItemListingEmpty() {
    return (
        <>
            <div className="items-empty-state">
                <div className="items-empty-icon">
                    <Globe size={24}></Globe>
                </div>

                <h3>No items</h3>

                <p>
                    Add a new password to quickly
                    access them here.
                </p>
            </div>

        </>
    )
}

export { ItemListingEmpty };