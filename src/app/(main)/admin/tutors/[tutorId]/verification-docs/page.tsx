"use client";


export default function TutorManagementDocumentPage() {
  return (
    <div className="p-6 rounded-xl bg-white border border-shade-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-low font-medium text-base leading-5">Uploaded Documents</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <p className="col-span-2 rounded-lg border border-dashed border-shade-3 p-6 text-sm text-low">
          No verification documents have been uploaded for this tutor.
        </p>
      </div>
    </div>
  );
}
