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

interface AssignmentProps {
  handleShow: () => void;
}
const AssignmentDetails = ({ handleShow }: AssignmentProps) => {
  return (
    <div className="rounded-xl p-6 w-full border border-shade-3 bg-white h-max flex flex-col gap-4">
      <header className="flex gap-3 items-center">
        <h1 className="text-[18px] font-medium text-high">
          Assignment Details
        </h1>
        <span className="flex-1"></span>
        <div className="space-x-3">
          <Button
            onClick={handleShow}
            variant="outline"
            className="text-orange text-sm"
          >
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
      <section className="flex flex-col gap-3">
        <div>
          <label className="block text-sm text-low mb-1">
            Assignment Title
          </label>
          <Input type="number" placeholder="Input title" />
        </div>
        <aside className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-low mb-1">Category</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="group">Idaadiyah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-low mb-1">Subject</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Nahwu</SelectItem>
                <SelectItem value="group">Sorf</SelectItem>
                <SelectItem value="group">Manteeq</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-low mb-1">Date</label>
            <Input type="date" defaultValue="50" />
          </div>
          <div>
            <label className="block text-sm text-low mb-1">
              {"Time Limit (Minutes)"}
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">15 minutes</SelectItem>
                <SelectItem value="group">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>
        <div>
          <label className="block text-sm text-low mb-1">Instructions</label>
          <textarea
            name=""
            id=""
            className="border-[#D2D4E0] border-[1px] rounded-lg h-20 w-full p-1 pl-2 text-sm text-low outline-orange"
            placeholder="Instructions"
          ></textarea>
        </div>
      </section>
    </div>
  );
};

export default AssignmentDetails;
