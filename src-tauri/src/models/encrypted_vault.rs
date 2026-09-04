use serde::{Deserialize, Serialize};

use crate::models::{encrypted_vault_item::EncryptedVaultItem};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncrypyedVault {
    pub items: Vec<EncryptedVaultItem>,
}