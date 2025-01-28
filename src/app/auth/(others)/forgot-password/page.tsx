"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { resetPasswordFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { initiatePasswordReset } from "@/lib/auth";

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [inputError, setInputError] = useState("");

  const [verifiedReset, setVerifiedReset] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const zodResponse = resetPasswordFormSchema.safeParse(email);
    if (!zodResponse.success) {
      setInputError(zodResponse.error?.flatten().formErrors as unknown as string);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await initiatePasswordReset({ email });
      console.log("Initiate Password Reset Response Data", response.data);

      if (response.status) {
        toast.success("We sent a password reset link to your email.\n\nPlease check your inbox.");
      }

      setVerifiedReset(true);
    } catch (error) {
      console.error("Reset Password Form Error", error);

      toast.error("The email provided is not associated with any account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendEmail() {
    const response = await initiatePasswordReset({ email });
    console.log("RESEND: Password Reset Response Data", response.data);

    if (response.status) {
      toast.success("We sent a password reset link to your email.\n\nPlease check your inbox.");
    }
  }

  if (verifiedReset)
    return (
      <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[500px] mx-auto border border-shade-1">
        <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
          <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
        </div>

        <div>
          <div className="text-center flex flex-col items-center">
            <Image src={"/mail-icon.svg"} width={100} height={100} alt="Mail Icon" />

            <h1 className="mt-6 font-semibold text-high text-xl">Check your email</h1>

            <p className="text-low font-normal text-sm mt-3 px-12">
              We&apos;ve sent a password reset link to your email. Please check your inbox.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href={"https://mail.google.com/mail/u/0/#inbox"} target="_blank">
              <Button className="w-full text-base font-medium leading-5 text-center py-3"> Open Gmail</Button>
            </Link>

            <p className="mt-4">
              Didn&apos;t receive the email?{" "}
              <button className="text-orange underline underline-offset-2" onClick={handleResendEmail}>
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[500px] mx-auto border border-shade-1">
      <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
        <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
      </div>

      <div className="flex flex-col">
        <div className="text-center mb-6">
          <h1 className="font-semibold text-high text-xl">Forgot Password</h1>

          <p className="text-low font-normal text-sm mt-3">
            Please enter your email address below and we&apos;ll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2 text-medium text-sm leading-4 w-full inline-block text-low" htmlFor="email">
              Email
            </Label>

            <Input
              placeholder="someone@example.com"
              type="email"
              id="email"
              className={cn(
                "shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange",

                !!inputError && "border-2 border-destructive"
              )}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {!!inputError && <p className="text-sm font-medium text-destructive mt-2">{inputError}</p>}
          </div>

          <div className="mt-8">
            <Button
              className="w-full text-base font-medium leading-5 text-center py-3"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <>Submitting...</> : <>Submit</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
