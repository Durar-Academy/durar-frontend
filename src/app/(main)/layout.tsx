// import { AuthorizationRedirect } from "@/components/auth/authorization-redirect";
// import { AuthenticationProvider } from "@/contexts/authentication-provider";
import { ReactQueryProvider } from "@/contexts/react-query-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // <AuthenticationProvider>
    //   <AuthorizationRedirect>
    <ReactQueryProvider>{children}</ReactQueryProvider>
    //   </AuthorizationRedirect>
    // </AuthenticationProvider>
  );
}
