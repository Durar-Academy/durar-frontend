import { Suspense } from "react";

import { ResetVerification } from "@/components/auth/reset-verification";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetVerification />
    </Suspense>
  );
}
