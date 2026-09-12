import { VaultItemCategory } from "../enums/vaultItemCategory";

interface EncryptedVaultItem {
    id: string;
    name: string;
    username: string;
    password: number[];
    urls: string[];
    notes: string;

    is_favourite: boolean;
    category: VaultItemCategory;

    salt: number[];
    nonce: number[];
}

export type { EncryptedVaultItem }