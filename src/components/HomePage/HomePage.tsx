import { Key, Star, Trash2, Plus, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { EncryptedVault } from "../../types/encryptedVault";
import { EncryptedVaultItem } from "../../types/encryptedVaultItem";
import "./HomePage.css";

function HomePage() {
    const navigate = useNavigate();

    const [itemsCount, setItemsCount] = useState<number>(0);
    const [favouriteItemsCount, setFavouriteItemCount] = useState<number>(0);
    const [trashedItemsCount, setTrashedItemsCount] = useState<number>(0);

    useEffect(() => {
        // Fetch items and filter for favourites
        invoke<EncryptedVault>("get_vault_items")
            .then((encryptedVault) => {
                const vaultItems: EncryptedVaultItem[] = encryptedVault.items;
                const vaultTrashedItems: EncryptedVaultItem[] = encryptedVault.trashed_items;

                // calculate number of items
                setItemsCount(vaultItems.length);

                // calculate number of trashed items
                setTrashedItemsCount(vaultTrashedItems.length);

                // calculate number of favourites
                setFavouriteItemCount([...vaultItems, ...vaultTrashedItems]
                    .filter(
                        (item: EncryptedVaultItem) => item.is_favourite
                    ).length
                )
            })
            .catch((error) => {
                console.error("GET VAULT ITEMS FAILED:", error);
            });
    }, [])

    return (
        <div className="home-page">
            <div className="home-header">
                <div>
                    <h1 className="home-title">Welcome to PasswordPrison</h1>
                    <p className="home-subtitle">
                        Your passwords, securely stored in your local vault.
                    </p>
                </div>
            </div>

            <div className="home-content">

                {/* Welcome / Security Card */}
                <section className="home-welcome-card">
                    <div className="home-welcome-icon">
                        <ShieldCheck size={28} />
                    </div>

                    <div className="home-welcome-content">
                        <h2>Your vault is protected</h2>
                        <p>
                            PasswordPrison keeps your passwords inside an encrypted
                            local vault. Your master key is required whenever a
                            protected password needs to be revealed or modified.
                        </p>
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="home-section">
                    <h2 className="home-section-title">Your Vault</h2>

                    <div className="home-stats">
                        <div className="home-stat-card">
                            <div className="home-stat-icon">
                                <Key size={19} />
                            </div>

                            <div>
                                <span className="home-stat-value">{itemsCount}</span>
                                <span className="home-stat-label">
                                    Items
                                </span>
                            </div>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-icon">
                                <Star size={19} />
                            </div>

                            <div>
                                <span className="home-stat-value">{favouriteItemsCount}</span>
                                <span className="home-stat-label">
                                    Favourites
                                </span>
                            </div>
                        </div>

                        <div className="home-stat-card">
                            <div className="home-stat-icon">
                                <Trash2 size={19} />
                            </div>

                            <div>
                                <span className="home-stat-value">{trashedItemsCount}</span>
                                <span className="home-stat-label">
                                    In Trash
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="home-section">
                    <h2 className="home-section-title">
                        How PasswordPrison Works
                    </h2>

                    <div className="home-how-it-works">

                        <div className="home-step">
                            <div className="home-step-number">1</div>

                            <div className="home-step-content">
                                <h3>Add your passwords</h3>
                                <p>
                                    Create vault items containing usernames,
                                    passwords, websites and notes.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <div className="home-step-number">2</div>

                            <div className="home-step-content">
                                <h3>Protect your vault</h3>
                                <p>
                                    Your vault is encrypted and protected by
                                    your master key.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <div className="home-step-number">3</div>

                            <div className="home-step-content">
                                <h3>Access your passwords</h3>
                                <p>
                                    Your master key is required to reveal or
                                    edit protected passwords.
                                </p>
                            </div>
                        </div>

                        <div className="home-step">
                            <div className="home-step-number">4</div>

                            <div className="home-step-content">
                                <h3>Manage your vault</h3>
                                <p>
                                    Favourite important items, edit existing
                                    entries, or move unwanted items to trash.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Quick Actions */}
                <section className="home-section">
                    <h2 className="home-section-title">Quick Actions</h2>

                    <div className="home-actions">

                        <button
                            className="home-action"
                            onClick={() => navigate("/allItems")}
                        >
                            <Plus size={18} />

                            <div>
                                <span className="home-action-title">
                                    New Password
                                </span>

                                <span className="home-action-description">
                                    Add a new vault item
                                </span>
                            </div>
                        </button>

                        <button
                            className="home-action"
                            onClick={() => navigate("/favouriteItems")}
                        >
                            <Star size={18} />

                            <div>
                                <span className="home-action-title">
                                    Favourites
                                </span>

                                <span className="home-action-description">
                                    View your favourite items
                                </span>
                            </div>
                        </button>

                        <button
                            className="home-action"
                            onClick={() => navigate("/trashedItems")}
                        >
                            <Trash2 size={18} />

                            <div>
                                <span className="home-action-title">
                                    Trash
                                </span>

                                <span className="home-action-description">
                                    Manage deleted items
                                </span>
                            </div>
                        </button>

                    </div>
                </section>

            </div>

            <div className="home-footer">
                <span>PasswordPrison v0.1.0</span>
            </div>
        </div>
    );
}

export { HomePage };