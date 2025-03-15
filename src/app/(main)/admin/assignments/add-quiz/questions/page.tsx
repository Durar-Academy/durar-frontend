"use client";

import { ArrowLeft, Plus, SendHorizonal, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useQuizFormProvider } from "@/hooks/useForm";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddNewQuizQuestionsPage() {
  const { formData, prevStep, isSubmitting, publishQuiz, updateFormData } = useQuizFormProvider();

  const addQuestion = () => {
    const maxId = formData.questions.reduce(
      (max, question) => (question.id > max ? question.id : max),
      0,
    );
    const newId = maxId + 1;

    updateFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: newId,
          questionText: "",
          options: [{ id: 1, optionText: "" }],
          correctAnswerId: null,
        },
      ],
    });
  };

  const removeQuestion = (id: number) => {
    const filteredQuestions = formData.questions.filter((question) => question.id !== id);
    updateFormData({ ...formData, questions: filteredQuestions });
  };

  const addOption = (questionId: number) => {
    const updatedQuestions = formData.questions.map((question) => {
      if (question.id === questionId) {
        // Find max option ID for this question
        const maxOptionId = question.options.reduce(
          (max, option) => (option.id > max ? option.id : max),
          0,
        );
        const newOptionId = maxOptionId + 1;

        return {
          ...question,
          options: [...question.options, { id: newOptionId, optionText: "" }],
        };
      }
      return question;
    });

    updateFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (questionId: number, optionId: number) => {
    const updatedQuestions = formData.questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.filter((option) => option.id !== optionId),
        };
      }
      return question;
    });

    updateFormData({ ...formData, questions: updatedQuestions });
  };

  const handleQuestionTextChange = (questionId: number, value: string) => {
    const updatedQuestions = formData.questions.map((question) =>
      question.id === questionId ? { ...question, questionText: value } : question,
    );

    updateFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionTextChange = (questionId: number, optionId: number, value: string) => {
    const updatedQuestions = formData.questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId ? { ...option, optionText: value } : option,
          ),
        };
      }
      return question;
    });

    updateFormData({ ...formData, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (questionId: number, optionId: number) => {
    const updatedQuestions = formData.questions.map((question) => {
      if (question.id === questionId) {
        const newAnswerId = question.correctAnswerId === optionId ? null : optionId;

        return {
          ...question,
          correctAnswerId: newAnswerId,
        };
      }
      return question;
    });

    updateFormData({ ...formData, questions: updatedQuestions });
  };

  console.log("FORMDATA:PAGE 2", formData);

  return (
    <section className="flex flex-col gap-5 w-full">
      <div className="w-full bg-white rounded-xl border border-shade-2 p-6 h-full flex flex-col gap-4">
        <div className="flex justify-between items-center gap-3">
          <div>
            <h3 className="text-high font-medium text-lg">Questions</h3>
            <p className="text-sm text-low mt-1">
              Select the option that correctly answers the question.
            </p>
          </div>

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

        <div className="flex flex-col gap-4">
          {formData.questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-xl border border-shade-3 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Question {index + 1}</h3>

                <button
                  className="text-xs  text-danger underline"
                  onClick={() => removeQuestion(question.id)}
                  disabled={formData.questions.length <= 1}
                >
                  Remove Question
                </button>
              </div>

              <Input
                value={question.questionText}
                onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                placeholder="Enter your question"
                type="text"
                className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
              />

              <RadioGroup
                value={
                  question.correctAnswerId === null ? undefined : String(question.correctAnswerId)
                }
                onValueChange={(value) => handleCorrectAnswerChange(question.id, Number(value))}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={String(option.id)}
                        className="h-6 w-6 shadow-none border border-shade-3 focus:outline-0 focus-visible:ring-0 focus:border-2"
                      >
                        <div className="h-4 w-4 bg-orange rounded-full"></div>
                      </RadioGroupItem>

                      <Input
                        value={option.optionText}
                        onChange={(e) =>
                          handleOptionTextChange(question.id, option.id, e.target.value)
                        }
                        placeholder="Option text"
                        className="shadow-none px-3 py-2 rounded-[10px] h-10 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                      />

                      <button
                        onClick={() => removeOption(question.id, option.id)}
                        disabled={question.options.length <= 1}
                      >
                        <X className="h-5 w-5 text-danger" />
                      </button>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <button
                onClick={() => addOption(question.id)}
                className="gap-2 transition-colors p-2 rounded-xl border-2 border-dashed border-shade-3 flex items-center justify-center bg-white hover:bg-offwhite w-full"
              >
                <Plus className="w-5 h-5 text-orange" />
                <span className="text-high text-sm font-medium">Add Option</span>
              </button>
            </div>
          ))}
        </div>

        <div className="add-new-quiz-button">
          <button
            className="gap-2 transition-colors p-6 rounded-xl border-2 border-dashed border-shade-3 flex items-center justify-center bg-white hover:bg-offwhite w-full"
            onClick={addQuestion}
          >
            <Plus className="w-5 h-5 text-orange" />
            <span className="text-high text-sm font-medium">Add New Question</span>
          </button>
        </div>
      </div>
    </section>
  );
}
