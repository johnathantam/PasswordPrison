use std::fs;
use std::path::{Path, PathBuf};

use crate::models::encrypted_vault::EncrypyedVault;
use crate::storage::vault_directory::get_vault_data_directory;

pub fn initialize_vault_data_file(app: &tauri::AppHandle) -> Result<(), String> {
    let vault_data_file_path = get_vault_data_file_path(app)?;

    if !vault_data_file_path.exists() {
        let vault = EncrypyedVault {
            items: Vec::new(),
        };

        let data = serde_json::to_vec(&vault)
            .map_err(|_| "Failed to serialize initial vault".to_string())?;

        fs::write(&vault_data_file_path, data)
            .map_err(|_| "Failed to create vault file".to_string())?;
    }

    Ok(())
}

pub fn get_vault_data_file_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let vault_data_directory = get_vault_data_directory(app)?;
    let vault_data_file_path = Path::new(&vault_data_directory).join("vault.dat");

    Ok(vault_data_file_path)
}

pub fn read_vault(path: &Path) -> Result<Vec<u8>, String> {
    fs::read(path)
        .map_err(|_| "Failed to read vault file".to_string())
}

pub fn write_vault(path: &Path, data: &[u8]) -> Result<(), String> {
    fs::write(path, data)
        .map_err(|_| "Failed to write vault file".to_string())
}