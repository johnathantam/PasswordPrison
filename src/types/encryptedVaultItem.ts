interface EncryptedVaultItem {
    id: string;
    name: string;
    username: string;
    password: number[];
    salt: number[];
    nonce: number[];
    urls: string[];
    notes: string;
}

export type { EncryptedVaultItem }