use serde::{Deserialize, Serialize};

use crate::models::{encrypted_vault_item::EncryptedVaultItem};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncryptedVault {
    pub items: Vec<EncryptedVaultItem>,
    pub trashed_items: Vec<EncryptedVaultItem>,
}