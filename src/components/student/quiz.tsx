"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";

export function Quiz() {
  return (
    <section className="rounded-xl w-full border border-shade-3 p-6 bg-white flex flex-col gap-9">
      <div className="rounded-xl border border-shade-3">
        <div className="bg-shade-1 rounded-t-xl p-6 flex justify-between items-center">
          <h1 className="text-high font-semibold text-xl">Assignment Name</h1>

          <div className="flex items-center gap-1 text-xl font-semibold">
            <span className="text-base font-normal">Questions: </span>

            <span className="text-orange">01</span>

            <span>of 50</span>
          </div>

          <div className="flex items-center text-xl font-semibold gap-1">
            <p className="text-base font-normal">Time Left: </p>

            <p>20:00</p>
          </div>
        </div>

        <div className="p-6 flex items-start gap-6">
          <div
            className="border rounded-xl bg-shade-1 border-shade-3
          flex items-center justify-center shrink-0 w-12 h-12 text-xl font-semibold text-high"
          >
            01
          </div>

          <div className="text-xl text-high py-3">
            <h3 className="mb-6 font-semibold">Question</h3>

            <RadioGroup className="flex flex-col gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem
                    value={String(index + 1)}
                    className="h-6 w-6 shadow-none border border-shade-3
                    focus:outline-0 focus-visible:ring-0 focus:border-2"
                  >
                    <div className="h-4 w-4 bg-orange rounded-full"></div>
                  </RadioGroupItem>

                  <Label className="text-high text-base">Option {index + 1}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-10 flex h-10 gap-3">
              <Button
                className="bg-orange hover:bg-burnt transition-colors text-white"
                variant="_default"
                disabled={true}
              >
                <ArrowLeft className="w-6 h-6" />
                Previous
              </Button>

              <Button
                className="bg-orange hover:bg-burnt transition-colors text-white"
                variant="_default"
              >
                Next
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-low font-semibold text-base">Questions</h3>

        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 50 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-xl font-normal text-high bg-light shrink-0",

                false && "bg-success/20",
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
