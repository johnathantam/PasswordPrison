use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncryptedVaultItem {
    pub name: String,
    pub username: String,
    pub password: Vec<u8>,
    pub urls: Vec<String>,
    pub notes: String,
    pub is_favourite: bool,
    pub category: String,

    pub id: String,

    pub salt: [u8; 16],
    pub nonce: [u8; 12],
}