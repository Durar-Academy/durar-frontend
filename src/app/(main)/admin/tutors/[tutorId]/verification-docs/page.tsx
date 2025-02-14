"use client";

import { FileList } from "@/components/admin/file-list";

import { tutorDocuments } from "@/data/mockData";

export default function TutorManagementDocumentPage() {
  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-low font-medium text-base leading-5">Uploaded Documents</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tutorDocuments.map((tutorDocument, index) => (
          <div className="">
            <FileList key={index} filename={tutorDocument.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
