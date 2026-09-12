import { Trash2 } from "lucide-react";
import "./TrashedItemListingEmpty.css";

function TrashedItemListingEmpty() {
    return (
        <>
            <div className="trashed-items-empty-state">
                <div className="trashed-items-empty-icon">
                    <Trash2 size={24} />
                </div>

                <h3>No trashed items</h3>

                <p>
                    Favourite your important passwords to quickly
                    access them here.
                </p>
            </div>

        </>
    )
}

export { TrashedItemListingEmpty };