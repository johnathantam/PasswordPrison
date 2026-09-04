use std::fs;
use std::path::{Path, PathBuf};

use crate::models::encrypted_vault::EncrypyedVault;
use crate::storage::vault_directory::get_vault_data_directory;

pub fn initialize_vault_data_file(app: &tauri::AppHandle) -> Result<(), String> {
    let vault_data_file_path = get_vault_data_file_path(app)?;

    if !vault_data_file_path.exists() {
        let initial_vault_data = EncrypyedVault {
            items: Vec::new(),
        };

        let initial_data = serde_json::to_vec(&initial_vault_data)
            .map_err(|_| "Failed to serialize initial vault".to_string())?;

        fs::write(&vault_data_file_path, initial_data)
            .map_err(|_| "Failed to create vault file".to_string())?;
    }

    Ok(())
}

pub fn get_vault_data_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let vault_data_directory = get_vault_data_directory(app)?;
    let vault_data_file_path = Path::new(&vault_data_directory).join("vault.dat");

    Ok(vault_data_file_path)
}

pub fn get_vault_data_file_items(app: &tauri::AppHandle) -> Result<EncrypyedVault, String> {
    let vault_data_file_path = get_vault_data_file_path(app)?;
    let vault_data = fs::read(&vault_data_file_path)
        .map_err(|_| "Failed to read vault file".to_string())?;
    let vault: EncrypyedVault = serde_json::from_slice(&vault_data)
        .map_err(|_| "Failed to deserialize vault".to_string())?;

    Ok(vault)
}

pub fn write_vault_data_file_items(app: &tauri::AppHandle, new_vault: EncrypyedVault) -> Result<(), String> {
    let vault_data_file_path = get_vault_data_file_path(app)?;
    let new_vault_data = serde_json::to_vec(&new_vault)
        .map_err(|_| "Failed to serialize vault".to_string())?;
    fs::write(&vault_data_file_path, new_vault_data)
        .map_err(|_| "Failed to write vault file".to_string())
}