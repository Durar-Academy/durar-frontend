"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { COUNTRIES } from "@/data/constants";
import { addCard } from "@/lib/student";

countries.registerLocale(enLocale);

// Utility
const getCountryCodeFromName = (name: string): string => {
  return countries.getAlpha2Code(name, "en") || "";
};

function formatCardNumber(cardNumber: string): string {
  return cardNumber
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

// Schema
const CardSchema = z.object({
  cardNumber: z
    .string()
    .min(12, "Card number too short")
    .max(19, "Card number too long")
    .refine((val) => /^\d+$/.test(val), {
      message: "Card number must contain only digits",
    }),
  cardName: z.string().min(2, "Cardholder name is required"),
  expiry: z.string().regex(/^\d{4}-\d{2}$/, "Expiry must be YYYY-MM"),
  postalCode: z.string().refine((val) => /^\d+$/.test(val), {
    message: "Postal code must contain only digits",
  }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

type CardSchemaType = z.infer<typeof CardSchema>;

export function AddNewCard({ open, onOpenChange }: { open: boolean; onOpenChange: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CardSchemaType>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiry: "",
      postalCode: "",
      address: "",
      city: "",
      country: "",
    },
  });

  const onCancel = () => {
    form.reset();
    onOpenChange();
  };

  const onSubmit = async (data: CardSchemaType) => {
    const payload = {
      type: "add_card",
      provider: "paystack",
      name: data.cardName,
      billingAddress: {
        addressLine1: data.address,
        adminArea1: getCountryCodeFromName(data.country),
        postalCode: data.postalCode,
        countryCode: getCountryCodeFromName(data.country),
        city: data.city,
      },
      cardNumber: data.cardNumber,
      expiry: data.expiry,
    };

    console.log("Payload to send:", payload);

    try {
      setIsSubmitting(true);

      const response = await addCard(payload);
      console.log("ADD CARD", response.data);

      toast.success(response?.message || "Card added successfully");
    } catch (error) {
      console.error("ADD CARD", error);

      let message = "Failed to add card. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="w-[600px] h-4/5 overflow-y-scroll hide-scrollbar"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>Add New Card</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="w-full h-48 rounded-xl bg-dark-green bg-gradient-to-r from-green to-orange flex items-center justify-center">
            <Image src="/transparent-card.svg" width={280} height={128} alt="Accepted Cards" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                {/* CARD NUMBER */}
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-2 w-full">
                      <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
                      <FormControl>
                        <Input
                          id="cardNumber"
                          inputMode="numeric"
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          value={formatCardNumber(field.value)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            field.onChange(raw);
                          }}
                          className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
            focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CARD NAME */}
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem className="space-y-2 w-full">
                      <FormLabel>Card Holder Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adam Smith Doe"
                          {...field}
                          className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
                            focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EXPIRY / POSTAL CODE */}
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <FormItem className="space-y-2 w-full">
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            type="month"
                            {...field}
                            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                              focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
                              focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="space-y-2 w-full">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            inputMode="numeric"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!isNaN(Number(val))) field.onChange(val);
                            }}
                            placeholder="123456"
                            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                              focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
                              focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ADDRESS */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-2 w-full">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Northern Avenue"
                          {...field}
                          className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
                            focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CITY / COUNTRY */}
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="space-y-2 w-full">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Lagos"
                            {...field}
                            className="shadow-none px-3 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                              focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0
                              focus-visible:border-2 focus-visible:border-orange border border-shade-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-2 w-full">
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem
                                key={country}
                                value={country}
                                className="text-high text-sm"
                              >
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 h-10">
                <Button
                  type="button"
                  variant={"_outline"}
                  className="h-full w-full text-orange bg-shade-1 hover:bg-white
                    border-shade-1 transition-colors"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant={"_default"}
                  className="h-full w-full bg-orange transition-colors hover:bg-burnt"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Card"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
