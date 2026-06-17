import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Link2, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <span className="font-bold text-xl tracking-tight">ChipIn</span>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <div className="inline-flex items-center text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">
          No sign-up required for players
        </div>
        <h1 className="text-5xl font-bold max-w-2xl leading-tight tracking-tight">
          Split costs.<br />No awkward chasing.
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Create a payment pool, share a link with your group, and see exactly who&apos;s chipped in — and who hasn&apos;t.
        </p>
        <div className="flex gap-3 mt-2">
          <Button size="lg" asChild>
            <Link href="/pools/new">Create a Pool</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="border-t px-6 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Link2,
              title: "Shareable Link",
              desc: "One link for your whole group. Players pay without signing up.",
            },
            {
              icon: Users,
              title: "Track Players",
              desc: "Add expected players upfront or accept open payments from anyone.",
            },
            {
              icon: BarChart3,
              title: "Live Dashboard",
              desc: "See totals, outstanding balances, and payment history instantly.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
