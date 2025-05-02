"use client";
import {
  X,
  ChevronRight,
  ArrowLeft,
  Plus,
  Upload,
  Check,
  Eye,
  Paperclip,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

// Define document types
type Document = {
  id: string;
  label: string;
  storageId?: string;
  fileUrl?: string;
  fileName?: string;
  file?: File;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
};

interface ProfessionalDetailsProps {
  handleNext: () => void;
  handlePrev: () => void;
  formData: any;
  updateFormData: (data: any) => void;
  handleCancel: () => void;
}

const ProfessionalDetails = ({
  handleNext,
  handlePrev,
  formData,
  updateFormData,
  handleCancel,
}: ProfessionalDetailsProps) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // Flag to prevent re-initialization

  // Memoize fetchExistingDocuments to ensure stability
  const fetchExistingDocuments = useCallback(async () => {
    if (!Array.isArray(formData.documents) || formData.documents.length === 0)
      return;

    try {
      const fetchPromises = formData.documents.map(
        async (storageId: string) => {
          try {
            const response = await axiosInstance.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/${storageId}`
            );

            if (response.data.success) {
              return {
                storageId,
                fileData: response.data.data,
              };
            }
            return null;
          } catch (error) {
            console.error(
              `Error fetching document with ID ${storageId}:`,
              error
            );
            return null;
          }
        }
      );

      const results = await Promise.all(fetchPromises);
      const validResults = results.filter((result) => result !== null);

      if (validResults.length > 0) {
        setDocuments((prevDocs) => {
          const newDocs = [...prevDocs];

          validResults.forEach((result, index) => {
            if (index < 5) {
              newDocs[index] = {
                ...newDocs[index],
                storageId: result?.storageId,
                fileUrl: result?.fileData?.src,
                fileName: result?.fileData?.fileName,
                uploaded: true,
                uploading: false,
              };
            }
          });

          if (validResults.length > 5) {
            for (let i = 5; i < validResults.length; i++) {
              const result = validResults[i];
              newDocs.push({
                id: `certification-${i - 5}`,
                label: "Additional Certification",
                storageId: result?.storageId,
                fileUrl: result?.fileData?.src,
                fileName: result?.fileData?.fileName,
                uploaded: true,
                uploading: false,
              });
            }
          }

          return newDocs;
        });
      }
    } catch (error) {
      console.error("Error fetching existing documents:", error);
    }
  }, [formData.documents]); // Depend on formData.documents

  // Initialize documents on component mount
  useEffect(() => {
    if (isInitialized || documents.length > 0) return; // Prevent re-initialization

    const initialDocs = [
      {
        id: "birth-certificate",
        label: "Birth Certificate",
        uploaded: false,
        uploading: false,
      },
      { id: "id-card", label: "ID Card", uploaded: false, uploading: false },
      {
        id: "cv",
        label: "CV",
        uploaded: false,
        uploading: false,
      },
      {
        id: "certificates",
        label: "Certificates",
        uploaded: false,
        uploading: false,
      },
      {
        id: "recommendation letter",
        label: "Recommendation Letter",
        uploaded: false,
        uploading: false,
      },
    ];

    setDocuments(initialDocs);
    setIsInitialized(true);

    // Fetch existing documents if formData.documents exists
    if (formData.documents?.length > 0) {
      fetchExistingDocuments();
    }
  }, [
    formData.documents,
    fetchExistingDocuments,
    isInitialized,
    documents.length,
  ]);

  // Save documents to formData whenever they change
  useEffect(() => {
    const documentstorageIds = documents
      .filter((doc) => doc.uploaded && doc.storageId)
      .map((doc) => doc.storageId as string);

    // Only update if documentstorageIds has changed
    if (
      JSON.stringify(documentstorageIds) !== JSON.stringify(formData.documents)
    ) {
      updateFormData({ documents: documentstorageIds });
    }
  }, [documents, updateFormData, formData.documents]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, file, uploading: true, error: undefined }
          : doc
      )
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/upload`,
        formData
      );

      if (response.data.success) {
        const storageId = response.data.data.storageId;
        const fileUrl = response.data.data.url;

        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  storageId,
                  fileUrl,
                  fileName: file.name,
                  uploaded: true,
                  uploading: false,
                }
              : doc
          )
        );

        toast.success(`${file.name} uploaded successfully`);
      } else {
        throw new Error(response.data.message || "Failed to upload file");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                uploading: false,
                error: error.message || "Failed to upload file",
              }
            : doc
        )
      );
      toast.error(error.message || "Failed to upload file");
    }
  };

  const viewFile = (fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const addCertification = () => {
    const newId = `certification-${documents.length}`;
    setDocuments((prev) => [
      ...prev,
      {
        id: newId,
        label: "Additional Certification",
        uploaded: false,
        uploading: false,
      },
    ]);
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              storageId: undefined,
              fileUrl: undefined,
              fileName: undefined,
              file: undefined,
              uploaded: false,
            }
          : doc
      )
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.specializationAndSkill)
      newErrors.specializationAndSkill =
        "Specialization and skills are required";
    if (!formData.language) newErrors.language = "Language is required";

    const uploadedDocs = documents.filter((doc) => doc.uploaded);
    if (uploadedDocs.length < 5) {
      newErrors.documents = "At least 5 documents are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedToNext = () => {
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <section className="rounded-xl p-4 bg-white border border-shade-2">
      <div className="text-sm text-low grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="specializationAndSkill">
            Specializations & Skills
          </label>
          <input
            placeholder="Specializations and skills..."
            className={`pl-2 h-12 rounded-lg ${
              errors.specializationAndSkill
                ? "border-red-500"
                : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="specializationAndSkill"
            id="specializationAndSkill"
            value={formData.specializationAndSkill}
            onChange={handleChange}
          />
          {errors.specializationAndSkill && (
            <span className="text-xs text-red-500">
              {errors.specializationAndSkill}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="language">Language(s)</label>
          <input
            placeholder="Enter languages..."
            className={`pl-2 h-12 rounded-lg ${
              errors.language ? "border-red-500" : "border-shade-3"
            } border outline-orange`}
            type="text"
            name="language"
            id="language"
            value={formData.language}
            onChange={handleChange}
          />
          {errors.language && (
            <span className="text-xs text-red-500">{errors.language}</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Required Documents</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-shade-3 rounded-lg p-3 bg-[#F6F6F6]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Paperclip className="text-gray-500 shrink-0 w-4 h-4" />
                  <span className="font-medium">{doc.label}</span>
                </div>

                {doc.uploaded && doc.id.includes("certification") && (
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-danger hover:bg-red-50 p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {doc.uploading && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">
                    Uploading {doc.file?.name}...
                  </span>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-orange w-1/2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {doc.uploaded ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center truncate max-w-[70%]">
                    <Check size={16} className="mr-1 text-success" />
                    <span className="text-sm truncate">
                      {doc.fileName || "File uploaded"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {doc.fileUrl && (
                      <button
                        onClick={() => viewFile(doc.fileUrl)}
                        className="text-blue-500 p-1 bg-white rounded-lg hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <label
                      htmlFor={doc.id}
                      className="cursor-pointer text-orange bg-white p-1 rounded-lg hover:bg-orange-50"
                    >
                      <Upload size={16} />
                    </label>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-danger p-1 bg-white rounded-lg hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {doc.error || "No file selected"}
                  </span>
                  <label
                    htmlFor={doc.id}
                    className="cursor-pointer text-blue-500 text-sm bg-white px-3 py-1 rounded-lg hover:bg-blue-50"
                  >
                    Upload
                  </label>
                </div>
              )}

              <input
                type="file"
                id={doc.id}
                className="hidden"
                onChange={(e) => handleFileChange(e, doc.id)}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>
          ))}
        </div>

        {errors.documents && (
          <span className="text-xs text-red-500 block mt-2">
            {errors.documents}
          </span>
        )}

        <button
          type="button"
          onClick={addCertification}
          className="mt-4 flex items-center gap-1 text-orange border border-orange rounded-lg px-3 py-2 text-sm"
        >
          <Plus size={16} />
          Add More Certification
        </button>
      </div>

      <div className="flex items-center gap-2 mt-8">
        <button
          onClick={handleCancel}
          className="text-danger text-sm flex items-center border border-shade-3 rounded-xl p-3.5 py-2"
        >
          <X size={16} className="mr-1" />
          Cancel
        </button>
        <span className="flex-1"></span>
        <button
          onClick={handlePrev}
          className="border border-orange text-orange text-sm flex items-center gap-1 rounded-xl p-3.5 py-2"
        >
          <ArrowLeft size={16} className="mr-1" />
          Previous
        </button>
        <button
          onClick={proceedToNext}
          className="text-white bg-orange text-sm flex items-center rounded-xl p-3.5 py-2"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </section>
  );
};

export default ProfessionalDetails;
