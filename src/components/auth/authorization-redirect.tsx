"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { deleteAuthData, retrieveAuthData, storeAuthData } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/account";
import { Loading } from "@/components/shared/loading";

export function AuthorizationRedirect({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(false);
  const { loggedIn } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkRole = useCallback(() => {
    (async function () {
      setAuthLoading(true);

      if (!loggedIn) {
        setAuthLoading(false);
        deleteAuthData();
        router.push("/auth");
        return;
      }

      let [, , userRole] = retrieveAuthData();

      abortControllerRef.current = new AbortController();

      if (!userRole) {
        try {
          console.log("Attempting to refresh user role");
          const response = await getCurrentUser({ signal: abortControllerRef.current.signal });
          storeAuthData(undefined, undefined, response.data.role);

          [, , userRole] = retrieveAuthData();
          console.log("Successfully refreshed user role");
        } catch (error) {
          if (axios.isCancel(error)) return;
          console.error("Unable to refresh user role", error);

          toast.error("Your session has expired. Please login again.");

          deleteAuthData();
          router.push("/auth");
          setAuthLoading(false);
          return;
        }
      }

      if (!userRole) {
        deleteAuthData();
        router.push("/auth");
        setAuthLoading(false);
        return;
      }

      if (pathname.startsWith("/admin") && userRole !== "admin") {
        router.push(`/${userRole.toLowerCase()}`);
      } else if (pathname.startsWith("/tutor") && userRole !== "tutor") {
        router.push(`/${userRole.toLowerCase()}`);
      } else if (pathname.startsWith("/student") && userRole !== "student") {
        router.push(`/${userRole.toLowerCase()}`);
      }

      setAuthLoading(false);
    })();
  }, [loggedIn, pathname, router]);

  useEffect(() => {
    checkRole();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [checkRole]);

  if (authLoading) return <Loading />;

  return <>{children}</>;
}
