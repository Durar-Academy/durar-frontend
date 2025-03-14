import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreateCourseFormContext } from "@/contexts/create-course-form-provider";
import { loginFormSchema, registerFormSchema, setPasswordFormSchema } from "@/lib/schemas";

export const useLoginForm = () =>
  useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

export const useRegisterForm = () =>
  useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dialingCode: "",
      phoneNumber: "",
      country: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

export const useSetPasswordForm = () =>
  useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

export function useCreateCourseFormProvider() {
  const createCourseContext = useContext(CreateCourseFormContext);

  if (createCourseContext === null)
    throw new Error("Create Course Context Used Outside of its scope.");
  return createCourseContext;
}
