import { z } from "zod";

import { COUNTRIES, DAILING_CODES, GENDERS, TITLES } from "@/data/constants";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("Invalid Email!"),

  password: z.string().min(1, "Password is required."),

  rememberMe: z.boolean(),
});

export const registerFormSchema = z
  .object({
    title: z.enum(TITLES, {
      required_error: "Please select a title",
      invalid_type_error: "Please select a valid title",
    }),

    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters"),

    middleName: z.string().max(50, "Middle name cannot exceed 50 characters").optional(),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),

    gender: z.enum(GENDERS, {
      required_error: "Please select a gender",
      invalid_type_error: "Please select a gender",
    }),

    dialingCode: z
      .string({
        required_error: "Please select a dialing code",
        invalid_type_error: "Please select a dialing code",
      })
      .refine((value) => DAILING_CODES.includes(value), {
        message: "Please select a dialing code",
      }),

    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Phone number must contain only digits"),

    country: z
      .string({
        required_error: "Please select a country",
        invalid_type_error: "Please select a country",
      })
      .refine((value) => COUNTRIES.includes(value), {
        message: "Please select a country",
      }),

    email: z.string().min(1, "Email is required").email("Invalid Email!"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordFormSchema = z
  .string()
  .min(1, {
    message: "Email is required.",
  })
  .email("Invalid Email!");

export const inviteTutorFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("Invalid Email!"),

  courseIds: z.array(z.string()).nonempty({ message: "Please assign atleast one course." }),
});

export const setPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateFormSchema = z.object({
  title: z
    .enum(TITLES, {
      invalid_type_error: "Please select a valid title",
    })
    .optional(),

  firstName: z.string().max(50, "First name cannot exceed 50 characters"),

  middleName: z.string().max(50, "Middle name cannot exceed 50 characters").optional(),

  lastName: z.string().max(50, "Last name cannot exceed 50 characters"),

  gender: z
    .enum(GENDERS, {
      invalid_type_error: "Please select a gender",
    })
    .optional(),

  dialingCode: z
    .string({
      invalid_type_error: "Please select a dialing code",
    })
    .refine((value) => DAILING_CODES.includes(value), {
      message: "Please select a dialing code",
    })
    .optional()
    .or(z.literal("")),

  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional()
    .or(z.literal("")),

  country: z
    .string({
      invalid_type_error: "Please select a country",
    })
    .refine((value) => COUNTRIES.includes(value), {
      message: "Please select a country",
    })
    .optional()
    .or(z.literal("")),

  email: z.string().email("Invalid Email!").optional().or(z.literal("")),

  profileImage: z.any().optional(),
});
