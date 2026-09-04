use tauri::AppHandle;
use uuid::Uuid;

use crate::{crypto::{encrypt::encrypt_data, key_derivation::derive_key, nonce::generate_nonce, salt::generate_salt}, models::{encrypted_vault::EncrypyedVault, encrypted_vault_item::EncryptedVaultItem, vault_item::VaultItem}, storage::vault_file::{get_vault_data_file_items, write_vault_data_file_items}};

// use crate::models::vault_item::VaultItem;
// use crate::storage::vault_directory::get_vault_data_directory;

#[tauri::command]
pub fn get_vault_items(app: AppHandle) -> Result<EncrypyedVault, String> {
    let vault = get_vault_data_file_items(&app)?;
    Ok(vault)
}

#[tauri::command]
pub fn add_item_in_vault(app: AppHandle, item: VaultItem) -> Result<(), String> {
    // Read existing vault
    let mut vault = get_vault_data_file_items(&app)?;

    // Encrypt the new item's password and store the item
    let salt = generate_salt();
    let key = derive_key(item.master_key.as_bytes(), &salt)?;
    let nonce_bytes = generate_nonce();
    let encrypted_password = encrypt_data(item.password.as_bytes(), &key, &nonce_bytes)?;
    let new_vault_item = EncryptedVaultItem {
        name: item.name,
        username: item.username,
        password: encrypted_password,
        urls: item.urls,
        notes: item.notes,

        id: Uuid::new_v4().to_string(),

        salt: salt,
        nonce: nonce_bytes
    };

    // Add new vault item to be saved
    vault.items.push(new_vault_item);
    // Save updated vault
    _ = write_vault_data_file_items(&app, vault)?;

    Ok(())
}

#[tauri::command]
pub fn remove_item_in_vault(app: AppHandle, item_id: String) -> Result<(), String> {
    // Grab vault
    let mut vault = get_vault_data_file_items(&app)?;
    // Remove selected item id
    for i in 0..vault.items.len() {
        let vault_item = &vault.items[i];
        if vault_item.id == item_id {
            vault.items.remove(i);
            break;
        }
    }

    // Update the vault
    _ = write_vault_data_file_items(&app, vault);

    Ok(())
}