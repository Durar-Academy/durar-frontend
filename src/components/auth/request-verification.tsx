"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { requestAccountVerification } from "@/lib/auth";
import { retrieveItem, STORE_EMAIL_KEY } from "@/lib/storage";

export function RequestVerification() {
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setEmail(retrieveItem(STORE_EMAIL_KEY).trim().toLowerCase());
  }, []);

  async function handleResendEmail() {
    if (!email) {
      toast.error("We could not identify your account. Please return to login and try again.");
      return;
    }

    setIsResending(true);

    try {
      await requestAccountVerification({ email });
      toast.success("We've resent an account verification link to your email.\nPlease check your inbox.");
    } catch (error) {
      console.error("RESEND: Account Verification Email Error: ", error);

      toast.error("Unable to resend account verification link. Please try again.");
    } finally {
      setIsResending(false);
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
            <Button className="w-full text-base font-medium leading-5 text-center py-3" variant={"_default"}>
              Open Gmail
            </Button>
          </Link>

          <p className="mt-4">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              className="text-orange underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
