"use client";

import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { loginFormSchema } from "@/lib/schemas";
import { useLoginForm } from "@/hooks/useForm";
import { PasswordField } from "./password-field";

export function Login() {
  const loginFormController = useLoginForm();

  function handleSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log("Login Form Values: ", values);
  }

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
                id="remember-password"
                className="h-5 w-5 border border-shade-1 shadow-none data-[state=checked]:bg-green data-[state=checked]:text-white"
                checked={loginFormController.watch("rememberPassword")}
                onCheckedChange={(checked) => loginFormController.setValue("rememberPassword", Boolean(checked))}
              />
              <label
                htmlFor="remember-password"
                className="font-normal text-high peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
              >
                Remember Password
              </label>
            </div>

            <Link className="hover:underline text-orange text-sm font-semibold" href="/auth/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-8 px-5 py-3 rounded-[10px] text-white sm:text-sm text-base font-medium h-12"
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
