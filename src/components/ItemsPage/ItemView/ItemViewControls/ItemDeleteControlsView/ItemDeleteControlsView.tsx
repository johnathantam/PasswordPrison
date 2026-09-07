import { useState } from "react";
import { EncryptedVaultItem } from "../../../../../types/encryptedVaultItem";
import "./ItemDeleteControlsView.css";
import { invoke } from "@tauri-apps/api/core";

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
        <div className="item-view-control-section">
            <button
                type="button"
                className="item-view-control item-view-control-danger"
                onClick={() => {
                    if (deleteState === DeleteState.Closed) {
                        startItemDeletion();
                    } else {
                        cancelItemDeletionProcess();
                    }
                }}
            >
                <div className="item-view-control-content">
                    <span className="item-view-control-title">
                        Delete password
                    </span>

                    <span className="item-view-control-description">
                        Permanently remove this password from
                        your vault.
                    </span>
                </div>

                <span
                    className={`item-view-control-arrow ${
                        deleteState !== DeleteState.Closed
                            ? "open"
                            : ""
                    }`}
                >
                    →
                </span>
            </button>

            {/* DELETE CONFIRMATION -- user has to click continue */}

            {deleteState === DeleteState.Confirmation && (
                <div className="item-view-control-panel item-view-control-panel-danger">
                    <div className="delete-item-confirmation">
                        <div className="delete-item-confirmation-content">
                            <h4>Delete this password?</h4>

                            <p>
                                This action permanently removes
                                this password from your vault.
                                This cannot be undone.
                            </p>
                        </div>

                        <div className="delete-item-confirmation-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={cancelItemDeletionProcess}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn-danger"
                                onClick={confirmItemDeletionWithMasterKey}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MASTER KEY -- user has to enter their master key */}

            {deleteState === DeleteState.MasterKey && (
                <div className="item-view-control-panel item-view-control-panel-danger">
                    <div className="master-key-prompt-header">
                        <span>Enter Master Key</span>

                        <p>
                            Enter your master key to permanently
                            delete this password.
                        </p>
                    </div>

                    <div className="master-key-prompt-row">
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
                            className="form-input"
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
                            className="btn-secondary"
                            onClick={cancelItemDeletionProcess}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn-danger"
                            onClick={deleteItem}
                            disabled={
                                deleteMasterKeyInput.length === 0
                            }
                        >
                            Delete password
                        </button>
                    </div>

                    {deleteMasterKeyInputError && (
                        <span className="form-helper form-helper-error">
                            {deleteMasterKeyInputError}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export { ItemDeleteControlsView };