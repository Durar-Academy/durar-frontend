import Image from "next/image";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="w-full flex auth-background min-h-screen h-max">
      <aside className="bg-green min-h-screen w-full lg:max-w-[400px] xl:max-w-[540px] hidden lg:block">
        <div className="h-screen relative">
          <Image src={"/auth-sidebar.webp"} fill alt="Auth Side Image" className="object-cover object-center z-[1]" />

          <div className="absolute inset-0 bg-black/30 z-[2]"></div>

          <div className="absolute h-[334px] bottom-0 left-0 right-0 bg-gradient-to-t from-green from-30.4% to-[rgba(23,58,1,0)] to-100% z-[3]">
            <h2 className="text-orange text-[28px] leading-[32px] font-semibold w-2/3 absolute left-6 bottom-7">
              Attend Madrasah in the comfort of your home at your convenience
            </h2>
          </div>
        </div>
      </aside>

      <section className="w-full flex items-center justify-center">{children}</section>
    </main>
  );
}
