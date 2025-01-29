"use client";

import { useContext } from "react";

import { AuthContext } from "@/contexts/auth-provider";

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("Auth Context Error: Not Initialized.");

  return authContext;
}
