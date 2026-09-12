import { Star } from "lucide-react";
import "./FavouriteItemListingEmpty.css";

function FavouriteItemListingEmpty() {
    return (
        <>
            <div className="favourite-items-empty-state">
                <div className="favourite-items-empty-icon">
                    <Star size={24} />
                </div>

                <h3>No favourite items</h3>

                <p>
                    Favourite your important passwords to quickly
                    access them here.
                </p>
            </div>

        </>
    )
}

export { FavouriteItemListingEmpty };