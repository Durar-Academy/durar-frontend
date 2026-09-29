"use client";

import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { deleteAuthData, retrieveAuthData, storeAuthData } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentUser } from "@/lib/account";

export function AuthorizationRedirect({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { loggedIn } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionExpiredToastRef = useRef(false);

  const checkRole = useCallback(() => {
    (async function () {
      if (!loggedIn) {
        deleteAuthData();
        router.push("/auth");
        return;
      }

      let [, , userRole] = retrieveAuthData();

      abortControllerRef.current = new AbortController();

      if (!userRole) {
        try {
          const user = await getCurrentUser({ signal: abortControllerRef.current.signal });
          storeAuthData(undefined, undefined, user.role);

          [, , userRole] = retrieveAuthData();
        } catch (error) {
          if (axios.isCancel(error)) return;
          console.error("Unable to refresh user role", error);

          // A single expired session must not stack the same toast: StrictMode
          // double-invokes this effect and every navigation re-enters here.
          if (!sessionExpiredToastRef.current) {
            sessionExpiredToastRef.current = true;
            toast.error("Your session has expired. Please login again.");
          }

          deleteAuthData();
          router.push("/auth");
          return;
        }
      }

      if (!userRole) {
        deleteAuthData();
        router.push("/auth");
        return;
      }

      if (pathname.startsWith("/admin") && userRole !== "admin") {
        router.push(userRole === "student" ? "/" : `/${userRole.toLowerCase()}`);
      } else if (pathname.startsWith("/tutor") && userRole !== "tutor") {
        router.push(userRole === "student" ? "/" : `/${userRole.toLowerCase()}`);
      } else if (pathname.startsWith("/student") && userRole !== "student") {
        router.push(`/${userRole.toLowerCase()}`);
      } else if (pathname === "/" || pathname === "") {
        router.push(`/${userRole.toLowerCase()}`);
      }

    })();
  }, [loggedIn, pathname, router]);

  useEffect(() => {
    checkRole();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [checkRole]);

  return <>{children}</>;
}
