import { useState } from "react";
import { EncryptedVaultItem } from "../../../../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import "./FavouriteItemDeleteControlsView.css";

enum DeleteState {
    Closed,
    Confirmation,
    MasterKey,
}

interface FavouriteItemDeleteControlsViewProps {
    item: EncryptedVaultItem;
    onRemove: (itemId: string) => void;
}

function FavouriteItemDeleteControlsView({
    item,
    onRemove,
}: FavouriteItemDeleteControlsViewProps) {
    const [deleteState, setDeleteState] = useState<DeleteState>(
        DeleteState.Closed
    );

    const [deleteMasterKeyInput, setDeleteMasterKeyInput] = useState("");
    const [deleteMasterKeyInputError, setDeleteMasterKeyInputError] =
        useState<string | null>(null);

    const startItemDeletion = () => {
        setDeleteState(DeleteState.Confirmation);
        setDeleteMasterKeyInput("");
        setDeleteMasterKeyInputError(null);
    };

    const confirmItemDeletionWithMasterKey = () => {
        setDeleteState(DeleteState.MasterKey);
        setDeleteMasterKeyInput("");
        setDeleteMasterKeyInputError(null);
    };

    const deleteItem = async () => {
        if (deleteMasterKeyInput.length === 0) {
            setDeleteMasterKeyInputError("Master key is required");
            return;
        }

        try {
            await invoke("verify_vault_item_master_key", {
                itemId: item.id,
                masterKey: deleteMasterKeyInput,
            });

            onRemove(item.id);
            cancelItemDeletionProcess();
        } catch (err) {
            setDeleteMasterKeyInputError("Incorrect master key");
        }
    };

    const cancelItemDeletionProcess = () => {
        setDeleteState(DeleteState.Closed);
        setDeleteMasterKeyInput("");
        setDeleteMasterKeyInputError(null);
    };

    return (
        <div className="favourite-item-delete-controls-section">
            <button
                type="button"
                className="favourite-item-delete-control"
                onClick={() => {
                    if (deleteState === DeleteState.Closed) {
                        startItemDeletion();
                    } else {
                        cancelItemDeletionProcess();
                    }
                }}
            >
                <div className="favourite-item-delete-control-content">
                    <span className="favourite-item-delete-control-title">
                        Delete password
                    </span>

                    <span className="favourite-item-delete-control-description">
                        Permanently remove this password from your vault.
                    </span>
                </div>

                <span
                    className={`favourite-item-delete-control-arrow ${
                        deleteState !== DeleteState.Closed ? "open" : ""
                    }`}
                >
                    →
                </span>
            </button>

            {/* DELETE CONFIRMATION */}

            {deleteState === DeleteState.Confirmation && (
                <div className="favourite-item-delete-control-panel">
                    <div className="favourite-item-delete-confirmation">
                        <div className="favourite-item-delete-confirmation-content">
                            <h4>Delete this password?</h4>

                            <p>
                                This action permanently removes this
                                password from your vault. This cannot be
                                undone.
                            </p>
                        </div>

                        <div className="favourite-item-delete-confirmation-actions">
                            <button
                                type="button"
                                className="favourite-item-delete-button-secondary"
                                onClick={cancelItemDeletionProcess}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="favourite-item-delete-button-danger"
                                onClick={confirmItemDeletionWithMasterKey}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MASTER KEY */}

            {deleteState === DeleteState.MasterKey && (
                <div className="favourite-item-delete-control-panel">
                    <div className="favourite-item-delete-master-key-header">
                        <span>Enter Master Key</span>

                        <p>
                            Enter your master key to permanently delete
                            this password.
                        </p>
                    </div>

                    <div className="favourite-item-delete-master-key-row">
                        <input
                            type="password"
                            placeholder="Master Key"
                            value={deleteMasterKeyInput}
                            onChange={(e) => {
                                setDeleteMasterKeyInput(e.target.value);
                                setDeleteMasterKeyInputError(null);
                            }}
                            className="favourite-item-delete-master-key-input"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    deleteItem();
                                }

                                if (e.key === "Escape") {
                                    cancelItemDeletionProcess();
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="favourite-item-delete-button-secondary"
                            onClick={cancelItemDeletionProcess}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="favourite-item-delete-button-danger"
                            onClick={deleteItem}
                            disabled={deleteMasterKeyInput.length === 0}
                        >
                            Delete password
                        </button>
                    </div>

                    {deleteMasterKeyInputError && (
                        <span className="favourite-item-delete-master-key-error">
                            {deleteMasterKeyInputError}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export { FavouriteItemDeleteControlsView };