"use client";

import { z } from "zod";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField } from "./password-field";

import { loginFormSchema } from "@/lib/schemas";
import { useLoginForm } from "@/hooks/useForm";
import { decryptCredentials, encryptCredentials } from "@/lib/encryption";
import { deleteCredentials, retrieveCredentials, storeAuthData, storeCredentials } from "@/lib/storage";
import { loginUser } from "@/lib/auth";

export function Login() {
  const loginFormController = useLoginForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const setValue = useMemo(() => loginFormController.setValue, [loginFormController.setValue]);

  async function handleSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log("Login Form Values: ", values);

    if (values.rememberMe) {
      const encryptedCredentials = await encryptCredentials(values.email, values.password);

      storeCredentials(encryptedCredentials as EncryptionPayload);
    } else deleteCredentials();

    const payload = {
      email: values.email,
      password: values.password,
    };

    setIsSubmitting(true);
    try {
      const response = await loginUser(payload);
      console.log("Login Form Response Data", response);

      if (!response.data.isVerified) {
        toast.error("Please verify your account to continue.\nCheck your email for the verification link.");
        router.push("/auth/request-verification");
        return;
      }

      toast.success("Login successful!\nWelcome to Durar Academy.");

      const { accessToken, refreshToken, role } = response.data;
      storeAuthData(accessToken, refreshToken, role);

      loginFormController.reset();
      router.push(`/${role.toLowerCase()}`);
    } catch (error) {
      console.log("Login Form Error", error);

      toast.error("Invalid credentials. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    (async function prefillCredentials() {
      try {
        const retrievedCredentials = retrieveCredentials();
        if (!retrievedCredentials) return;

        const decryptedCredentials = await decryptCredentials(retrievedCredentials as EncryptionPayload);
        if (!decryptedCredentials) return;

        setValue("email", decryptedCredentials.email);
        setValue("password", decryptedCredentials.password);
        setValue("rememberMe", true);
      } catch (error) {
        console.error("Failed to retrieve saved credentials", error);
      }
    })();
  }, [setValue]);

  return (
    <div>
      <h2 className="text-center text-high font-semibold text-xl mb-8">Log In</h2>

      <Form {...loginFormController}>
        <form onSubmit={loginFormController.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <FormField
            control={loginFormController.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-low text-sm font-medium mb-2">Email Address</FormLabel>

                <FormControl>
                  <Input
                    placeholder="someone@example.com"
                    type="email"
                    className="shadow-none px-4 py-2 rounded-[10px] h-12 placeholder:text-low text-high text-sm
                    
                    
                    focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-orange"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordField label="Password" control={loginFormController.control} name="password" />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                className="h-5 w-5 border border-shade-1 shadow-none data-[state=checked]:bg-green data-[state=checked]:text-white"
                checked={loginFormController.watch("rememberMe")}
                onCheckedChange={(checked) => loginFormController.setValue("rememberMe", Boolean(checked))}
              />
              <label
                htmlFor="remember-me"
                className="font-normal text-high peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
              >
                Remember Me
              </label>
            </div>

            <Link className="hover:underline text-orange text-sm font-semibold" href="/auth/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-8 px-5 py-3 rounded-[10px] text-white sm:text-sm text-base font-medium h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? <>Logging in...</> : <>Login</>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
