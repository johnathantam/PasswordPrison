use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct VaultItem {
    pub name: String,
    pub username: String,
    pub password: String,
    pub urls: Vec<String>,
    pub notes: String,

    pub is_favourite: bool,
    pub category: String,
}