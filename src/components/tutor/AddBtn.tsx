import Image from "next/image";

interface AddBtnProps {
  txt: string;
  showChevron: boolean;
}
const AddBtn = ({ txt, showChevron }: AddBtnProps) => {
  return (
    <button className="px-4 py-2 flex justify-center items-center bg-orange rounded-xl text-white gap-2">
      <Image src={"/SVGs/addIcon.svg"} alt="add icon" height={24} width={24} />
      <span>{txt}</span>
      <Image
        className={`${showChevron ? "" : "hidden"}`}
        src={"/SVGs/chevron.svg"}
        alt="add icon"
        height={24}
        width={24}
      />
    </button>
  );
};

export default AddBtn;
