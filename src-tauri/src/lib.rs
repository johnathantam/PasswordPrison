pub mod commands;
pub mod crypto;
pub mod models;
pub mod storage;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Add plugins for file system access
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())

        // Setup the application, creating the vault data directory if it doesn't exist
        .setup(|app| {
            // Grab the app handle
            let app_handle = app.handle();
            
            // Setup the file infrastructure of the program
            storage::vault_directory::initialize_vault_data_directory(app_handle)?;
            storage::vault_file::initialize_vault_data_file(app_handle)?;

            Ok(())
        })

        // Register commands
        .invoke_handler(tauri::generate_handler![
            commands::vault::get_vault_items,
            commands::vault::add_item_in_vault,
            commands::vault::trash_item_in_vault,
            commands::vault::remove_item_in_trash, 
            commands::vault::edit_item_in_vault,
            commands::vault::favourite_item_in_vault,

            commands::vault::decrypt_vault_item_password,
            commands::vault::verify_vault_item_master_key,
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
