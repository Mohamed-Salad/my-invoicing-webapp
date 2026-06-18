import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UsernameSearch } from "@/components/ui/UsernameSearch";
import { ArrowRight, Link2, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <span className="font-bold text-xl tracking-tight">ChipIn</span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="bg-foreground text-background px-6 pt-20 pb-28 flex flex-col items-center text-center gap-6">
        <span className="text-xs uppercase tracking-widest text-background/40 font-medium">
          No sign-up required for payers
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold max-w-3xl leading-[1.05] tracking-tight">
          Split costs.{" "}
          <span className="opacity-40">No awkward chasing.</span>
        </h1>

        <p className="text-background/60 text-lg max-w-md">
          Create a pool, share your link, and see exactly who&apos;s paid — in real time.
        </p>

        {/* Two paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-4 text-left">
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-200">
            <p className="text-xs uppercase tracking-widest text-background/40 font-medium">
              I&apos;m organising
            </p>
            <p className="text-background/70 text-sm leading-relaxed">
              Create a pool with your username. Share one link and track who chips in.
            </p>
            <Button asChild className="mt-auto bg-background text-foreground hover:bg-background/90">
              <Link href="/pools/new">
                Create a Pool <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-200">
            <p className="text-xs uppercase tracking-widest text-background/40 font-medium">
              I need to pay
            </p>
            <p className="text-background/70 text-sm leading-relaxed">
              Enter your organiser&apos;s username to find and pay their pool.
            </p>
            <div className="mt-auto">
              <UsernameSearch />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-b">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3 font-medium">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-center mb-14">Three steps to sorted</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create a Pool",
                desc: "Choose a username, set the total, and add how many players to split it across.",
              },
              {
                step: "02",
                icon: Link2,
                title: "Share the Link",
                desc: "Players open the link on their phone — no account, no app, just a name and amount.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Track in Real Time",
                desc: "Your dashboard shows collected vs outstanding with a live animated progress ring.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col gap-4 group">
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-muted-foreground/15 tabular-nums group-hover:text-muted-foreground/25 transition-colors">
                    {step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Ready to stop chasing?</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Takes 30 seconds. Your group pays without signing up.
        </p>
        <Button size="lg" asChild className="mt-2">
          <Link href="/pools/new">
            Create your first pool <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
