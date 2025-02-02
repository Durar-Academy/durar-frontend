import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/account";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return query;
}
