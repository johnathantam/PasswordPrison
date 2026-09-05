interface VaultItem {
    name: string;
    username: string;
    password: string;
    master_key: string;
    urls: string[];
    notes: string;
}

export type { VaultItem }