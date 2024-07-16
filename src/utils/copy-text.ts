export enum CopyTextType {
  TEXT = "0",
  IMAGE = "1",
}

export type CopyTextDataType = {
  id: number;
  type: CopyTextType;
  groupType?: string;
  data: string;
};
