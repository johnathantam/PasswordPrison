import { useState } from "react";
import { EncryptedVaultItem } from "../../../../../types/encryptedVaultItem";
import { invoke } from "@tauri-apps/api/core";
import "./ItemDeleteControlsView.css";

enum DeleteState {
    Closed,
    Confirmation,
    MasterKey,
}

interface ItemDeleteControlsViewProps {
    item: EncryptedVaultItem;
    onRemove: (itemId: string) => void;
}

function ItemDeleteControlsView({ item, onRemove }: ItemDeleteControlsViewProps) {
    // Delete state
    const [deleteState, setDeleteState] = useState<DeleteState>(DeleteState.Closed);
    const [deleteMasterKeyInput, setDeleteMasterKeyInput] = useState("");
    const [deleteMasterKeyInputError, setDeleteMasterKeyInputError] = useState<string | null>(null);

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
            // Verify the master key first
            await invoke("verify_vault_item_master_key", {
                itemId: item.id,
                masterKey: deleteMasterKeyInput,
            })

            onRemove(item.id);
            cancelItemDeletionProcess();
        } catch (err) {
            setDeleteMasterKeyInputError("Incorrect master key");
        }
    }

    const cancelItemDeletionProcess = () => {
        setDeleteState(DeleteState.Closed);
        setDeleteMasterKeyInput("");
        setDeleteMasterKeyInputError(null);
    };

    return (
        <div className="item-delete-controls-section">
            <button
                type="button"
                className="item-delete-control"
                onClick={() => {
                    if (deleteState === DeleteState.Closed) {
                        startItemDeletion();
                    } else {
                        cancelItemDeletionProcess();
                    }
                }}
            >
                <div className="item-delete-control-content">
                    <span className="item-delete-control-title">
                        Delete password
                    </span>

                    <span className="item-delete-control-description">
                        Permanently remove this password from
                        your vault.
                    </span>
                </div>

                <span
                    className={`item-delete-control-arrow ${
                        deleteState !== DeleteState.Closed
                            ? "open"
                            : ""
                    }`}
                >
                    →
                </span>
            </button>

            {/* Delete confirmation */}

            {deleteState === DeleteState.Confirmation && (
                <div className="item-delete-control-panel">
                    <div className="item-delete-confirmation">
                        <div className="item-delete-confirmation-content">
                            <h4>Delete this password?</h4>

                            <p>
                                This action permanently removes
                                this password from your vault.
                                This cannot be undone.
                            </p>
                        </div>

                        <div className="item-delete-confirmation-actions">
                            <button
                                type="button"
                                className="item-delete-button-secondary"
                                onClick={cancelItemDeletionProcess}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="item-delete-button-danger"
                                onClick={confirmItemDeletionWithMasterKey}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete master key */}

            {deleteState === DeleteState.MasterKey && (
                <div className="item-delete-control-panel">
                    <div className="item-delete-master-key-header">
                        <span>Enter Master Key</span>

                        <p>
                            Enter your master key to permanently
                            delete this password.
                        </p>
                    </div>

                    <div className="item-delete-master-key-row">
                        <input
                            type="password"
                            placeholder="Master Key"
                            value={deleteMasterKeyInput}
                            onChange={(e) => {
                                setDeleteMasterKeyInput(
                                    e.target.value
                                );
                                setDeleteMasterKeyInputError(null);
                            }}
                            className="item-delete-master-key-input"
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
                            className="item-delete-button-secondary"
                            onClick={cancelItemDeletionProcess}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="item-delete-button-danger"
                            onClick={deleteItem}
                            disabled={
                                deleteMasterKeyInput.length === 0
                            }
                        >
                            Delete password
                        </button>
                    </div>

                    {deleteMasterKeyInputError && (
                        <span className="item-delete-master-key-error">
                            {deleteMasterKeyInputError}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export { ItemDeleteControlsView };