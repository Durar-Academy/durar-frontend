"use client";

import { createContext, useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { Loading } from "@/components/shared/loading";

import { deleteAuthData, retrieveAuthData, storeAuthData } from "@/lib/storage";
import { refreshAccessToken } from "@/lib/auth";

export const AuthenticationContext = createContext<AuthenticationContextProps | undefined>(undefined);

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAuth = useCallback(() => {
    (async function () {
      setAuthLoading(true);

      const [, refreshToken] = retrieveAuthData();

      if (!refreshToken) {
        console.error("No local refresh token");
        setAuthLoading(false);
        setLoggedIn(false);
        deleteAuthData();
        router.push("/auth");
        return;
      }

      abortControllerRef.current = new AbortController();

      try {
        console.log("Refreshing Access token with local Refresh Token");

        const response = await refreshAccessToken({ refreshToken, signal: abortControllerRef.current.signal });

        storeAuthData(response.data.accessToken, refreshToken);

        console.log("Refreshing Access token with local Refresh Token Successful");

        setLoggedIn(true);
      } catch (error) {
        if (axios.isCancel(error)) return;

        console.error("Unable to refresh Access token with Local Refresh Token", error);

        toast.error("Your session has expired. Please login again to continue.");

        setLoggedIn(false);

        deleteAuthData();

        router.push("/auth");
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    fetchAuth();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchAuth]);

  if (authLoading) return <Loading />;

  // During the transition to login page (safeguard)
  if (!loggedIn && !authLoading) return <Loading />;

  return (
    <AuthenticationContext.Provider value={{ loggedIn, setLoggedIn, authLoading, setAuthLoading }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
