"use client";

import { ArrowLeft, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useQuizFormProvider } from "@/hooks/useForm";

export default function AddNewQuizQuestionsPage() {
  const { formData, prevStep, isSubmitting, publishQuiz } = useQuizFormProvider();

  console.log("FORMDATA:PAGE 2", formData);

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="w-full bg-white rounded-xl border border-shade-2 p-6 h-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-high font-medium text-lg">Questions</h3>

          <div className="flex gap-3">
            <Button
              variant={"_outline"}
              onClick={prevStep}
              className="text-orange bg-white rounded-xl py-2 px-4 h-10 hover:bg-offwhite"
            >
              <ArrowLeft className="w-5 h-5 text-inherit" />
              <span>Previous</span>
            </Button>

            <Button
              variant={"_default"}
              onClick={publishQuiz}
              className="text-white bg-success rounded-xl py-2 px-4 h-10 hover:bg-light-green"
              disabled={isSubmitting}
            >
              {false ? (
                <>Publishing...</>
              ) : (
                <>
                  <span>Publish</span>
                  <SendHorizonal className="w-5 h-5 text-inherit" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div>QUIZ</div>
      </div>
    </section>
  );
}
