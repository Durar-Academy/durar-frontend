"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { requestAccountVerification } from "@/lib/auth";
import { retrieveItem, STORE_EMAIL_KEY } from "@/lib/storage";

export default function RequestVerification() {
  const email = retrieveItem(STORE_EMAIL_KEY);

  async function handleResendEmail() {
    console.log("Resend Email: ", email);

    try {
      const response = await requestAccountVerification({ email });
      console.log("RESEND: Request Account Verification Response Data", response);

      {
        toast.success("We've resent an account verification link to your email.\nPlease check your inbox.");
      }
    } catch (error) {
      console.error("RESEND: Account Verification Email Error: ", error);

      toast.error("Unable to resend account verification link. Please try again.");
    }
  }

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
            We&apos;ve sent an account verification link to your email. Please check your inbox.
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
}
