import { useEffect, useState } from "react";
import { UnlistenFn } from "@tauri-apps/api/event";
import {
  onTextUpdate,
  onImageUpdate,
  startListening,
  onSomethingUpdate,
} from "tauri-plugin-clipboard-api";
import {
  checkVersionUpdate,
  copying,
  CopyTextTypeToStr,
  handleBlur,
  registerShortcuts,
  setWindowToBottom,
} from "./utils";
import { globalShortcut } from "@tauri-apps/api";
import {
  Button,
  Kbd,
  ScrollShadow,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
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
    setCopyTextArr((old) => {
      let tmp = [
        {
          id: Date.now(),
          groupType: CopyTextTypeToStr[type],
          type,
          data,
        },
        ...old,
      ];
      let strSet = new Set();
      let newArr: CopyTextDataType[] = [];
      tmp.forEach((obj) => {
        if (strSet.has(obj.data)) {
          return;
        }
        strSet.add(obj.data);
        newArr.push(obj);
      });
      return newArr;
    });
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
      .then(() => checkVersionUpdate())
      .catch(console.error);
    window.addEventListener("blur", handleBlur);
    return () => {
      unlistenTextUpdate && unlistenTextUpdate();
      unlistenImageUpdate && unlistenImageUpdate();
      unlistenClipboard && unlistenClipboard();
      unlistenSomethingUpdate && unlistenSomethingUpdate();
      globalShortcut.unregister("CommandOrControl + `");
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <CopyTextStore.Provider value={{ copyTextArr, currentTap: selected }}>
      <div className="container">
        <div className="w-full flex items-center justify-evenly">
          <div className="flex gap-3">
            <Tooltip className="text-blue-500" content="显示/隐藏">
              <Kbd keys={["command"]}>+ `</Kbd>
            </Tooltip>
            <Tooltip className="text-blue-500" content="移动横向滚动条">
              <Kbd keys="shift">+ 鼠标滑轮</Kbd>
            </Tooltip>
          </div>
          <Tabs
            variant="light"
            aria-label="Tabs variants"
            selectedKey={selected}
            onSelectionChange={(v) => setSelected(v as CopyTextType)}
          >
            {CopyTextTypeToStr.map((str, idx) => (
              <Tab key={idx} title={str} />
            ))}
          </Tabs>
          <Button className="mx-4" size="sm" onClick={() => setCopyTextArr([])}>
            Clear
          </Button>
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
