import { useCopyTextStore } from "../../store/context";
import CardItem from "../card-item";

function CardList() {
  const { copyTextArr, currentTap } = useCopyTextStore();
  const arr = copyTextArr.filter(({ type }) => {
    return currentTap === type;
  });
  console.log("arr", { arr, currentTap });
  return (
    <>
      {arr.map((obj) => {
        return <CardItem key={obj.id} {...obj} />;
      })}
    </>
  );
}

export default CardList;
