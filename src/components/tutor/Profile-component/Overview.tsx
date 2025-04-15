import Image from "next/image";
import React from "react";

const Overview = () => {
  return (
    <div className="text-sm w-full flex flex-col gap-3">
      <header className="flex justify-between items-center">
        <h1 className="font-semibold">Begginner Course</h1>
        <div className="flex items-center gap-1">
          <p className="text-orange">Send Message</p>
          <Image
            src={"/SVGs/sendMessage.svg"}
            width={16}
            height={16}
            alt="message Icone"
          />
        </div>
      </header>

      <section className="rounded-lg p-6 border border-shade-3 flex bg-white gap-4">
        <Image
          src={"/SVGs/default.svg"}
          height={154}
          width={188}
          alt="user image"
          className="rounded-xl"
        />

        <aside className="flex flex-col gap-4">
          <p className="text-sm text-low">
            Full Name:
            <span className="text-sm text-high pl-1">
              Lawal Wahab Babatunde
            </span>
          </p>
          <p className="text-sm text-low">
            Email:
            <span className="text-sm text-high pl-1">
              uthmanabdullahi2020@gmail.com
            </span>
          </p>
          <p className="text-sm text-low">
            Phone Number:
            <span className="text-sm text-high pl-1">+2347089075584</span>
          </p>
          <p className="text-sm text-low">
            Enrollment Date:
            <span className="text-sm text-high pl-1"> Jan 15, 2024</span>
          </p>
          <p className="text-sm text-low">
            Status{" "}
            <span className="text-sm  pl-1 text-light-green">Active</span>
          </p>
        </aside>
      </section>
    </div>
  );
};

export default Overview;
