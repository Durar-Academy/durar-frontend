"use client";
import AssignmentPreview from "@/components/tutor/Assignment-component/AssignmentPreview";
import CreateAssignment from "@/components/tutor/Assignment-component/CreateAssignment";
import { Top_Bar } from "@/components/tutor/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useAccount";
import { useState } from "react";

const Page = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };
  const { data: user, isLoading: currentUserLoading } = useCurrentUser();
  return (
    <section className="flex flex-col gap-3">
      {currentUserLoading ? (
        <Skeleton className="w-full rounded-xl h-[80px]" />
      ) : (
        <Top_Bar subtext="Add New Assignment-Basic" user={user as User}>
          <p className="flex items-center gap-1">
            {"Assignment < Add Assignment"}
          </p>
        </Top_Bar>
      )}
      <CreateAssignment handleShow={handleShow} />
      <AssignmentPreview handleShow={handleShow} show={show} />
    </section>
  );
};

export default Page;
