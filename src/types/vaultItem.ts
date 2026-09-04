interface VaultItem {
    name: string;
    username: string;
    password: string;
    masterKey: string;
    urls: string[];
    notes: string;
}

export type { VaultItem }