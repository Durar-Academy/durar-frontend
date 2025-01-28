import Image from "next/image";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="auth-background h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <div>
          <div className="relative w-[240px] h-[160px] md:w-[400px] md:h-[280px]">
            <Image src={"/error.webp"} alt="Error Image" fill className="object-cover object-center" />
          </div>

          <div className="text-center ">
            <h3 className="text-[36px] md:text-[56px] font-bold text-green tracking-widest leading-none mb-2">404</h3>

            <p className="text-lg md:text-2xl mb-4 text-high">Oops, Page not found!</p>

            <Link
              href="/"
              className="flex items-center justify-center rounded-md py-3 px-4 w-fit mx-auto bg-green text-white text-sm md:text-base group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
