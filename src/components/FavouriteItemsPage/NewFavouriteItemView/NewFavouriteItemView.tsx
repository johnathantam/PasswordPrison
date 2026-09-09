import { useState } from "react";
import { Eye, EyeOff, RefreshCw, Copy, Globe, Plus, X } from "lucide-react";
import { VaultItemCategory } from "../../../enums/vaultItemCategory";
import type { VaultItem } from "../../../types/vaultItem";
import "./NewFavouriteItemView.css";

interface NewFavouriteItemViewProps {
    onCancel: () => void;
    onConfirm: (masterKey: string, newVaultItem: VaultItem) => void;
}

function NewFavouriteItemView({ onCancel, onConfirm }: NewFavouriteItemViewProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<VaultItemCategory>(VaultItemCategory.Login);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [masterKey, setMasterKey] = useState("");
    const [showMasterKey, setShowMasterKey] = useState(false);
    const [urls, setUrls] = useState([""]);
    const [notes, setNotes] = useState("");

    function generatePassword() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let result = "";
        for (let i = 0; i < 20; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }

        setPassword(result);
        setShowPassword(true);
    }

    function updateUrl(index: number, value: string) {
        const next = [...urls];
        next[index] = value;
        setUrls(next);
    }

    function addUrlField() {
        setUrls([...urls, ""]);
    }

    function removeUrlField(index: number) {
        setUrls(urls.filter((_, i) => i !== index));
    }

    function handleSave() {
        const newVaultItem: VaultItem = {
            name: name,
            username: username,
            password: password,
            urls: urls,
            notes: notes,
            is_favourite: true,
            category: category,
        }

        onConfirm?.(masterKey, newVaultItem);
    }

    return (
        <div className="new-favourite-item-view">
            <div className="new-favourite-item-header">
                <h2 className="new-favourite-item-header-title">
                    New Favourite Login
                </h2>
            </div>

            <div className="new-favourite-item-form">
                <div className="new-favourite-form-field">
                    <label>Item name</label>
                    <input
                        type="text"
                        placeholder="e.g. Netflix"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="new-favourite-form-input new-favourite-form-input-title"
                    />
                </div>

                <div className="new-favourite-form-field">
                    <label htmlFor="item-category">Category</label>
                    <select
                        id="item-category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value as VaultItemCategory)
                        }
                        className="new-favourite-category-select"
                    >
                        {Object.values(VaultItemCategory).map((category) => (
                            <option
                                key={category}
                                value={category}
                                className="new-favourite-category-select-option"
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="new-favourite-form-field">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="username or email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="new-favourite-form-input"
                    />
                </div>

                <div className="new-favourite-form-field">
                    <label>Password</label>

                    <div className="new-favourite-input-row">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="new-favourite-form-input"
                        />

                        <button
                            type="button"
                            className="new-favourite-input-icon-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Hide" : "Show"}
                        >
                            {showPassword
                                ? <EyeOff size={16} />
                                : <Eye size={16} />
                            }
                        </button>

                        <button
                            type="button"
                            className="new-favourite-input-icon-btn"
                            onClick={generatePassword}
                            title="Generate password"
                        >
                            <RefreshCw size={16} />
                        </button>

                        <button
                            type="button"
                            className="new-favourite-input-icon-btn"
                            onClick={() => navigator.clipboard.writeText(password)}
                            title="Copy"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                <div className="new-favourite-form-field">
                    <label>Master Key</label>

                    <div className="new-favourite-input-row">
                        <input
                            type={showMasterKey ? "text" : "password"}
                            placeholder="Master Key"
                            value={masterKey}
                            onChange={(e) => setMasterKey(e.target.value)}
                            className="new-favourite-form-input"
                        />

                        <button
                            type="button"
                            className="new-favourite-input-icon-btn"
                            onClick={() => setShowMasterKey(!showMasterKey)}
                            title={showMasterKey ? "Hide" : "Show"}
                        >
                            {showMasterKey
                                ? <EyeOff size={16} />
                                : <Eye size={16} />
                            }
                        </button>

                        <button
                            type="button"
                            className="new-favourite-input-icon-btn"
                            onClick={() => navigator.clipboard.writeText(masterKey)}
                            title="Copy"
                        >
                            <Copy size={16} />
                        </button>
                    </div>

                    <span className="new-favourite-form-helper">
                        Used to encrypt and protect this item's password.
                    </span>
                </div>

                <div className="new-favourite-form-field">
                    <label>Website URLs</label>

                    {urls.map((url, index) => (
                        <div
                            className="new-favourite-url-input-row"
                            key={index}
                        >
                            <Globe
                                size={15}
                                className="new-favourite-url-icon"
                            />

                            <input
                                type="text"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => updateUrl(index, e.target.value)}
                                className="new-favourite-form-input"
                            />

                            {urls.length > 1 && (
                                <button
                                    type="button"
                                    className="new-favourite-input-icon-btn"
                                    onClick={() => removeUrlField(index)}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="new-favourite-add-url-btn"
                        onClick={addUrlField}
                    >
                        <Plus size={14} />
                        <span>Add URL</span>
                    </button>
                </div>

                <div className="new-favourite-form-field">
                    <label>Notes</label>

                    <textarea
                        placeholder="Add notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="new-favourite-form-textarea"
                        rows={5}
                    />
                </div>
            </div>

            <div className="new-favourite-item-footer">
                <button
                    className="new-favourite-btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className="new-favourite-btn-primary"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </div>
    )
}
export { NewFavouriteItemView }