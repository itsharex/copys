import { globalShortcut } from "@tauri-apps/api";
import { hide, show } from "@tauri-apps/api/app";
import {
  currentMonitor,
  appWindow,
  LogicalSize,
  LogicalPosition,
} from "@tauri-apps/api/window";

export const setWindowToBottom = async () => {
  const monitor = await currentMonitor();
  if (monitor) {
    const { size, scaleFactor } = monitor;
    await appWindow.setSize(new LogicalSize(size.width / scaleFactor, 400));
    await appWindow.setPosition(new LogicalPosition(0, 400));
  }
};

export async function registerShortcuts(shortcuts = "CommandOrControl + `") {
  let flag = true;
  // 注册显示/隐藏窗口的快捷键
  await globalShortcut.register(shortcuts, async () => {
    if (flag) {
      await appWindow.hide();
      await appWindow.minimize();
      flag = false;
      return;
    }
    await appWindow.show();
    await appWindow.unminimize();
    await appWindow.setFocus();
    flag = true;
  });
}
