import { useEffect, useState } from "react";
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  onTextUpdate,
  onImageUpdate,
  startListening,
  onSomethingUpdate,
} from "tauri-plugin-clipboard-api";
import {
  copying,
  CopyTextTypeToStr,
  registerShortcuts,
  setWindowToBottom,
} from "./utils";
import { globalShortcut } from "@tauri-apps/api";
import { ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { CopyTextDataType, CopyTextType } from "./utils/copy-text";
import { CopyTextStore } from "./store/context";
import CardList from "./components/card-list";

function App() {
  const [selected, setSelected] = useState(CopyTextType.TEXT);
  const [copyTextArr, setCopyTextArr] = useState<CopyTextDataType[]>([]);

  // const delItem = () => {};
  const addItem = (type: CopyTextType, data: string) => {
    if (!data) {
      return;
    }
    setCopyTextArr((old) => [
      ...old,
      {
        id: Date.now(),
        groupType: CopyTextTypeToStr[type],
        type,
        data,
      },
    ]);
  };
  console.log("copyTextArr", copyTextArr);
  let unlistenTextUpdate: UnlistenFn;
  let unlistenImageUpdate: UnlistenFn;
  let unlistenClipboard: () => Promise<void>;
  let unlistenSomethingUpdate: UnlistenFn;

  useEffect(() => {
    const unlistenFunctions = async () => {
      unlistenTextUpdate = await onTextUpdate((newText) => {
        console.log(newText);
        if (copying.length > 0) return;
        addItem(CopyTextType.TEXT, newText);
      });
      unlistenImageUpdate = await onImageUpdate((_) => {
        console.log("Image updated", _);
        if (copying.length > 0) return;
        addItem(CopyTextType.IMAGE, _);
      });
      unlistenSomethingUpdate = await onSomethingUpdate((updatedTypes) => {
        console.log("updated types:", updatedTypes);
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
      if (unlistenSomethingUpdate) {
        unlistenSomethingUpdate();
      }
      globalShortcut.unregister("CommandOrControl + `");
    };
  }, []);

  return (
    <CopyTextStore.Provider value={{ copyTextArr, currentTap: selected }}>
      <div className="container">
        {/* {lll.map((item, i) => {
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
        </button> */}

        {/* <div>
          <h1>Try and copy this sentence</h1>
          <h1>{copiedText}</h1>
        </div> */}

        <div className="flex">
          <Tabs
            variant="light"
            aria-label="Tabs variants"
            selectedKey={selected}
            onSelectionChange={(v) => {
              console.log("v", v);
              setSelected(v as CopyTextType);
            }}
          >
            {CopyTextTypeToStr.map((str, idx) => (
              <Tab key={idx} title={str} />
            ))}
          </Tabs>
        </div>

        <ScrollShadow
          hideScrollBar
          draggable
          orientation="horizontal"
          className="flex gap-6 w-screen my-5 px-10 overflow-auto"
        >
          <CardList />
        </ScrollShadow>
      </div>
    </CopyTextStore.Provider>
  );
}

export default App;
