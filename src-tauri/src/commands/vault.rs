use std::fs;
use tauri::AppHandle;
use uuid::Uuid;

use crate::{crypto::{encrypt::encrypt_data, key_derivation::derive_key, nonce::generate_nonce, salt::generate_salt}, models::{encrypted_vault::EncrypyedVault, encrypted_vault_item::EncrypyedVaultItem, vault_item::VaultItem}, storage::vault_file::get_vault_data_file_path};

// use crate::models::vault_item::VaultItem;
// use crate::storage::vault_directory::get_vault_data_directory;

#[tauri::command]
pub fn save_item_in_vault(app: AppHandle, item: VaultItem) -> Result<(), String> {
    // Grab the vault item directory
    let vault_data_file_path = get_vault_data_file_path(&app)?;


    // Read existing vault
    let data = fs::read(&vault_data_file_path)
        .map_err(|_| "Failed to read vault file".to_string())?;

    println!("Read vault data from file: {:?}", vault_data_file_path);

    // Deserialize existing vault
    let mut vault: EncrypyedVault = serde_json::from_slice(&data)
        .map_err(|_| "Failed to deserialize vault".to_string())?;

    // Encrypt the new item's password and store the item
    let salt = generate_salt();
    let key = derive_key(item.master_key.as_bytes(), &salt)?;
    let nonce_bytes = generate_nonce();
    let encrypted_password = encrypt_data(item.password.as_bytes(), &key, &nonce_bytes)?;
    let new_vault_item = EncrypyedVaultItem {
        name: item.name,
        username: item.username,
        password: encrypted_password,
        urls: item.urls,
        notes: item.notes,

        id: Uuid::new_v4().to_string(),

        salt: salt,
        nonce: nonce_bytes
    };

    vault.items.push(new_vault_item);

    // Serialize updated vault
    let data = serde_json::to_vec(&vault)
        .map_err(|_| "Failed to serialize vault".to_string())?;

    println!("Current vault:");
    println!("{:#?}", vault);

    // Save updated vault
    fs::write(&vault_data_file_path, data)
        .map_err(|_| "Failed to write vault file".to_string())?;

    Ok(())
}