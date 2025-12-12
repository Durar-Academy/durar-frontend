"use client";

import toast from "react-hot-toast";
import { z } from "zod";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/auth/password-field";

import { useSetPasswordForm } from "@/hooks/useForm";
import { changePassword } from "@/lib/account";
import { setPasswordFormSchema } from "@/lib/schemas";
import { deleteAuthData } from "@/lib/storage";

export function ChangePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setPasswordFormController = useSetPasswordForm();
  const router = useRouter();

  const handlePasswordSubmit = async (values: z.infer<typeof setPasswordFormSchema>) => {
    try {
      setIsSubmitting(true);

      await changePassword({ password: values.password });

      toast.success("Password changed successfully. Sign in with your new password.");
      setPasswordFormController.reset();
      deleteAuthData();
      router.push("/auth");
    } catch (error: unknown) {
      console.error("Failed to change password", error);

      if (error instanceof AxiosError)
        toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      else toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="w-full rounded-xl border border-shade-2 bg-white p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-high font-semibold text-lg">
            Change Password
          </h2>

          <div className="flex gap-4">
            <button
              className="text-orange flex items-center gap-2 text-base font-medium hover:underline"
              onClick={setPasswordFormController.handleSubmit(handlePasswordSubmit)}
              disabled={isSubmitting}
            >
              <Check className="w-5 h-5 " />
              <span>{isSubmitting ? <>Saving...</> : <>Save</>}</span>
            </button>

            <button
              className="text-danger flex items-center gap-2 text-base font-medium hover:underline"
              onClick={() => setPasswordFormController.reset()}
            >
              <X className="w-5 h-5 " />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <Form {...setPasswordFormController}>
          <form className="flex flex-col gap-6">
            <div className="flex gap-3 flex-col lg:flex-row">
              <PasswordField
                label={"New Password"}
                name={"password"}
                control={setPasswordFormController.control}
              />

              <PasswordField
                label={"Confirm New Password"}
                name={"confirmPassword"}
                control={setPasswordFormController.control}
              />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
