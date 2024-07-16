import { Tabs, Tab, Chip, Card, CardBody } from "@nextui-org/react";
import { useCopyTextStore } from "../../store/context";
import { CopyTextTypeToStr } from "../../utils";

export default function NavTabs() {
  const { currentTap } = useCopyTextStore();
  return (
    <div className="flex">
      {/* <Tabs variant="light" aria-label="Tabs variants">
        {[...{ currentTap }.keys()].map((_type) => (
          <Tab key={_type} title={CopyTextTypeToStr[_type]} />
        ))}
      </Tabs> */}
    </div>
  );
}
