import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck, Users } from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    title: "Learn with purpose",
    description: "Access structured courses designed to support meaningful Islamic learning.",
  },
  {
    icon: CalendarCheck,
    title: "Stay on track",
    description: "Manage your classes, timetable, assignments, and attendance in one place.",
  },
  {
    icon: Users,
    title: "Learn together",
    description: "Connect students and tutors through a simple, supportive learning experience.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-offwhite text-high">
      <header className="border-b border-shade-1 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" aria-label="Durar Academy home" className="relative block h-10 w-32">
            <Image src="/logo-green.svg" alt="Durar Academy" fill priority className="object-contain object-left" />
          </Link>

          <nav className="flex items-center gap-3" aria-label="Authentication">
            <Link href="/auth" className="rounded-full px-4 py-2 text-sm font-medium text-green transition hover:bg-green/5">
              Log in
            </Link>
            <Link href="/auth" className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange/90">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-orange">Welcome to Durar Academy</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-green sm:text-5xl lg:text-6xl">
            Learn, grow, and stay connected from the comfort of home.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-low sm:text-lg">
            A focused learning platform for students, tutors, and families to manage Islamic education with confidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/auth" className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3.5 font-semibold text-white transition hover:bg-green/90">
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth" className="rounded-full border border-green px-6 py-3.5 font-semibold text-green transition hover:bg-green/5">
              Sign in
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-green p-8 shadow-xl sm:p-12">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange/30" />
          <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full border-[24px] border-white/10" />
          <div className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-sm font-medium text-orange">Your learning journey</p>
            <p className="mt-4 text-3xl font-semibold leading-tight text-white">Everything you need to make every class count.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80">
              <div className="rounded-xl bg-white/10 p-4">Courses</div>
              <div className="rounded-xl bg-white/10 p-4">Timetable</div>
              <div className="rounded-xl bg-white/10 p-4">Assignments</div>
              <div className="rounded-xl bg-white/10 p-4">Progress</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-shade-1 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-14 md:grid-cols-3 lg:px-10">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-shade-1 bg-offwhite p-6">
              <Icon className="h-6 w-6 text-orange" />
              <h2 className="mt-5 text-lg font-semibold text-green">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-low">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
