"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Loading } from "@/components/shared/loading";

import { retrieveAuthData, storeAuthData } from "@/lib/storage";
import { refreshAccessToken } from "@/lib/auth";

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  const fetchAuth = useCallback(() => {
    (async function () {
      setAuthLoading(true);

      const [, refreshToken] = retrieveAuthData();

      if (!refreshToken) {
        console.error("No local refresh token");
        setAuthLoading(false);
        setLoggedIn(false);
        router.push("/auth");
        return;
      }

      try {
        console.log("Refreshing Access token with local Refresh Token");

        const response = await refreshAccessToken({ refreshToken });

        storeAuthData(response.data.accessToken, refreshToken);

        console.log("Refreshing Access token with local Refresh Token Successful");

        setLoggedIn(true);
      } catch (error) {
        console.error("Unable to refresh Access token with Local Refresh Token", error);

        toast.error("Your session has expired. Please login again to continue.");

        setLoggedIn(false);

        router.push("/auth");
      } finally {
        setAuthLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => fetchAuth(), [fetchAuth]);

  if (authLoading) return <Loading />;

  // During the transition to login page (safeguard)
  if (!loggedIn && !authLoading) return <Loading />;

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, authLoading, setAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
