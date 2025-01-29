import { Suspense } from "react";

import { AccountVerification } from "@/components/auth/account-verification";

export default function ResetVerificationPage() {
  return (
    <Suspense>
      <AccountVerification />
    </Suspense>
  );
}
