import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginFormSchema, registerFormSchema } from "@/lib/schemas";

export const useLoginForm = () => useForm<z.infer<typeof loginFormSchema>>({
  resolver: zodResolver(loginFormSchema),
  defaultValues: {
    email: "",
    password: "",
    rememberPassword: false,
  },
});

export const useRegisterForm = () => useForm<z.infer<typeof registerFormSchema>>({
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