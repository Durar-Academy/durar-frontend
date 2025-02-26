"use client";

import axios from "axios";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Progress } from "@/components/ui/progress";

import { verifyAccount } from "@/lib/auth";
import { deleteItem, STORE_EMAIL_KEY } from "@/lib/storage";

export function AccountVerification() {
  const [progressValue, setProgressValue] = useState(10);
  const [isVerifying, setIsVerifying] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const token = searchParams.get("token") ?? "";

  const verifyUserAccount = useCallback(
    (token: string) =>
      (async function () {
        if (!token) {
          toast.error("Cannot find verification token.\nPlease request for a new verification.");
          router.push("/auth/request-verification");
          return;
        }

        setIsVerifying(true);

        abortControllerRef.current = new AbortController();

        try {
          const response = await verifyAccount({ token, signal: abortControllerRef.current.signal });
          if (response.success) {
            toast.success("Account verification successful.\nYou can proceed to login to your account.");

            setProgressValue(100);
            deleteItem(STORE_EMAIL_KEY);
            router.push("/auth");
          }
        } catch (error) {
          if (axios.isCancel(error)) return;

          console.error("Verify Account Error: ", error);

          toast.error("Account verification failed. Please try again.");
          router.push("/auth/request-verification");
        } finally {
          setIsVerifying(false);
        }
      })(),
    [router]
  );

  useEffect(() => {
    if (!isVerifying) return;

    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 80) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVerifying]);

  useEffect(() => {
    verifyUserAccount(token);

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [verifyUserAccount, token]);

  return (
    <Suspense>
      <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[500px] mx-auto border border-shade-1">
        <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
          <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
        </div>

        <div>
          <div className="text-center flex flex-col items-center">
            <div className="rounded-full bg-orange/10 p-4">
              <Loader2 className="w-10 h-10 text-orange animate-spin" />
            </div>

            <h1 className="mt-6 font-semibold text-high text-xl px-12">Verifying Your Account</h1>

            <p className="text-low font-normal text-sm mt-4 px-8">
              Please wait while we verify your account. This should only take a moment.
            </p>

            <div className="max-w-xs w-full mt-4">
              <Progress value={progressValue} max={100} className="bg-orange/10" indicatorClassName="bg-orange" />
            </div>

            <p className="text-[0.8rem] text-low mt-8">
              Do not close this window. You will be automatically redirected once verification is complete.
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
