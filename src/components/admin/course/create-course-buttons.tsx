"use client";

import { ArrowLeft, ArrowRight, Save, SendHorizonal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateCourseFormProvider } from "@/hooks/useForm";

export function CreateCourseButtons() {
  const {
    currentFormStep,
    totalFormSteps,
    cancelForm,
    nextStep,
    prevStep,
    saveAsDraft,
    publishCourse,
    isSubmitting,
    submissionMode,
  } = useCreateCourseFormProvider();

  return (
    <div className="buttons mt-6 flex justify-between">
      <>
        {currentFormStep === 1 ? (
          <Button
            variant={"_outline"}
            className="text-danger bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            onClick={cancelForm}
            type="button"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-inherit" />
            <span>Cancel</span>
          </Button>
        ) : (
          <Button
            variant={"_outline"}
            onClick={prevStep}
            className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            type="button"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-5 h-5 text-inherit" />
            <span>Previous</span>
          </Button>
        )}
      </>

      <div className="flex gap-2">
        <Button
          variant={"_outline"}
          onClick={saveAsDraft}
          className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
          type="button"
          disabled={isSubmitting}
        >
          <Save className="w-5 h-5 text-inherit" />
          <span>{submissionMode === "draft" ? "Saving..." : "Save Draft"}</span>
        </Button>

        <>
          {currentFormStep === totalFormSteps ? (
            <Button
              variant={"_default"}
              onClick={publishCourse}
              className="text-white bg-success rounded-xl py-2 px-4 h-10 hover:bg-light-green"
              type="button"
              disabled={isSubmitting}
            >
              {submissionMode === "published" ? (
                <>Publishing...</>
              ) : (
                <>
                  <span>Publish</span>
                  <SendHorizonal className="w-5 h-5 text-inherit" />
                </>
              )}
            </Button>
          ) : (
            <Button
              variant={"_default"}
              onClick={nextStep}
              className="text-white bg-orange rounded-xl py-2 px-4 h-10 hover:bg-burnt"
              type="button"
              disabled={isSubmitting}
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5 text-inherit" />
            </Button>
          )}
        </>
      </div>
    </div>
  );
}
