import { app, globalShortcut } from "@tauri-apps/api";
import { confirm, message } from "@tauri-apps/api/dialog";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
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

let flag = true;
let isChecking = true;

export async function registerShortcuts(shortcuts = "CommandOrControl + `") {
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

export const handleBlur = async () => {
  if (isChecking) return;
  if (flag) {
    await appWindow.hide();
    await appWindow.minimize();
    flag = false;
    return;
  }
};

export const checkVersionUpdate = async () => {
  try {
    isChecking = true;
    const { shouldUpdate, manifest } = await checkUpdate();
    console.warn("manifest", manifest);
    const [appName, appVersion] = await Promise.all([
      app.getName(),
      app.getVersion(),
    ]);
    if (shouldUpdate) {
      const res = await confirm(
        `${appName} ${manifest?.version} is now available -- you have ${appVersion}.\n\nWould you like to install it now?\n\nRelease Notes:\n${manifest?.body}`,
        { title: "A new version of tauri is available!" }
      );
      if (!res) return;
      // Install the update. This will also restart the app on Windows!
      await installUpdate();
      // On macOS and Linux you will need to restart the app manually.
      // You could use this step to display another confirmation dialog.
      await relaunch();
    }
  } catch (error) {
    console.error(error);
    await message("update error" + JSON.stringify(error), "Result");
  } finally {
    isChecking = false;
  }
};
