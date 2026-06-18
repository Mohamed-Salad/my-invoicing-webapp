import { db } from "@/db";
import { Pools } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { submitPayment } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/SubmitButton";
import { CheckCircle2 } from "lucide-react";
import { fmt } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ paid?: string }>;
};

export default async function PayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { paid } = await searchParams;

  const pool = await db.query.Pools.findFirst({
    where: eq(Pools.slug, slug),
  });

  if (!pool) notFound();

  if (pool.status === "closed") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-muted/30">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h1 className="text-xl font-bold mb-2">Pool is closed</h1>
          <p className="text-muted-foreground text-sm">
            This payment pool is no longer accepting payments.
          </p>
        </div>
      </main>
    );
  }

  if (paid === "true") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">You&apos;re in!</h1>
          <p className="text-muted-foreground">
            Payment recorded for{" "}
            <span className="font-semibold text-foreground">{pool.name}</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            @{pool.creatorUsername} will see your contribution.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-muted/20">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border bg-card shadow-sm p-7">
          <div className="mb-7">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Payment for
            </p>
            <h1 className="text-xl font-bold leading-snug">{pool.name}</h1>
            <p className="text-sm text-muted-foreground">@{pool.creatorUsername}</p>
            {pool.description && (
              <p className="text-sm text-muted-foreground mt-1">{pool.description}</p>
            )}
          </div>

          <form action={submitPayment} className="flex flex-col gap-4">
            <input type="hidden" name="poolId" value={pool.id} />
            <input type="hidden" name="slug" value={pool.slug} />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="payerName">Your Name</Label>
              <Input
                id="payerName"
                name="payerName"
                placeholder="e.g. Ahmed"
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">
                Amount (£)
                {pool.perPersonAmount && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    Suggested: {fmt(pool.perPersonAmount)}
                  </span>
                )}
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder={
                  pool.perPersonAmount
                    ? (pool.perPersonAmount / 100).toFixed(2)
                    : "0.00"
                }
                defaultValue={
                  pool.perPersonAmount
                    ? (pool.perPersonAmount / 100).toFixed(2)
                    : ""
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note">
                Note{" "}
                <span className="text-muted-foreground text-xs font-normal">(optional)</span>
              </Label>
              <Input id="note" name="note" placeholder="e.g. For June sessions" />
            </div>

            <SubmitButton>Chip In</SubmitButton>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Secured by ChipIn · No account needed
        </p>
      </div>
    </main>
  );
}
