import { Suspense } from "react";

import { ResetVerification } from "@/components/auth/reset-verification";

export default function ResetVerificationPage() {
  return (
    <Suspense>
      <ResetVerification />
    </Suspense>
  );
}
