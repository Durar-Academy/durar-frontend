import { Suspense } from "react";

import { AccountVerification } from "@/components/auth/account-verification";

export default function VerifyAccountPage() {
  return (
    <Suspense>
      <AccountVerification />
    </Suspense>
  );
}
