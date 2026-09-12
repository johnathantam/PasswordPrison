import { LockKeyhole } from "lucide-react";
import "./TrashedItemViewEmpty.css";

function TrashedItemViewEmpty() {
    return (
        <div className="trashed-item-view-empty">
            <div className="trashed-item-view-empty-icon">
                <LockKeyhole size={30} />
            </div>

            <h2>No item selected</h2>

            <p>
                Select a item from the list to view its details.
            </p>
        </div>
    )
}

export { TrashedItemViewEmpty }