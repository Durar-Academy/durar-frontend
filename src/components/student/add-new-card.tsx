"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ControlledDatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRIES } from "@/data/constants";

export function AddNewCard() {
  return (
    <Dialog>
      <DialogContent className="w-[500px] h-screen overflow-y-scroll hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>Add New Card</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div
            className="w-full h-48 rounded-xl bg-dark-green
             bg-gradient-to-r from-green to-orange flex items-center justify-center"
          >
            <Image src={"/transparent-card.svg"} width={280} height={128} alt="Accepted Cards" />
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {/* CARD NUMBER */}
              <div className="space-y-2 w-full">
                <Label htmlFor="cardNumber">Card Number</Label>

                <Input
                  id="cardNumber"
                  type="text"
                  className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                  placeholder="0903 5678 5672 8762"
                />
              </div>
              {/* CARD HOLDER NAME*/}
              <div className="space-y-2 w-full">
                <Label htmlFor="cardName">Card Holder Name</Label>

                <Input
                  id="cardName"
                  type="text"
                  className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                  placeholder="Adam Smith Doe"
                />
              </div>
              {/* EXPIRY / POSTAL CODE */}
              <div className="flex gap-3">
                <div className="space-y-2 w-full">
                  <Label htmlFor="expiry">Expiry Date</Label>

                  <div>
                    <ControlledDatePicker
                      date={new Date()}
                      setDate={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="postalCode">Postal Code</Label>

                  <Input
                    id="postalCode"
                    type="text"
                    className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                    placeholder="3456723"
                  />
                </div>
              </div>
              {/* ADDRESS */}
              <div className="space-y-2 w-full">
                <Label htmlFor="address">Address</Label>

                <Input
                  id="address"
                  type="text"
                  className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                  placeholder="123 Nothern Avenue"
                />
              </div>
              {/* CITY / COUNTRY */}
              <div className="flex gap-3">
                <div className="space-y-2 w-full">
                  <Label htmlFor="city">City</Label>

                  <Input
                    id="city"
                    type="text"
                    className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                    placeholder="Lagos"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="country">Postal Code</Label>

                  <Select>
                    <SelectTrigger className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>

                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem value={country} key={country} className="text-high text-sm">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 h-10">
              <Button
                variant={"_outline"}
                className="h-full w-full text-orange bg-shade-1 hover:bg-white
            border-shade-1 transition-colors"
              >
                Cancel
              </Button>

              <Button
                variant={"_default"}
                className="h-full w-full bg-orange transition-colors hover:bg-burnt"
              >
                Add Card
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
