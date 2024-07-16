import {
  Card,
  CardBody,
  CardFooter,
  Kbd,
  Button,
  Image,
} from "@nextui-org/react";
import { memo, useMemo, useState } from "react";
import { CheckIcon, CopyIcon } from "../icon";
import { CopyTextType } from "../../utils/copy-text";
import { writeImageBase64, writeText } from "tauri-plugin-clipboard-api";
import { copying } from "../../utils";

const copyAction = async (type: CopyTextType, data: string) => {
  switch (type) {
    case CopyTextType.TEXT:
      await writeText(data);
      break;
    case CopyTextType.IMAGE:
      await writeImageBase64(data);
      break;
    default:
      return null;
  }
};
function CardItem({ type, data }: any) {
  const [flag, setFlag] = useState(false);
  const CardBodyJSX = useMemo(() => {
    switch (type) {
      case CopyTextType.TEXT:
        return (
          <CardBody>
            <div className="h-[100px]">{data}</div>
          </CardBody>
        );
      case CopyTextType.IMAGE:
        return (
          <CardBody className="overflow-visible p-0 h-auto">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt="{item.title}"
              className="w-full object-cover h-[125px]"
              src={`data:image/png;base64, ${data}`}
            />
          </CardBody>
        );
      default:
        return null;
    }
  }, [type, data]);

  const handleItemClick = async () => {
    if (flag) {
      return;
    }
    setFlag(true);
    copying.push(1);
    await copyAction(type, data);
    setTimeout(() => {
      setFlag(false);
      copying.pop();
    }, 1500);
  };
  return (
    <Card
      className="w-40 flex-none"
      shadow="sm"
      isPressable
      onPress={handleItemClick}
    >
      {CardBodyJSX}
      <CardFooter className="justify-between h-8">
        <Kbd keys={["command"]}>1</Kbd>
        <Button isIconOnly variant="light" onClick={handleItemClick}>
          {flag ? (
            <CheckIcon
              className="w-7 h-7"
              style={{ animation: ".3s ease-out bouncein" }}
            />
          ) : (
            <CopyIcon
              className="w-6 h-6"
              style={{ animation: ".3s ease-out bouncein" }}
            />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default memo(CardItem);
