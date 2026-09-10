use tauri::AppHandle;
use uuid::Uuid;

use crate::{crypto::{encrypt::encrypt_data, decrypt::decrypt_data, key_derivation::derive_key, nonce::generate_nonce, salt::generate_salt}, models::{encrypted_vault::EncryptedVault, encrypted_vault_item::EncryptedVaultItem, vault_item::VaultItem}, storage::vault_file::{get_vault_data_file_items, write_vault_data_file_items}};

// use crate::models::vault_item::VaultItem;
// use crate::storage::vault_directory::get_vault_data_directory;

#[tauri::command]
pub fn get_vault_items(app: AppHandle) -> Result<EncryptedVault, String> {
    let vault = get_vault_data_file_items(&app)?;
    Ok(vault)
}

#[tauri::command]
pub fn add_item_in_vault(app: AppHandle, master_key: String, item: VaultItem) -> Result<(), String> {
    // Read existing vault
    let mut vault = get_vault_data_file_items(&app)?;

    // Encrypt the new item's password and store the item
    let salt = generate_salt();
    let key = derive_key(master_key.as_bytes(), &salt)?;
    let nonce_bytes = generate_nonce();
    let encrypted_password = encrypt_data(item.password.as_bytes(), &key, &nonce_bytes)?;
    let new_vault_item = EncryptedVaultItem {
        name: item.name,
        username: item.username,
        password: encrypted_password,
        urls: item.urls,
        notes: item.notes,
        is_favourite: item.is_favourite,
        category: item.category,

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
pub fn trash_item_in_vault(app: AppHandle, item_id: String) -> Result<(), String> {
    // Grab vault
    let mut vault = get_vault_data_file_items(&app)?;
    // Remove selected item id
    for i in 0..vault.items.len() {
        let vault_item = &vault.items[i];
        if vault_item.id == item_id {
            let trashed_item = vault.items.remove(i);
            vault.trashed_items.push(trashed_item);
            break;
        }
    }

    // Update the vault
    _ = write_vault_data_file_items(&app, vault);

    Ok(())
}

#[tauri::command]
pub fn remove_item_in_trash(app: AppHandle, item_id: String) -> Result<(), String> {
    // Grab vault
    let mut vault = get_vault_data_file_items(&app)?;
    // Remove selected item id
    for i in 0..vault.trashed_items.len() {
        let trashed_item = &vault.trashed_items[i];
        if trashed_item.id == item_id {
            vault.trashed_items.remove(i);
            break;
        }
    }

    // Update the vault
    _ = write_vault_data_file_items(&app, vault);

    Ok(())
}

#[tauri::command]
pub fn edit_item_in_vault(app: AppHandle, item_id: String, master_key: String, edited_item: VaultItem) -> Result<(), String> {
    let mut vault = get_vault_data_file_items(&app)?;
    let item = vault
        .items
        .iter_mut()
        .chain(vault.trashed_items.iter_mut())
        .find(|item| item.id == item_id)
        .ok_or_else(|| "Vault item not found".to_string())?;

    // Generate new encryption parameters.
    let salt = generate_salt();
    let key = derive_key(master_key.as_bytes(), &salt)?;
    let nonce = generate_nonce();

    // Encrypt the edited password.
    let encrypted_password = encrypt_data(
        edited_item.password.as_bytes(),
        &key,
        &nonce,
    )?;

    // Edit item
    item.name = edited_item.name;
    item.category = edited_item.category;
    item.username = edited_item.username;
    item.password = encrypted_password;
    item.urls = edited_item.urls;
    item.notes = edited_item.notes;
    item.salt = salt;
    item.nonce = nonce;

    // Update the vault
    _ = write_vault_data_file_items(&app, vault);

    Ok(())
}

#[tauri::command]
pub fn favourite_item_in_vault(app: AppHandle, item_id: String, new_favourite_status: bool) -> Result<(), String> {
    let mut vault = get_vault_data_file_items(&app)?;
    let item = vault
        .items
        .iter_mut()
        .chain(vault.trashed_items.iter_mut())
        .find(|item| item.id == item_id)
        .ok_or_else(|| "Vault item not found".to_string())?;

    println!("Changing favourite status of item {} with id {} to {}", item.is_favourite, item_id, new_favourite_status);

    item.is_favourite = new_favourite_status;

    

    // Update the vault
    _ = write_vault_data_file_items(&app, vault);

    Ok(())
}

#[tauri::command]
pub fn decrypt_vault_item_password(app: AppHandle, item_id: String, master_key: String) -> Result<String, String> {
    let vault = get_vault_data_file_items(&app)?;
    let item = vault
        .items
        .iter()
        .chain(vault.trashed_items.iter())
        .find(|item| item.id == item_id)
        .ok_or_else(|| "Vault item not found".to_string())?;

    let key = derive_key(master_key.as_bytes(), &item.salt)?;
    
    let password = decrypt_data(
        &item.password,
        &key,
        &item.nonce,
    )?;

    String::from_utf8(password)
        .map_err(|_| "Decrypted password is not valid UTF-8".to_string())
}

#[tauri::command]
pub fn verify_vault_item_master_key(app: AppHandle, item_id: String, master_key: String) -> Result<(), String> {
    let vault = get_vault_data_file_items(&app)?;
    let item = vault
        .items
        .iter()
        .chain(vault.trashed_items.iter())
        .find(|item| item.id == item_id)
        .ok_or_else(|| "Vault item not found".to_string())?;

    let key = derive_key(master_key.as_bytes(), &item.salt)?;

    decrypt_data(&item.password, &key, &item.nonce)?;

    Ok(())
}