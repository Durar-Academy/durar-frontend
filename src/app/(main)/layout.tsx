// import { AuthenticationProvider } from "@/contexts/authentication-provider";
// import { AuthorizationRedirect } from "@/components/auth/authorization-redirect";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

/* <AuthenticationProvider>
  <AuthorizationRedirect></AuthorizationRedirect>
</AuthenticationProvider>; */
