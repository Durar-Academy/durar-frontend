import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, EyeIcon, ForwardIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const QuestionDetails = () => {
  return (
    <div className="w-full flex flex-col gap-3">
      <header className="flex gap-3 items-center bg-white rounded-xl border border-shade-2 p-6">
        <h1 className="text-[18px] font-medium text-high">
          Assignment Details
        </h1>
        <span className="flex-1"></span>
        <div className="space-x-3">
          <Button variant="outline" className="text-orange text-sm">
            <EyeIcon />
            Preview
          </Button>
          <Button variant="outline" className="text-orange text-sm">
            <SaveIcon />
            Save Draft
          </Button>
          <Button className="bg-orange hover:bg-orange-600 text-sm">
            <ForwardIcon />
            Publish
          </Button>
        </div>
      </header>

      <div className="flex gap-4 flex-col bg-white rounded-xl border border-shade-2 p-6">
        <h1>Question 1</h1>
        <input
          className="h-12 rounded-xl outline-orange border border-shade-3 pl-2"
          type="text"
          placeholder="Enter your questions here"
        />
        <div className="flex items-center gap-4">
          <input className="" type="radio" />
          <input
            type="text"
            placeholder="Option 1"
            className="text-low outline-none pb-0.5 border-b-[1px] border-b-[#E6E9F5] bg-transparent w-full"
          />
          <span className="flex-1"></span>
          <Image
            src={"/SVGs/cancel.svg"}
            alt="cancel icon"
            height={20}
            width={20}
          />
        </div>
        <div className="flex items-center gap-4">
          <input className="" type="radio" />
          <input
            type="text"
            placeholder="Option 2"
            className="text-low outline-none pb-0.5 border-b-[1px] border-b-[#E6E9F5] bg-transparent w-full"
          />
          <span className="flex-1"></span>
          <Image
            src={"/SVGs/cancel.svg"}
            alt="cancel icon"
            height={20}
            width={20}
          />
        </div>
        <button className="text-sm text-orange p-2 w-full text-start">
          + Add Option
        </button>
      </div>

      <button className="flex gap-2 text-sm text-high items-center p-4 rounded-xl bg-white justify-center">
        <span className="text-orange font-medium">+</span>
        Add New Question
      </button>
    </div>
  );
};

export default QuestionDetails;
