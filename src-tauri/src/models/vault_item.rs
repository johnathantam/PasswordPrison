use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct VaultItem {
    pub name: String,
    pub username: String,
    pub password: String,
    pub master_key: String,
    pub urls: Vec<String>,
    pub notes: String,
}