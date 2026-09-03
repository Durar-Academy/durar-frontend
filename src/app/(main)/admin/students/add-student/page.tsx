"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronRight, MoveRight, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactSelect, { StylesConfig } from "react-select";

import { TopBar } from "@/components/shared/top-bar";
import { CreateStudentTabs } from "@/components/admin/students/create-student-tabs";
import { Button } from "@/components/ui/button";
import { ControlledDatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useAccount";
import { useCourses, useRegisterStudent } from "@/hooks/useAdmin";
import { COUNTRIES, DAILING_CODES, GENDERS, TITLES } from "@/data/constants";
import { extractDialingCode } from "@/lib/utils";

const addStudentSchema = z
  .object({
    title: z.enum(TITLES, {
      required_error: "Please select a title",
      invalid_type_error: "Please select a valid title",
    }),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().max(50, "Middle name cannot exceed 50 characters").optional(),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    email: z.string().min(1, "Email is required").email("Invalid Email!"),
    dialingCode: z
      .string({
        required_error: "Please select a dialing code",
        invalid_type_error: "Please select a dialing code",
      })
      .refine((value) => DAILING_CODES.includes(value), { message: "Please select a dialing code" }),
    phoneNumber: z.string().min(1, "Phone number is required").regex(/^\d+$/, "Phone number must contain only digits"),
    gender: z.enum(GENDERS, {
      required_error: "Please select a gender",
      invalid_type_error: "Please select a gender",
    }),
    enrollmentDate: z.string().min(1, "Enrolment date is required"),
    studentId: z.string().min(1, "Student ID is required"),
    assignCategory: z.string().min(1, "Please select a category"),
    assignmentCourses: z.array(z.string()).min(1, "Please select assigned courses"),
    address: z.string().min(1, "Address is required"),
    cityState: z.string().min(1, "City/State is required"),
    country: z.string().min(1, "Country is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AddStudentValues = z.infer<typeof addStudentSchema>;

type CourseOption = {
  label: string;
  value: string;
};

const stepOneFields = [
  { name: "title", label: "Title", type: "select" as const },
  { name: "firstName", label: "First Name", type: "text" as const, placeholder: "Enter first name" },
  { name: "middleName", label: "Middle Name", type: "text" as const, placeholder: "Enter middle name" },
  { name: "lastName", label: "Last Name", type: "text" as const, placeholder: "Enter last name" },
  { name: "dob", label: "Date of Birth", type: "date" as const },
  { name: "email", label: "Email Address", type: "text" as const, placeholder: "student@example.com" },
  { name: "dialingCode", label: "Dialing Code", type: "select" as const },
  { name: "phoneNumber", label: "Phone Number", type: "text" as const, placeholder: "Enter phone number" },
  { name: "gender", label: "Gender", type: "radio" as const },
];

const categoryOptions = ["Idaadiyah", "Tahfiz", "Advanced", "Foundation"];

const selectStyles: StylesConfig<CourseOption, true> = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "56px",
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#f38708" : "hsl(0, 0%, 86%)",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#f38708" : "hsl(0, 0%, 86%)",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "hsl(215, 16%, 47%)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#ffe7ca",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#f38708",
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#f38708",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#f38708",
      color: "white",
    },
  }),
};

const stepTwoFields = [
  { name: "enrollmentDate", label: "Enrolment Date", type: "date" as const },
  { name: "studentId", label: "Student ID", type: "text" as const },
  { name: "assignCategory", label: "Assign Category", type: "select" as const, options: categoryOptions },
  { name: "assignmentCourses", label: "Assignment Courses", type: "multi-select" as const },
];

const steps = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Enrollment Details" },
  { id: 3, title: "Address & Location" },
  { id: 4, title: "Account Setup" },
];

