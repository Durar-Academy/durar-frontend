"use client";

import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/auth/password-field";

import { useSetPasswordForm } from "@/hooks/useForm";
import { setPasswordFormSchema } from "@/lib/schemas";
import { setNewPassword } from "@/lib/auth";
import { deleteItem, retrieveItem, STORE_TOKEN_KEY } from "@/lib/storage";

export default function SetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  const setPasswordFormController = useSetPasswordForm();

  async function handleSubmit(values: z.infer<typeof setPasswordFormSchema>) {
    setIsSubmitting(true);
    console.log("Set Password Form Values: ", values);

    const token = retrieveItem(STORE_TOKEN_KEY);

    const payload = { password: values.password, token };
    console.log("Set Password Form Payload: ", payload);

    try {
      const response = await setNewPassword(payload);
      console.log("Set Password Form Response Data", response);

      toast.success("Password reset successful!\nPlease login with your new password.");

      setPasswordFormController.reset();
      deleteItem(STORE_TOKEN_KEY);
      setResetCompleted(true);
    } catch (error) {
      console.error("Set Password Form Error", error);

      toast.error("Unable to set new password. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (resetCompleted)
    return (
      <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[500px] mx-auto border border-shade-1">
        <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
          <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
        </div>

        <div>
          <div className="text-center flex flex-col items-center">
            <Image src={"/success-icon.svg"} width={100} height={100} alt="Success Icon" />

            <h1 className="mt-6 font-semibold text-high text-xl px-12">Your Password has been successfully reset</h1>

            <p className="text-low font-normal text-sm mt-3">You can now log in with your new password</p>
          </div>

          <div className="mt-8 text-center">
            <Link href={"/auth"}>
              <Button className="w-full text-base font-medium leading-5 text-center py-3">Back to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[500px] mx-auto border border-shade-1">
      <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
        <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
      </div>

      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="font-semibold text-high text-xl">Create a New Password</h1>

          <p className="text-low font-normal text-sm mt-3">
            Please enter your new password below to complete the reset process. Make sure it is strong and secure.
          </p>
        </div>

        <Form {...setPasswordFormController}>
          <form onSubmit={setPasswordFormController.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
            {/* PASSWORD / CONFIRM PASSWORD */}
            <div className="flex gap-3 flex-col">
              <PasswordField label={"New Password"} name={"password"} control={setPasswordFormController.control} />

              <PasswordField
                label={"Confirm New Password"}
                name={"confirmPassword"}
                control={setPasswordFormController.control}
              />
            </div>

            <Button
              type="submit"
              className="mt-8 px-5 py-3 rounded-xl bg-green hover:bg-green/80 text-white sm:text-sm text-base font-medium h-12 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? <>Submitting...</> : <>Submit</>}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
