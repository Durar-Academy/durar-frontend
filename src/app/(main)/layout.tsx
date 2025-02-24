import { AuthenticationProvider } from "@/contexts/authentication-provider";
import { ReactQueryProvider } from "@/contexts/react-query-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // <AuthenticationProvider>
    <ReactQueryProvider>{children}</ReactQueryProvider>
    // </AuthenticationProvider>
  );
}