export default function AddStudentPage() {
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  const { data: allCourses, isLoading: coursesLoading } = useCourses({ status: "published" });
  const [activeStep, setActiveStep] = useState(1);
  const [enrollmentDate, setEnrollmentDate] = useState<Date | undefined>(new Date());
  const registerStudentMutation = useRegisterStudent();
  const router = useRouter();

  const courseOptions: CourseOption[] = allCourses
    ? allCourses.map((course) => ({
      value: course.id,
      label: course.title,
    }))
    : [];


  const form = useForm<AddStudentValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      title: "Mr",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      email: "",
      dialingCode: DAILING_CODES[0],
      phoneNumber: "",
      gender: "Male",
      enrollmentDate: "",
      studentId: "12345",
      assignCategory: "",
      assignmentCourses: [],
      address: "",
      cityState: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const next = async () => {
    const fieldsByStep: Record<number, (keyof AddStudentValues)[]> = {
      1: ["title", "firstName", "middleName", "lastName", "dob", "email", "dialingCode", "phoneNumber", "gender"],
      2: ["enrollmentDate", "studentId", "assignCategory", "assignmentCourses"],
      3: ["address", "cityState", "country"],
      4: ["email", "password", "confirmPassword"],
    };

    const valid = await form.trigger(fieldsByStep[activeStep]);
    if (valid) setActiveStep((currentStep) => Math.min(currentStep + 1, steps.length));
  };

  const back = () => setActiveStep((currentStep) => Math.max(currentStep - 1, 1));

  const onSubmit = async (values: AddStudentValues) => {
    try {
      const payload: RegisterStudentPayload = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        middleName: values.middleName?.trim() || "",
        gender: values.gender.toLowerCase(),
        country: values.country,
        title: values.title,
        phone: `${extractDialingCode(values.dialingCode)}${values.phoneNumber}`,
        category: values.assignCategory,
        assignedCoursesIds: values.assignmentCourses,
      };

      await registerStudentMutation.mutateAsync(payload);
      toast.success("Student account created successfully");
      router.push("/admin/students");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create student. Please try again.";

      console.error("Error creating student:", error?.response?.data ?? error);
      toast.error(message, { duration: 6000 });
    }
  };

  const renderStepOneField = (fieldConfig: (typeof stepOneFields)[number]) => {
    if (fieldConfig.type === "radio") {
      return (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name={fieldConfig.name as keyof AddStudentValues}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value as string}
                  className="grid gap-3 md:grid-cols-2"
                >
                  {GENDERS.map((gender) => (
                    <FormItem key={gender} className="basis-1/2 shadow-none rounded-xl border focus-within:border-2 focus-within:border-orange px-4">
                      <div className="w-full h-12 flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem
                            value={gender}
                            checked={field.value === gender}
                            className="h-6 w-6 shadow-none border-shade-1 focus:outline-0 focus-visible:ring-0 focus:border-2"
                          >
                            <div className="h-4 w-4 bg-orange rounded-full"></div>
                          </RadioGroupItem>
                        </FormControl>
                        <FormLabel className="font-normal text-sm w-full text-low cursor-pointer py-2">
                          {gender}
                        </FormLabel>
                      </div>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (fieldConfig.type === "select") {
      return (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name={fieldConfig.name as keyof AddStudentValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value as string}>
                  <SelectTrigger className="h-14 rounded-xl border-shade-3 text-base shadow-none focus:border-orange focus:ring-0">
                    <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldConfig.name === "title"
                      ? TITLES.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))
                      : DAILING_CODES.map((dialingCode) => (
                        <SelectItem key={dialingCode} value={dialingCode}>
                          {dialingCode}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name as keyof AddStudentValues}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
            <FormControl>
              <Input
                className="h-14 rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange"
                placeholder={fieldConfig.placeholder}
                type={fieldConfig.type === "date" ? "date" : "text"}
                value={field.value as string}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const renderStepTwoField = (fieldConfig: (typeof stepTwoFields)[number]) => {
    if (fieldConfig.name === "enrollmentDate") {
      return (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name="enrollmentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
              <FormControl>
                <ControlledDatePicker
                  date={enrollmentDate as Date}
                  setDate={(day) => {
                    setEnrollmentDate(day);
                    if (day) field.onChange(day.toISOString().split("T")[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (fieldConfig.name === "studentId") {
      return (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
              <FormControl>
                <Input
                  className="h-14 rounded-xl border-shade-3 text-base shadow-none bg-[#E6EAF6] focus-visible:ring-0 focus-visible:border-shade-3"
                  {...field}
                  readOnly
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (fieldConfig.name === "assignmentCourses") {
      return (
        <FormField
          key={fieldConfig.name}
          control={form.control}
          name="assignmentCourses"
          render={({ field }) => {
            const selectedCourses = field.value ?? [];

            return (
              <FormItem>
                <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
                <FormControl>
                  <ReactSelect
                    isMulti
                    isLoading={coursesLoading}
                    options={courseOptions}
                    value={courseOptions.filter((option) => selectedCourses.includes(option.value))}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    formatOptionLabel={(option) => option.label}
                    onChange={(selected) => {
                      const nextValues = Array.isArray(selected)
                        ? selected.map((option) => option.value)
                        : [];
                      console.log("ADD STUDENT COURSES - selected options:", selected);
                      console.log("ADD STUDENT COURSES - selected course ids:", nextValues);
                      field.onChange(nextValues);
                    }}
                    styles={selectStyles}
                    placeholder="Select courses..."
                    className="react-select-container text-sm"
                    classNamePrefix="react-select"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    }

    return (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name as "assignCategory" | "assignmentCourses"}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-low text-sm font-medium">{fieldConfig.label}</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value as string}>
                <SelectTrigger className="h-14 rounded-xl border-shade-3 text-base shadow-none focus:border-orange focus:ring-0">
                  <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {(fieldConfig.options ?? []).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="top-bar shrink-0">
        {currentUserLoading ? (
          <Skeleton className="w-full rounded-xl h-[80px]" />
        ) : (
          <TopBar subtext="Add a new student" user={user as User}>
            <p className="flex items-center gap-1">
              <Link href="/admin" className="hover:underline">
                Users
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/admin/students" className="hover:underline">
                Students
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Add Student</span>
            </p>
          </TopBar>
        )}
      </div>

      <div className="max-w-[900px] mx-auto w-full flex flex-1 flex-col min-h-0 overflow-hidden">
        <CreateStudentTabs currentFormStep={activeStep} totalFormSteps={steps.length} />

        <div className="w-full dashboard-shadow p-5 rounded-xl bg-white flex flex-col flex-1 min-h-0 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-24 hide-scrollbar">
                <div className={activeStep === 1 ? "grid gap-3 md:grid-cols-2" : "hidden"}>
                  {stepOneFields.map(renderStepOneField)}
                </div>

                <div className={activeStep === 2 ? "grid gap-3 md:grid-cols-2" : "hidden"}>
                  <div className="md:col-span-2 rounded-xl border border-shade-3 bg-offwhite p-5">
                    <p className="text-high font-semibold">Enrollment Details</p>
                    <p className="mt-1 text-sm text-low">Capture the enrollment details for the new student.</p>
                  </div>
                  {stepTwoFields.map(renderStepTwoField)}
                </div>

                <div className={activeStep === 3 ? "grid gap-3 md:grid-cols-2" : "hidden"}>
                  <div className="md:col-span-2 rounded-xl border border-shade-3 bg-offwhite p-5">
                    <p className="text-high font-semibold">Address & Location</p>
                    <p className="mt-1 text-sm text-low">Add the student&apos;s location for contact and reporting.</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-low text-sm font-medium">Address</FormLabel>
                        <FormControl>
                          <Input className="h-14 rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange" placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cityState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-low text-sm font-medium">City/State</FormLabel>
                        <FormControl>
                          <Input className="h-14 rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange" placeholder="Enter city/state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-low text-sm font-medium">Country</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value as string}>
                            <SelectTrigger className="h-14 rounded-xl border-shade-3 text-base shadow-none focus:border-orange focus:ring-0">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className={activeStep === 4 ? "grid gap-3" : "hidden"}>
                  <div className="rounded-xl border border-shade-3 bg-offwhite p-5">
                    <p className="text-high font-semibold">Create Login Credential</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-low text-sm font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input className="h-14 w-full rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange" type="email" placeholder="student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-low text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <Input className="h-14 w-full rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange" type="password" placeholder="Create password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-low text-sm font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <Input className="h-14 w-full rounded-xl border-shade-3 text-base shadow-none focus-visible:border-orange" type="password" placeholder="Confirm password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-shade-3 bg-white/95 pt-4 pb-1 backdrop-blur-sm">
                <Button
                  type="button"
                  variant="_outline"
                  className="h-12 rounded-xl px-5 text-danger hover:text-danger"
                  onClick={() => router.back()}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    className="h-12 rounded-xl px-5 bg-orange text-white hover:bg-burnt"
                    onClick={back}
                    disabled={activeStep === 1}
                  >
                    Previous
                  </Button>

                  {activeStep < steps.length ? (
                    <Button
                      type="button"
                      className="h-12 rounded-xl px-5 bg-green text-white hover:bg-dark-green"
                      onClick={next}
                    >
                      Next
                      <MoveRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="h-12 rounded-xl px-5 bg-green text-white hover:bg-dark-green"
                      disabled={registerStudentMutation.isPending}
                    >
                      <Plus className="h-4 w-4" />
                      {registerStudentMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
