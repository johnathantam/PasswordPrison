use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncrypyedVaultItem {
    pub name: String,
    pub username: String,
    pub password: Vec<u8>,
    pub urls: Vec<String>,
    pub notes: String,

    pub id: String,

    pub salt: [u8; 16],
    pub nonce: [u8; 12],
}