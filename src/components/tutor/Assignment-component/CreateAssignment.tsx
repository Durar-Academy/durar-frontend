import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, SaveIcon, EyeIcon, ForwardIcon } from "lucide-react";

interface createAssignmentProps {
  handleShow: () => void;
}
export default function CreateAssignment({
  handleShow,
}: createAssignmentProps) {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Box */}
        <div className="border border-shade-3 rounded-2xl flex flex-col items-center justify-center p-6 text-center w-[95%]">
          <UploadCloud className="text-orange w-16 h-16 p-5 rounded-full bg-orange/25 mb-4" />
          <p className="text-sm text-low">
            Drag and drop files here, or{" "}
            <span className="text-orange cursor-pointer">click to browse</span>
          </p>
        </div>

        {/* Form Inputs */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Select Course</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Quran Memorization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quran">Quran Memorization</SelectItem>
                  <SelectItem value="arabic">Arabic Studies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-1">Title</label>
              <Input
                className="focus:border-orange"
                placeholder="Jizu Nabayi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Select Tutor</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutor1">Tutor 1</SelectItem>
                  <SelectItem value="tutor2">Tutor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <Textarea placeholder="Jizu Nabayi" rows={4} />
          </div>
        </div>
      </div>

      {/* Assignment Settings */}
      <div className="border rounded-2xl p-6 space-y-4">
        <h2 className="font-medium text-[18px]">Assignment Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Due Date</label>
            <Input type="date" defaultValue="2025-12-01" />
          </div>
          <div>
            <label className="block text-sm mb-1">Maximum Score</label>
            <Input type="number" defaultValue="50" />
          </div>
          <div>
            <label className="block text-sm mb-1">Visibility</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Specific Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="group">Specific Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="late" className="text-sm text-low">
            Allow late submissions
          </label>
          <Checkbox id="late" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" className="text-orange text-sm">
          Cancel
        </Button>
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
      </div>
    </div>
  );
}
