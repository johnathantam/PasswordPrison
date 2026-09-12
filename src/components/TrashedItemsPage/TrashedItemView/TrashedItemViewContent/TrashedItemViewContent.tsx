import { Copy, EyeOff, Eye, Globe } from "lucide-react";
import { EncryptedVaultItem } from "../../../../types/encryptedVaultItem";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./TrashedItemViewContent.css";

interface TrashedItemViewContentProps {
    item: EncryptedVaultItem;
}

function TrashedItemViewContent({ item }: TrashedItemViewContentProps) {
    const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
    const [decryptionMasterKeyInput, setDecryptionMasterKeyInput] = useState("");
    const [isRequestingMasterKey, setIsRequestingMasterKey] = useState(false);
    const [masterKeyDecryptionError, setMasterKeyDecryptionError] = useState<string | null>(null);
    const [isVerifyingMasterKey, setIsVerifyingMasterKey] = useState(false);

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value);
    };

    const startItemPasswordReveal = () => {
        setIsRequestingMasterKey(true);
        setDecryptionMasterKeyInput("");
        setMasterKeyDecryptionError(null);
    };

    const cancelItemPasswordReveal = () => {
        setIsRequestingMasterKey(false);
        setDecryptionMasterKeyInput("");
        setMasterKeyDecryptionError(null);
    };

    const hideItemPassword = () => {
        setDecryptedPassword(null);
    };

    const decryptItemPassword = async () => {
        if (item === null) {
            return;
        }

        setIsVerifyingMasterKey(true);
        setMasterKeyDecryptionError(null);

        try {
            const password = await invoke<string>(
                "decrypt_vault_item_password",
                {
                    itemId: item.id,
                    masterKey: decryptionMasterKeyInput,
                }
            );

            setDecryptedPassword(password);
            setIsRequestingMasterKey(false);
            setDecryptionMasterKeyInput("");
        } catch (err) {
            console.error("DECRYPT FAILED:", err);
            setMasterKeyDecryptionError("Incorrect master key");
        } finally {
            setIsVerifyingMasterKey(false);
        }
    };

    useEffect(() => {
        setDecryptedPassword(null);
        setIsRequestingMasterKey(false);
        setDecryptionMasterKeyInput("");
        setMasterKeyDecryptionError(null);
    }, [item?.id]);

    return (
        <div className="trashed-item-view-content">

            <div className="trashed-item-view-field">
                <label>Category</label>

                <div className="trashed-item-view-value">
                    {item.category}
                </div>
            </div>

            <div className="trashed-item-view-field">
                <label>Username</label>

                <div className="trashed-item-view-input-row">
                    <div
                        className="trashed-item-view-value trashed-item-view-value-ellipsis"
                        title={item.username}
                    >
                        {item.username}
                    </div>

                    <button
                        type="button"
                        className="trashed-item-view-input-icon-btn"
                        onClick={() => copyToClipboard(item.username)}
                        title="Copy username"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            </div>

            <div className="trashed-item-view-field">
                <label>Password</label>

                <div className="trashed-item-view-input-row">
                    <div
                        className="trashed-item-view-value trashed-item-view-value-ellipsis"
                        title={decryptedPassword ?? "Password"}
                    >
                        {decryptedPassword ?? "••••••••••••••••"}
                    </div>

                    <button
                        type="button"
                        className="trashed-item-view-input-icon-btn"
                        onClick={
                            decryptedPassword !== null
                                ? hideItemPassword
                                : startItemPasswordReveal
                        }
                        title={
                            decryptedPassword !== null
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {decryptedPassword !== null ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>

                    <button
                        type="button"
                        className="trashed-item-view-input-icon-btn"
                        onClick={() => {
                            if (decryptedPassword !== null) {
                                copyToClipboard(decryptedPassword);
                            }
                        }}
                        title="Copy password"
                        disabled={decryptedPassword === null}
                    >
                        <Copy size={16} />
                    </button>
                </div>

                {isRequestingMasterKey && (
                    <div className="trashed-master-key-prompt">
                        <div className="trashed-master-key-prompt-header">
                            <span>Enter Master Key</span>
                        </div>

                        <div className="trashed-master-key-prompt-row">
                            <input
                                type="password"
                                placeholder="Master Key"
                                value={decryptionMasterKeyInput}
                                onChange={(e) =>
                                    setDecryptionMasterKeyInput(e.target.value)
                                }
                                className="trashed-form-input"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        decryptItemPassword();
                                    }

                                    if (e.key === "Escape") {
                                        cancelItemPasswordReveal();
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="trashed-btn-secondary"
                                onClick={cancelItemPasswordReveal}
                                disabled={isVerifyingMasterKey}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="trashed-btn-primary"
                                onClick={decryptItemPassword}
                                disabled={
                                    isVerifyingMasterKey ||
                                    decryptionMasterKeyInput.length === 0
                                }
                            >
                                {isVerifyingMasterKey
                                    ? "Verifying..."
                                    : "Unlock"}
                            </button>
                        </div>

                        {masterKeyDecryptionError && (
                            <span className="trashed-form-helper trashed-form-helper-error">
                                {masterKeyDecryptionError}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="trashed-item-view-field">
                <label>Website URLs</label>

                <div className="trashed-item-view-url-list">
                    {item.urls.map((url, index) => (
                        <div
                            key={index}
                            className="trashed-item-view-input-row"
                        >
                            <Globe
                                size={15}
                                className="trashed-item-view-url-icon"
                            />

                            <div
                                className="trashed-item-view-value trashed-item-view-value-ellipsis"
                                title={url}
                            >
                                {url}
                            </div>

                            <button
                                type="button"
                                className="trashed-item-view-input-icon-btn"
                                onClick={() => copyToClipboard(url)}
                                title="Copy URL"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {item.notes && (
                <div className="trashed-item-view-field">
                    <label>Notes</label>

                    <div
                        className="trashed-item-view-notes"
                        title={item.notes}
                    >
                        {item.notes}
                    </div>
                </div>
            )}
        </div>
    );
}

export { TrashedItemViewContent };