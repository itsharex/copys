import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { readText, writeText } from "@tauri-apps/api/clipboard";
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  onTextUpdate,
  onImageUpdate,
  onFilesUpdate,
  startListening,
  onClipboardUpdate,
} from "tauri-plugin-clipboard-api";
import { registerShortcuts, setWindowToBottom } from "./utils";
import { globalShortcut } from "@tauri-apps/api";

function App() {
  const [lll, setlll] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState("Copied text will be here");

  let unlistenTextUpdate: UnlistenFn;
  let unlistenImageUpdate: UnlistenFn;
  let unlistenClipboard: () => Promise<void>;
  let unlistenFiles: UnlistenFn;

  useEffect(() => {
    const unlistenFunctions = async () => {
      unlistenTextUpdate = await onTextUpdate((newText) => {
        console.log(newText);
        setCopiedText(newText);
      });
      unlistenImageUpdate = await onImageUpdate((_) => {
        console.log("Image updated", _);
      });
      unlistenFiles = await onFilesUpdate((_) => {
        console.log("Files updated", _);
      });
      unlistenClipboard = await startListening();
    };

    unlistenFunctions()
      .then(() => setWindowToBottom())
      .then(() => registerShortcuts())
      .catch(console.error);

    return () => {
      if (unlistenTextUpdate) {
        unlistenTextUpdate();
      }
      if (unlistenImageUpdate) {
        unlistenImageUpdate();
      }
      if (unlistenClipboard) {
        unlistenClipboard();
      }
      if (unlistenFiles) {
        unlistenFiles();
      }
      globalShortcut.unregister("CommandOrControl + `");
    };
  }, []);

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      {lll.map((item, i) => {
        return <div key={i}>{item}</div>;
      })}
      <hr />
      <button
        type="button"
        onClick={async () => {
          const clipboardText = await readText();
          clipboardText && setlll([...lll, clipboardText]);
        }}
      >
        readText
      </button>
      <button
        type="button"
        onClick={async () => {
          await writeText("Tauri is awesome!");
        }}
      >
        writeText
      </button>

      <div>
        <h1>Try and copy this sentence</h1>
        <h1>{copiedText}</h1>
      </div>
    </div>
  );
}

export default App;
