// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::{LogicalPosition, LogicalSize, Manager, Position, Size};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![greet])
        // .setup(|app| {
        //     let win = app.get_window("main").unwrap();
        //     const HEIGHT: f64 = 350.0;
        //     // 设置大小和位置
        //     let monitor = win
        //         .current_monitor()
        //         .expect("failed to get monitor info")
        //         .expect("failed to get monitor info");
        //     let screen_size = monitor.size().to_logical::<f64>(monitor.scale_factor());
        //     win.set_size(Size::Logical(LogicalSize::new(
        //         screen_size.width as f64,
        //         HEIGHT,
        //     )))?;
        //     win.set_position(Position::Logical(LogicalPosition::new(
        //         0.0,
        //         screen_size.height as f64 - HEIGHT,
        //     )))?;
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
