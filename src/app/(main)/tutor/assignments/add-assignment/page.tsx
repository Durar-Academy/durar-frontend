"use client";
import AssignmentPreview from "@/components/tutor/Assignment-component/AssignmentPreview";
import CreateAssignment from "@/components/tutor/Assignment-component/CreateAssignment";
import { Top_Bar } from "@/components/tutor/top-bar";
import { useState } from "react";

const page = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <section className="flex flex-col gap-3">
      <Top_Bar subtext={`Add New Assignment-Basic`}>
        {"Assignment < Add Assignment"}{" "}
      </Top_Bar>
      <CreateAssignment handleShow={handleShow} />
      <AssignmentPreview handleShow={handleShow} show={show} />
    </section>
  );
};

export default page;
