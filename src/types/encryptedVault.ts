import { EncryptedVaultItem } from "./encryptedVaultItem";

interface EncryptedVault {
    items: EncryptedVaultItem[];
    trashed_items: EncryptedVaultItem[];
}

export type { EncryptedVault };