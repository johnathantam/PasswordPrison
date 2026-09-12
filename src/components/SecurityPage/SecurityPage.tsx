import {
    ShieldCheck,
    LockKeyhole,
    KeyRound,
    HardDrive,
    CheckCircle2,
    Info
} from "lucide-react";
import "./SecurityPage.css";

function SecurityPage() {
    return (
        <div className="security-page">

            {/* Header */}
            <div className="security-header">
                <div>
                    <h1 className="security-title">Security</h1>
                    <p className="security-subtitle">
                        Learn how PasswordPrison protects your passwords.
                    </p>
                </div>
            </div>

            <div className="security-content">

                {/* Overview */}
                <section className="security-overview-card">
                    <div className="security-overview-icon">
                        <ShieldCheck size={28} />
                    </div>

                    <div className="security-overview-content">
                        <h2>Your passwords are protected</h2>
                        <p>
                            PasswordPrison encrypts your vault items before they
                            are stored locally on your device. Protected
                            passwords require the appropriate master key to
                            decrypt.
                        </p>
                    </div>
                </section>

                {/* Protection */}
                <section className="security-section">
                    <h2 className="security-section-title">
                        Vault Protection
                    </h2>

                    <div className="security-cards">

                        <div className="security-card">
                            <div className="security-card-icon">
                                <LockKeyhole size={19} />
                            </div>

                            <div className="security-card-content">
                                <h3>Encryption</h3>
                                <p>
                                    Passwords are encrypted using AES-256-GCM
                                    before being stored in your vault.
                                </p>

                                <div className="security-status">
                                    <CheckCircle2 size={14} />
                                    <span>AES-256-GCM</span>
                                </div>
                            </div>
                        </div>

                        <div className="security-card">
                            <div className="security-card-icon">
                                <KeyRound size={19} />
                            </div>

                            <div className="security-card-content">
                                <h3>Key Derivation</h3>
                                <p>
                                    Argon2id is used to derive encryption keys
                                    from your master key.
                                </p>

                                <div className="security-status">
                                    <CheckCircle2 size={14} />
                                    <span>Argon2id</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Item Protection */}
                <section className="security-section">
                    <h2 className="security-section-title">
                        Item Protection
                    </h2>

                    <div className="security-information-card">

                        <div className="security-information-icon">
                            <LockKeyhole size={20} />
                        </div>

                        <div>
                            <h3>Independently encrypted items</h3>
                            <p>
                                Each vault item contains its own encryption
                                parameters. Passwords are encrypted before
                                being written to your local vault file.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Local Storage */}
                <section className="security-section">
                    <h2 className="security-section-title">
                        Local Storage
                    </h2>

                    <div className="security-information-card">

                        <div className="security-information-icon">
                            <HardDrive size={20} />
                        </div>

                        <div className="security-information-content">
                            <h3>Your vault stays on this device</h3>
                            <p>
                                PasswordPrison stores your encrypted vault
                                locally. Your vault does not need to be
                                uploaded to a remote server.
                            </p>

                            <div className="security-storage-status">
                                <span className="security-status-dot"></span>
                                <span>Local storage</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Master Key */}
                <section className="security-section">
                    <h2 className="security-section-title">
                        Master Key
                    </h2>

                    <div className="security-master-key-card">

                        <div className="security-master-key-header">
                            <KeyRound size={19} />

                            <div>
                                <h3>Keep your master key secure</h3>
                                <p>
                                    Your master key is used to derive the key
                                    required to decrypt protected passwords.
                                </p>
                            </div>
                        </div>

                        <div className="security-warning">
                            <Info size={16} />

                            <span>
                                Never share your master key with anyone.
                            </span>
                        </div>

                    </div>
                </section>

                {/* Recommendations */}
                <section className="security-section">
                    <h2 className="security-section-title">
                        Security Recommendations
                    </h2>

                    <div className="security-recommendations">

                        <div className="security-recommendation">
                            <CheckCircle2 size={17} />
                            <span>Use a strong master key.</span>
                        </div>

                        <div className="security-recommendation">
                            <CheckCircle2 size={17} />
                            <span>Keep your device secure.</span>
                        </div>

                        <div className="security-recommendation">
                            <CheckCircle2 size={17} />
                            <span>Never share your master key.</span>
                        </div>

                        <div className="security-recommendation">
                            <CheckCircle2 size={17} />
                            <span>Keep PasswordPrison updated.</span>
                        </div>

                    </div>
                </section>

            </div>

            {/* Footer */}
            <div className="security-footer">
                <span>PasswordPrison v0.1.0</span>
            </div>

        </div>
    );
}

export { SecurityPage };