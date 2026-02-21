#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use log::info;

fn main() {
    env_logger::init();
    info!("Starting Provider Node...");

    tauri::Builder::default()
        .setup(|_app| {
            info!("Provider Node initialized");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
