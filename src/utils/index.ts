import { globalShortcut } from "@tauri-apps/api";
import {
  currentMonitor,
  appWindow,
  LogicalSize,
  LogicalPosition,
} from "@tauri-apps/api/window";

export const CopyTextTypeToStr = ["Text", "Photos"];

// 复制队列，用于监听事件区分复制行为
export const copying: number[] = [];

export const setWindowToBottom = async () => {
  const monitor = await currentMonitor();
  if (monitor) {
    const { size, scaleFactor } = monitor;
    let MYWINDOWHEIGHT = 350;
    await appWindow.setSize(
      new LogicalSize(size.width / scaleFactor, MYWINDOWHEIGHT)
    );
    await appWindow.setPosition(
      new LogicalPosition(0, size.height / scaleFactor - MYWINDOWHEIGHT - 70)
    );
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
