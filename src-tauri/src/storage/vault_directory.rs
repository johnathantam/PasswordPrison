use std::fs;
use std::path::PathBuf;
use tauri::Manager;

pub fn initialize_vault_data_directory(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let data_directory = get_vault_data_directory(app)?;

    fs::create_dir_all(&data_directory)
        .map_err(|_| "Failed to create application data directory".to_string())?;

    println!("Vault directory created at: {:?}", data_directory);

    Ok(data_directory)
}

pub fn get_vault_data_directory(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map_err(|_| "Failed to get application data directory".to_string())
}