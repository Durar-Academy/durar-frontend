"use client";

import { Camera, Check, User, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";

import { TopBar } from "@/components/shared/top-bar";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangePassword } from "@/components/auth/change-password";

import { COUNTRIES, DAILING_CODES, GENDERS, TITLES } from "@/data/constants";
import { useCurrentUser } from "@/hooks/useAccount";
import { useUpdateForm } from "@/hooks/useForm";
import { updateUserInfo } from "@/lib/account";
import { updateFormSchema } from "@/lib/schemas";
import { extractDialingCode } from "@/lib/utils";

export default function SettingsPage() {
  const updateFormController = useUpdateForm();
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(user?.profilePictureId || null);

  const handleSubmit = async (values: z.infer<typeof updateFormSchema>) => {
    setIsSubmitting(true);
    console.log("Update Form Values: ", values);

    const payload: Record<string, string> = {};

    if (values.email) payload.email = values.email;
    if (values.firstName) payload.firstName = values.firstName;
    if (values.lastName) payload.lastName = values.lastName;
    if (values.middleName) payload.middleName = values.middleName;
    if (values.gender) payload.gender = values.gender.toLowerCase();
    if (values.country) payload.country = values.country;
    if (values.phoneNumber && values.dialingCode) {
      payload.phone = `${extractDialingCode(values.dialingCode)}${values.phoneNumber}`;
    }

    // if (values.title) payload.title = values.title;
    // if (values.profileImage) payload.profileImage = values.profileImage;

    try {
      const response = await updateUserInfo(payload, user?.id ?? "");
      console.log("Update Form Response Data", response);

      if (response.success) toast.success("Account updated successfully!");
      updateFormController.reset();
    } catch (error) {
      console.error("Update Form Error", error);
      toast.error("Unable to update your account. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="top-bar">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px] " />
        ) : (
          <TopBar subtext={"Update your profile"} user={user as User}>
            Settings
          </TopBar>
        )}
      </div>

      <div className="p-6 border border-shade-2 bg-white rounded-xl flex flex-col gap-6">
        <h2 className="flex items-center gap-2 text-high font-semibold text-lg">
          <User className="w-5 h-5 text-orange" />
          <span>Profile Settings</span>
        </h2>

        <section className="flex gap-6">
          <Form {...updateFormController}>
            <form className="w-full flex flex-col xl:flex-row gap-6">
              <FormField
                control={updateFormController.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem className="hidden shrink-0 w-full max-w-80 rounded-xl border border-shade-2 bg-white p-4 xl:flex flex-col gap-3 items-center">
                    <div className="w-full relative h-64 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          fill
                          alt="User Profile Picture"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <User className="w-8 h-8" />
                          <p className="mt-2 text-sm">No Profile Picture</p>
                        </div>
                      )}
                    </div>

                    <p className="text-low font-medium text-base">
                      {user && `${user.title} ${user.firstName} ${user.lastName}`}
                    </p>

                    <FormControl>
                      <div className="relative flex gap-4">
                        <Label
                          htmlFor="profileImage"
                          className="text-orange cursor-pointer flex items-center gap-2 text-base font-medium"
                        >
                          <span>Change</span>
                          <Camera className="w-5 h-5" />
                          <input
                            type="file"
                            id="profileImage"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(file);

                                const url = URL.createObjectURL(file);
                                setImagePreview(url);
                              }
                            }}
                          />
                        </Label>

                        {imagePreview && (
                          <button
                            type="button"
                            className="text-danger flex items-center gap-2 text-base font-medium"
                            onClick={() => {
                              field.onChange(undefined);
                              setImagePreview(null);
                            }}
                          >
                            <span>Remove</span>
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full rounded-xl border border-shade-2 bg-white p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-center gap-2 text-high font-semibold text-lg">
                    Personal Details
                  </h2>

                  <div className="flex gap-4">
                    <button
                      className="text-orange flex items-center gap-2 text-base font-medium hover:underline"
                      onClick={updateFormController.handleSubmit(handleSubmit)}
                      disabled={isSubmitting}
                      type="button"
                    >
                      <Check className="w-5 h-5 " />
                      <span>{isSubmitting ? <>Saving...</> : <>Save</>}</span>
                    </button>

                    <button
                      className="text-danger flex items-center gap-2 text-base font-medium hover:underline"
                      onClick={() => updateFormController.reset()}
                      type="button"
                    >
                      <X className="w-5 h-5 " />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-3 flex-col md:flex-row md:justify-between">
                    <FormField
                      control={updateFormController.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Select Title
                          </FormLabel>

                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange">
                                <SelectValue placeholder="Select Title" />
                              </SelectTrigger>
                              <SelectContent>
                                {TITLES.map((title) => (
                                  <SelectItem
                                    value={title}
                                    key={title}
                                    className="text-high text-sm"
                                  >
                                    {title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            First Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter First Name"
                              type="text"
                              className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Middle Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter Middle Name"
                              type="text"
                              className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Last Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter Last Name"
                              type="text"
                              className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-6 flex-col">
                    <FormField
                      control={updateFormController.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Country
                          </FormLabel>

                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange">
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>

                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem
                                    value={country}
                                    key={country}
                                    className="text-high text-sm"
                                  >
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Gender
                          </FormLabel>

                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex justify-between gap-3"
                            >
                              {GENDERS.map((gender) => (
                                <FormItem
                                  className="basis-1/2 shadow-none rounded-xl border focus-within:border-2 focus-within:border-orange px-4"
                                  key={gender}
                                >
                                  <div className="w-full h-12 flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem
                                        value={gender}
                                        checked={field.value === gender}
                                        className="h-6 w-6 shadow-none border-shade-1

                              focus:outline-0 focus-visible:ring-0 focus:border-2"
                                      >
                                        <div className="h-4 w-4 bg-orange rounded-full"></div>
                                      </RadioGroupItem>
                                    </FormControl>

                                    <FormLabel className="font-normal text-sm w-full text-low cursor-pointer py-2">
                                      {gender}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row md:justify-between">
                    <FormField
                      control={updateFormController.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Email Address
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter Email Address"
                              type="text"
                              className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm
                            focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="dialingCode"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Dialing Code
                          </FormLabel>

                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange">
                                <SelectValue placeholder="Select Dailing Code" />
                              </SelectTrigger>

                              <SelectContent>
                                {DAILING_CODES.map((dialingCode) => (
                                  <SelectItem
                                    value={dialingCode}
                                    key={dialingCode}
                                    className="text-high text-sm flex justify-between"
                                  >
                                    {dialingCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={updateFormController.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="basis-1/2">
                          <FormLabel className="text-low text-sm font-medium mb-2">
                            Phone Number
                          </FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Enter Phone Number"
                              type="text"
                              className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm

                    focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </section>
      </div>

      <ChangePassword />
    </section>
  );
}
