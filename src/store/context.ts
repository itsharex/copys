import { createContext, useContext } from "react";
import { CopyTextDataType, CopyTextType } from "../utils/copy-text";

type ContextType = {
  currentTap: CopyTextType;
  copyTextArr: CopyTextDataType[];
};

export const CopyTextStore = createContext<ContextType>({
  copyTextArr: [],
  currentTap: CopyTextType.TEXT,
});

export const useCopyTextStore = () => {
  return useContext(CopyTextStore);
};
