import { globalShortcut } from "@tauri-apps/api";
import { readText } from "@tauri-apps/api/clipboard";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";

export const useWindowShowOrHide = () => {
  console.log("11111111111111111");
  async function registerShortcuts() {
    // 注册显示窗口的快捷键，例如Ctrl+Shift+P
    await globalShortcut.register("CommandOrControl+Shift+P", async () => {
      console.log("show:", Date.now());
      await appWindow.unminimize();
      await appWindow.setFocus();
    });

    // 注册隐藏窗口的快捷键，例如Ctrl+Shift+H
    await globalShortcut.register("CommandOrControl+Shift+H", async () => {
      console.log("hide:", Date.now());
      await appWindow.minimize();
    });

    // await globalShortcut.register("CommandOrControl+C", async () => {
    //   console.log("cccccccc:", await readText());
    // });
  }

  useEffect(() => {
    registerShortcuts();
    return () => {
      console.log("object");
      globalShortcut.unregister("CommandOrControl+Shift+P");
      globalShortcut.unregister("CommandOrControl+Shift+H");
    };
  }, []);
};
