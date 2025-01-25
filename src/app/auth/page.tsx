import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Register } from "@/components/auth/register";
import { Login } from "@/components/auth/login";

export default function Auth() {
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

      <section className="w-full mt-12 mb-16">
        <div className="card-shadow rounded-[24px] bg-white p-5 w-full max-w-[600px] mx-auto border border-shade-1">
          <div className="mb-8 h-[58px] w-[186px] relative mx-auto">
            <Image fill src={"/logo-green.svg"} alt="Logo Image" priority />
          </div>

          <Tabs defaultValue="login" className="w-full flex flex-col gap-8">
            <TabsList className="grid w-full grid-cols-2 bg-[#F8F8FA] h-11 p-0 rounded-full">
              <TabsTrigger
                value="login"
                className="h-full data-[state=active]:bg-green data-[state=active]:text-white rounded-full data-[state=active]:shadow-none text-base data-[state=active]:font-semibold text-green font-normal transition"
              >
                Login
              </TabsTrigger>

              <TabsTrigger
                value="register"
                className="h-full data-[state=active]:bg-green data-[state=active]:text-white rounded-full data-[state=active]:shadow-none text-base data-[state=active]:font-semibold text-green font-normal transition"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Login />
            </TabsContent>

            <TabsContent value="register">
              <Register />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
