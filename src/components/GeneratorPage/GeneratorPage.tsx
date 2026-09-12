import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
    Copy,
    Dices,
    Hash,
    KeyRound,
    User,
    Check,
} from "lucide-react";
import "./GeneratorPage.css";

function GeneratorPage() {
    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [passwordLength, setPasswordLength] = useState(24);
    const [allowPasswordUppercase, setAllowPasswordUppercase] = useState(true);
    const [allowPasswordLowercase, setAllowPasswordLowercase] = useState(true);
    const [allowPasswordNumbers, setAllowPasswordNumbers] = useState(true);
    const [allowPasswordSymbols, setAllowPasswordSymbols] = useState(true);
    
    const [pin, setPin] = useState("");
    const [pinLength, setPinLength] = useState(6);

    const [generatingPassword, setGeneratingPassword] = useState(false);
    const [generatingUsername, setGeneratingUsername] = useState(false);
    const [generatingPin, setGeneratingPin] = useState(false);

    const [copied, setCopied] = useState<string | null>(null);

    const generatePassword = async () => {
        if (!allowPasswordUppercase && !allowPasswordLowercase && !allowPasswordNumbers && !allowPasswordSymbols) {
            return;
        }

        setGeneratingPassword(true);

        try {
            const generatedPassword = await invoke<string>(
                "generate_password",
                {
                    length: passwordLength,
                    uppercase: allowPasswordUppercase,
                    lowercase: allowPasswordLowercase,
                    numbers: allowPasswordNumbers,
                    symbols: allowPasswordSymbols,
                }
            );

            setPassword(generatedPassword);
        } catch (error) {
            console.error("PASSWORD GENERATION FAILED:", error);
        } finally {
            setGeneratingPassword(false);
        }
    };

    const generateUsername = async () => {
        setGeneratingUsername(true);

        try {
            const generatedUsername = await invoke<string>(
                "generate_username"
            );

            setUsername(generatedUsername);
        } catch (error) {
            console.error("USERNAME GENERATION FAILED:", error);
        } finally {
            setGeneratingUsername(false);
        }
    };

    const generatePin = async () => {
        setGeneratingPin(true);

        try {
            const generatedPin = await invoke<string>(
                "generate_pin",
                {
                    length: pinLength,
                }
            );

            setPin(generatedPin);
        } catch (error) {
            console.error("PIN GENERATION FAILED:", error);
        } finally {
            setGeneratingPin(false);
        }
    };

    const copyValue = async (value: string, type: string) => {
        if (!value) {
            return;
        }

        await navigator.clipboard.writeText(value);

        setCopied(type);

        setTimeout(() => {
            setCopied(null);
        }, 1500);
    };

    return (
        <div className="generator-page">
            <div className="generator-header">
                <div>
                    <h1 className="generator-title">
                        Credential Generator
                    </h1>

                    <p className="generator-subtitle">
                        Generate secure credentials for your accounts and
                        applications.
                    </p>
                </div>
            </div>

            <div className="generator-content">

                {/* Password Generator */}
                <section className="generator-section">
                    <div className="generator-section-header">
                        <div className="generator-section-icon">
                            <KeyRound size={20} />
                        </div>

                        <div>
                            <h2>Password Generator</h2>
                            <p>
                                Create a strong random password using a
                                combination of letters, numbers, and symbols.
                            </p>
                        </div>
                    </div>

                    <div className="generator-output">
                        <span className="generator-value">
                            {password || "Generate a password"}
                        </span>

                        <button
                            className="generator-copy-button"
                            onClick={() =>
                                copyValue(password, "password")
                            }
                            disabled={!password}
                        >
                            {copied === "password" ? (
                                <Check size={16} />
                            ) : (
                                <Copy size={16} />
                            )}

                            {copied === "password" ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div className="generator-controls">

                        <div className="generator-control">
                            <div className="generator-control-header">
                                <label htmlFor="password-length">
                                    Password Length
                                </label>

                                <span>{passwordLength}</span>
                            </div>

                            <input
                                id="password-length"
                                className="generator-slider"
                                type="range"
                                min="8"
                                max="64"
                                value={passwordLength}
                                onChange={(event) =>
                                    setPasswordLength(
                                        Number(event.target.value)
                                    )
                                }
                            />
                        </div>

                        <div className="generator-checkboxes">

                            <label>
                                <input
                                    type="checkbox"
                                    checked={allowPasswordUppercase}
                                    onChange={(event) =>
                                        setAllowPasswordUppercase(event.target.checked)
                                    }
                                />
                                Uppercase
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={allowPasswordLowercase}
                                    onChange={(event) =>
                                        setAllowPasswordLowercase(event.target.checked)
                                    }
                                />
                                Lowercase
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={allowPasswordNumbers}
                                    onChange={(event) =>
                                        setAllowPasswordNumbers(event.target.checked)
                                    }
                                />
                                Numbers
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={allowPasswordSymbols}
                                    onChange={(event) =>
                                        setAllowPasswordSymbols(event.target.checked)
                                    }
                                />
                                Symbols
                            </label>

                        </div>
                    </div>

                    <div className="generator-actions">
                        <button
                            className="generator-primary-button"
                            onClick={generatePassword}
                            disabled={
                                generatingPassword ||
                                (!allowPasswordUppercase &&
                                    !allowPasswordLowercase &&
                                    !allowPasswordNumbers &&
                                    !allowPasswordSymbols)
                            }
                        >
                            <Dices size={17} />
                            {generatingPassword
                                ? "Generating..."
                                : "Generate Password"}
                        </button>
                    </div>
                </section>

                {/* Username Generator */}
                <section className="generator-section">
                    <div className="generator-section-header">
                        <div className="generator-section-icon">
                            <User size={20} />
                        </div>

                        <div>
                            <h2>Username Generator</h2>
                            <p>
                                Create a memorable random username using
                                words and numbers.
                            </p>
                        </div>
                    </div>

                    <div className="generator-output">
                        <span className="generator-value">
                            {username || "Generate a username"}
                        </span>

                        <button
                            className="generator-copy-button"
                            onClick={() =>
                                copyValue(username, "username")
                            }
                            disabled={!username}
                        >
                            {copied === "username" ? (
                                <Check size={16} />
                            ) : (
                                <Copy size={16} />
                            )}

                            {copied === "username" ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div className="generator-actions">
                        <button
                            className="generator-primary-button"
                            onClick={generateUsername}
                            disabled={generatingUsername}
                        >
                            <Dices size={17} />
                            {generatingUsername
                                ? "Generating..."
                                : "Generate Username"}
                        </button>
                    </div>
                </section>

                {/* PIN Generator */}
                <section className="generator-section">
                    <div className="generator-section-header">
                        <div className="generator-section-icon">
                            <Hash size={20} />
                        </div>

                        <div>
                            <h2>PIN Generator</h2>
                            <p>
                                Generate a random numeric PIN for accounts,
                                devices, and other applications.
                            </p>
                        </div>
                    </div>

                    <div className="generator-output">
                        <span className="generator-value generator-pin-value">
                            {pin || "Generate a PIN"}
                        </span>

                        <button
                            className="generator-copy-button"
                            onClick={() => copyValue(pin, "pin")}
                            disabled={!pin}
                        >
                            {copied === "pin" ? (
                                <Check size={16} />
                            ) : (
                                <Copy size={16} />
                            )}

                            {copied === "pin" ? "Copied" : "Copy"}
                        </button>
                    </div>

                    <div className="generator-controls">
                        <div className="generator-control">
                            <div className="generator-control-header">
                                <label htmlFor="pin-length">
                                    PIN Length
                                </label>

                                <span>{pinLength}</span>
                            </div>

                            <input
                                id="pin-length"
                                className="generator-slider"
                                type="range"
                                min="4"
                                max="12"
                                value={pinLength}
                                onChange={(event) =>
                                    setPinLength(
                                        Number(event.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="generator-actions">
                        <button
                            className="generator-primary-button"
                            onClick={generatePin}
                            disabled={generatingPin}
                        >
                            <Dices size={17} />
                            {generatingPin
                                ? "Generating..."
                                : "Generate PIN"}
                        </button>
                    </div>
                </section>

            </div>

            <div className="generator-footer">
                <span>PasswordPrison v0.1.0</span>
            </div>
        </div>
    );
}

export { GeneratorPage };