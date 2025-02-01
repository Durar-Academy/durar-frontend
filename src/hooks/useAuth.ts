"use client";

import { useContext } from "react";

import { AuthenticationContext } from "@/contexts/authentication-provider";

export function useAuth() {
  const authContext = useContext(AuthenticationContext);

  if (!authContext) throw new Error("Auth Context Error: Not Initialized.");

  return authContext;
}
