import dynamic from "next/dynamic";

const RequestVerification = dynamic(
  () => import("@/components/auth/request-verification").then((module) => module.RequestVerification),
  { ssr: false }
);

export default function RequestVerificationPage() {
  return <RequestVerification />;
}
