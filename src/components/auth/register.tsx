"use client";

import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordField } from "./password-field";

import { registerFormSchema } from "@/lib/schemas";
import { useRegisterForm } from "@/hooks/useForm";
import { COUNTRIES, DAILING_CODES, GENDERS, TITLES } from "@/data/constants";
import { createAccount } from "@/lib/auth";
import { extractDialingCode } from "@/lib/utils";

export function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registrationFormController = useRegisterForm();

  async function handleSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsSubmitting(true);
    console.log("Registration Form Values: ", values);

    const payload = {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName ?? "",
      gender: values.gender.toLowerCase(),
      country: values.country,
      title: values.title,
      phone: `${extractDialingCode(values.dialingCode)}${values.phoneNumber}`,
    };
    console.log("Registration Form Payload", payload);

    try {
      const response = await createAccount(payload);
      console.log("Registration Form Response Data", response.data);

      if (response.status)
        toast.success("Account created successfully!\n\nPlease check your email to verify your account.");

      registrationFormController.reset();
    } catch (error) {
      console.error("Registration Form Error", error);

      toast.error("Unable to create account. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-center text-high font-semibold text-xl mb-8">Create Account</h2>

      <Form {...registrationFormController}>
        <form onSubmit={registrationFormController.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          {/* TITLE / FIRST NAME */}
          <div className="flex gap-3 flex-col md:flex-row md:justify-between">
            <FormField
              control={registrationFormController.control}
              name="title"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Select Title</FormLabel>

                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm
                      
                      
                      focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange"
                      >
                        <SelectValue placeholder="Select Title" />
                      </SelectTrigger>
                      <SelectContent>
                        {TITLES.map((title) => (
                          <SelectItem value={title} key={title} className="text-high text-sm">
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
              control={registrationFormController.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">First Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter First Name"
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

          {/* MIDDLE NAME / LAST NAME */}
          <div className="flex gap-3 flex-col md:flex-row md:justify-between">
            <FormField
              control={registrationFormController.control}
              name="middleName"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Middle Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter Middle Name"
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
              control={registrationFormController.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Last Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter Last Name"
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

          {/* GENDER */}
          <div>
            <FormField
              control={registrationFormController.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-low text-sm font-medium mb-2">Gender</FormLabel>

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

          {/* DIALING CODE / PHONE NUMBER */}
          <div className="flex gap-3 flex-col md:flex-row md:justify-between">
            <FormField
              control={registrationFormController.control}
              name="dialingCode"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Dialing Code</FormLabel>

                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm
                      
                      
                        focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange"
                      >
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
              control={registrationFormController.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Phone Number</FormLabel>

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

          {/* EMAIL ADDRESS / COUNTRY */}
          <div className="flex gap-3 flex-col md:flex-row md:justify-between">
            <FormField
              control={registrationFormController.control}
              name="email"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Email Address</FormLabel>

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
              control={registrationFormController.control}
              name="country"
              render={({ field }) => (
                <FormItem className="basis-1/2">
                  <FormLabel className="text-low text-sm font-medium mb-2">Country</FormLabel>

                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger
                        className="shadow-none px-4 py-2 rounded-xl h-12 placeholder:text-low text-high text-sm
                      
                        focus:ring-0 focus:outline-0 focus:ring-offset-0 focus:border-2 focus:border-orange"
                      >
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
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* PASSWORD / CONFIRM PASSWORD */}
          <div className="flex gap-3 flex-col md:flex-row md:justify-between">
            <PasswordField label={"Password"} name={"password"} control={registrationFormController.control} />

            <PasswordField
              label={"Confirm Password"}
              name={"confirmPassword"}
              control={registrationFormController.control}
            />
          </div>

          <Button
            type="submit"
            className="mt-8 px-5 py-3 rounded-xl bg-green hover:bg-green/80 text-white sm:text-sm text-base font-medium h-12 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? <>Creating Account...</> : <>Create Account</>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
