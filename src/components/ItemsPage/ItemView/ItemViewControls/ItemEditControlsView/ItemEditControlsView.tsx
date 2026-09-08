import { invoke } from "@tauri-apps/api/core";
import { Globe, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncryptedVaultItem } from "../../../../../types/encryptedVaultItem";
import { VaultItemCategory } from "../../../../../enums/vaultItemCategory";
import { VaultItem } from "../../../../../types/vaultItem";
import "./ItemEditControlsView.css";

enum EditState {
    Closed,
    MasterKey,
    Form,
}

interface ItemEditControlsViewProps {
    item: EncryptedVaultItem;
    onEdit: (itemId: string, masterKey: string, newItemContent: VaultItem) => void;
}

function ItemEditControlsView({ item, onEdit }: ItemEditControlsViewProps) {
    // Edit state
    const [editState, setEditState] = useState<EditState>(EditState.Closed);
    const [editMasterKeyPromptInput, setEditMasterKeyPromptInput] = useState("");
    const [editMasterKeyPromptInputError, setEditMasterKeyPromptInputError] = useState<string | null>(null);
    const [isDecryptingPassword, setIsDecryptingPassword] = useState(false);
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);

    // Edit form input states
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState<VaultItemCategory>(VaultItemCategory.Login);
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editMasterKey, setEditMasterKey] = useState("");
    const [editUrls, setEditUrls] = useState<string[]>([]);
    const [editNotes, setEditNotes] = useState("");
    const [editFormError, setEditFormError] = useState<string | null>(null);

    const startEditingItem = () => {
        setEditState(EditState.MasterKey);

        setEditMasterKeyPromptInput("");
        setEditMasterKeyPromptInputError(null);
        setDecryptedPassword(null);
    };

    const cancelEditingItem = () => {
        setEditState(EditState.Closed);

        setEditMasterKeyPromptInput("");
        setEditMasterKeyPromptInputError(null);
        setDecryptedPassword(null);

        setEditName("");
        setEditCategory(VaultItemCategory.Login);
        setEditUsername("");
        setEditPassword("");
        setEditUrls([]);
        setEditNotes("");
    };

    const unlockEditForm = async () => {
        const masterKeyInput = editMasterKeyPromptInput;
        if (!masterKeyInput) {
            return;
        }

        setIsDecryptingPassword(true);
        setEditMasterKeyPromptInputError(null);

        try {
            const decryptedPassword = await invoke<string>("decrypt_vault_item_password", {
                itemId: item.id,
                masterKey: masterKeyInput,
            }); 
            
            setDecryptedPassword(decryptedPassword);
            setEditName(item.name);
            setEditCategory(item.category); 
            setEditUsername(item.username);
            setEditPassword(decryptedPassword);
            setEditUrls([...item.urls]);
            setEditNotes(item.notes ?? "");

            // Preserve the key used to decrypt the existing item.
            setEditMasterKey(masterKeyInput);
            setEditMasterKeyPromptInput("");
            setEditState(EditState.Form);
        } catch (error) {
            setEditMasterKeyPromptInputError("Incorrect master key");
        } finally {
            setIsDecryptingPassword(false);
        }
    };

    const addEditUrl = () => {
        setEditUrls((currentUrls) => [...currentUrls, ""]);
    };

    const removeEditUrl = (index: number) => {
        setEditUrls((currentUrls) =>currentUrls.filter((_, urlIndex) => urlIndex !== index));
    };

    const handleEditUrlChange = (index: number, value: string) => {
        setEditUrls((currentUrls) =>
            currentUrls.map((url, urlIndex) =>
                urlIndex === index ? value : url
            )
        );
    };

    const editItem = () => {
        if (decryptedPassword === null) {
            setEditFormError("Master key is required to decrypt the current password");
            return;
        }

        if (editMasterKey.trim() === "") {
            setEditFormError("Master key is required");
            return;
        }

        const editedItem: VaultItem = {
            name: editName,
            username: editUsername,
            password: editPassword,
            urls: editUrls,
            notes: editNotes,
            is_favourite: item.is_favourite,
            category: editCategory,
        };

        onEdit(item.id, editMasterKey, editedItem);
        cancelEditingItem();
    };

    return (
        <div className="item-edit-control-section">
            <button
                type="button"
                className="item-edit-control"
                onClick={() => {
                    if (editState === EditState.Closed) {
                        startEditingItem();
                    } else {
                        cancelEditingItem();
                    }
                }}
            >
                <div className="item-edit-control-content">
                    <span className="item-edit-control-title">
                        Edit password
                    </span>

                    <span className="item-edit-control-description">
                        Update the username, password, URLs, or
                        notes.
                    </span>
                </div>

                <span
                    className={`item-edit-control-arrow ${
                        editState !== EditState.Closed
                            ? "open"
                            : ""
                    }`}
                >
                    →
                </span>
            </button>

            {/* EDIT MASTER KEY */}

            {editState === EditState.MasterKey && (
                <div className="item-edit-control-panel">
                    <div className="item-edit-master-key-prompt-header">
                        <span>Enter Master Key</span>

                        <p>
                            Your master key is required to decrypt
                            the current password before editing.
                        </p>
                    </div>

                    <div className="item-edit-master-key-prompt-row">
                        <input
                            type="password"
                            placeholder="Master Key"
                            value={editMasterKeyPromptInput}
                            onChange={(e) => {
                                setEditMasterKeyPromptInput(
                                    e.target.value
                                );
                                setEditMasterKeyPromptInputError(
                                    null
                                );
                            }}
                            className="form-input"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    unlockEditForm();
                                }

                                if (e.key === "Escape") {
                                    cancelEditingItem();
                                }
                            }}
                        />

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={cancelEditingItem}
                            disabled={isDecryptingPassword}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn-primary"
                            onClick={unlockEditForm}
                            disabled={
                                isDecryptingPassword ||
                                editMasterKeyPromptInput.length === 0
                            }
                        >
                            {isDecryptingPassword
                                ? "Decrypting..."
                                : "Continue"}
                        </button>
                    </div>

                    {editMasterKeyPromptInputError && (
                        <span className="form-helper form-helper-error">
                            {editMasterKeyPromptInputError}
                        </span>
                    )}
                </div>
            )}

            {/* EDIT FORM */}

            {editState === EditState.Form && (
                <div className="item-edit-control-panel">
                    <div className="item-edit-form">
                        <div className="item-edit-form-header">
                            <div>
                                <h4>Edit password</h4>

                                <p>
                                    Update the information stored
                                    for this password.
                                </p>
                            </div>
                        </div>

                        <div className="item-edit-form-fields">
                            <div className="item-view-field">
                                <label htmlFor="edit-name">
                                    Name
                                </label>

                                <input
                                    id="edit-name"
                                    type="text"
                                    className="form-input"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                />
                            </div>

                            <div className="item-view-field">
                                <label htmlFor="edit-category">
                                    Category
                                </label>

                                <select
                                    id="edit-category"
                                    value={editCategory}
                                    onChange={(e) =>
                                        setEditCategory(
                                            e.target.value as VaultItemCategory
                                        )
                                    }
                                    className="category-select"
                                >
                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Login}
                                    >
                                        Login
                                    </option>

                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Finance}
                                    >
                                        Finance
                                    </option>

                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Social}
                                    >
                                        Social
                                    </option>

                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Work}
                                    >
                                        Work
                                    </option>

                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Shopping}
                                    >
                                        Shopping
                                    </option>

                                    <option
                                        className="category-select-option"
                                        value={VaultItemCategory.Other}
                                    >
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div className="item-view-field">
                                <label htmlFor="edit-username">
                                    Username
                                </label>

                                <input
                                    id="edit-username"
                                    type="text"
                                    className="form-input"
                                    value={editUsername}
                                    onChange={(e) =>
                                        setEditUsername(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="item-view-field">
                                <label htmlFor="edit-password">
                                    Password
                                </label>

                                <input
                                    id="edit-password"
                                    type="text"
                                    className="form-input"
                                    value={editPassword}
                                    onChange={(e) =>
                                        setEditPassword(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="item-view-field">
                                <label htmlFor="edit-master-key">
                                    Master Key
                                </label>

                                <input
                                    id="edit-master-key"
                                    type="password"
                                    className="form-input"
                                    value={editMasterKey}
                                    onChange={(e) =>
                                        setEditMasterKey(
                                            e.target.value
                                        )
                                    }
                                />

                                <span className="form-helper">
                                    Changing the master key will
                                    re-encrypt this password.
                                </span>
                            </div>

                            <div className="item-view-field">
                                <label>Website URLs</label>

                                <div className="item-view-url-list">
                                    {editUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="item-input-row"
                                        >
                                            <Globe
                                                size={15}
                                                className="url-icon"
                                            />

                                            <input
                                                type="url"
                                                className="form-input"
                                                value={url}
                                                onChange={(e) =>
                                                    handleEditUrlChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="https://example.com"
                                            />

                                            <button
                                                type="button"
                                                className="input-icon-btn"
                                                onClick={() =>
                                                    removeEditUrl(
                                                        index
                                                    )
                                                }
                                                aria-label={`Remove URL ${
                                                    index + 1
                                                }`}
                                                title="Remove URL"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="add-url-btn"
                                        onClick={addEditUrl}
                                    >
                                        <Plus size={15} />
                                        Add URL
                                    </button>
                                </div>
                            </div>

                            <div className="item-view-field">
                                <label htmlFor="edit-notes">
                                    Notes
                                </label>

                                <textarea
                                    id="edit-notes"
                                    className="form-input"
                                    value={editNotes}
                                    onChange={(e) =>
                                        setEditNotes(
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                />
                            </div>
                        </div>

                        {editFormError && (
                            <span className="form-helper form-helper-error">
                                {editFormError}
                            </span>
                        )}

                        <div className="item-edit-form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={cancelEditingItem}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={editItem}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export { ItemEditControlsView };