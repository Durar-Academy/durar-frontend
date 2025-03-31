"use client";

import { Plus } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function StudentPaymentMethods() {
  return (
    <Dialog>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>Choose Payment Method</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div
              className="card px-4 py-5 border border-shade-3 flex items-center gap-6 rounded-xl
        hover:bg-shade-1 transition-colors cursor-pointer"
            >
              <div className="w-32 h-20 rounded-xl bg-[#224DBA] flex items-center justify-center">
                <Image src={"/logos_visa.svg"} width={58} height={18} alt="Visa Icon" />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <h3 className="text-high font-semibold text-xl">Alex Parkinson</h3>

                  <p className="text-orange bg-orange/20 rounded-full py-1 px-3 text-sm font-medium text-center w-fit">
                    Primary
                  </p>
                </div>

                <p className="text-low font-medium text-base">**** 6767</p>
              </div>
            </div>

            <div
              className="card px-4 py-5 border border-shade-3 flex items-center gap-6 rounded-xl
        hover:bg-shade-1 transition-colors cursor-pointer"
            >
              <div className="w-32 h-20 rounded-xl bg-[#040B1C] flex items-center justify-center">
                <Image src={"/logos_mastercard.svg"} width={44} height={36} alt="Mastercard Icon" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-high font-semibold text-xl">Alex Parkinson</h3>

                <p className="text-low font-medium text-base">**** 6767</p>
              </div>
            </div>

            <div className="text-orange flex items-center gap-2 cursor-pointer">
              <Plus className="w-6 h-6" />

              <span>Add New Card</span>
            </div>
          </div>

          <div
            className="card px-4 py-5 border border-shade-3 flex items-center gap-6 rounded-xl
      hover:bg-shade-1 transition-colors cursor-pointer"
          >
            <div
              className="w-32 h-20 rounded-xl bg-dark-green
        bg-gradient-to-r from-green to-orange flex items-center justify-center"
            >
              <Image src={"/bank.svg"} width={32} height={32} alt="Bank Icon" />
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-high font-semibold text-xl">Pay with Bank Transfer</h3>

              <p className="text-low font-medium text-base">Make Payment</p>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
