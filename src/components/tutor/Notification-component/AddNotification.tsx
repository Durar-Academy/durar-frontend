import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddBtn from "../AddBtn";

interface AddNotificationProps {
  handleShow: () => void;
  show: boolean;
}
const AddNotification = ({ handleShow, show }: AddNotificationProps) => {
  return (
    <section
      className={`${
        show ? "scale-100" : "scale-0"
      } transition-all ease-in-out duration-300 fixed top-0 left-0 bg-black/70 h-screen w-screen flex justify-center items-center`}
    >
      <div className="p-5 rounded-xl border border-shade-2 bg-white w-2/3 flex flex-col gap-4">
        <header className="flex items-center justify-between text-xl font-semibold text-high">
          <h1>Add New Notification</h1>
          <Image
            onClick={handleShow}
            src={"/SVGs/cancel.svg"}
            height={24}
            width={24}
            alt="cancel Icon"
          />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-low">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <Input className="focus:border-orange" placeholder="Jizu Nabayi" />
          </div>
          <div>
            <label className="block text-sm mb-1">Recipient</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Quran Memorization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quran">Usman</SelectItem>
                <SelectItem value="arabic">Abdullahi</SelectItem>
                <SelectItem value="arabic">Babatunde</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="content text-sm text-low flex flex-col gap-2">
          <label htmlFor="">Content</label>
          <textarea
            className="h-40 w-full rounded-lg border border-shade-2 p-2 outline-orange"
            placeholder="type in your content..."
            name=""
            id=""
          ></textarea>
        </div>
        <button className="p-3 flex gap-3 items-center bg-[#F6F6F6] rounded-lg w-[272px]">
          <Image src="/SVGs/file.svg" height={24} width={24} alt="file icon" />
          Upload Attachment
          <span className="flex-1"></span>
          <Image
            src="/SVGs/upload.svg"
            height={24}
            width={24}
            alt="file icon"
          />
        </button>
        <div className="btns flex items-center gap-2 justify-end mt-2">
          <button
            onClick={handleShow}
            className="py-[7px] px-6 rounded-xl border-orange border-[1px]"
          >
            Cancel
          </button>
          <AddBtn showChevron={false} txt="Add Notification" />
        </div>
      </div>
    </section>
  );
};

export default AddNotification;
