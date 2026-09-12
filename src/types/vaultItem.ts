import { VaultItemCategory } from "../enums/vaultItemCategory";

interface VaultItem {
    name: string;
    username: string;
    password: string;
    urls: string[];
    notes: string;

    is_favourite: boolean;
    category: VaultItemCategory;
}

export type { VaultItem };