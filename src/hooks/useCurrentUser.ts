import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/account";

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: ({ signal }) => getCurrentUser({ signal }),
  });
};
