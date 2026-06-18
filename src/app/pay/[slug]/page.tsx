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
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pool is closed</h1>
          <p className="text-muted-foreground">
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
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment recorded!</h1>
          <p className="text-muted-foreground">
            Thanks for chipping in to{" "}
            <span className="font-medium">{pool.name}</span>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">Payment for</p>
          <h1 className="text-2xl font-bold">{pool.name}</h1>
          <p className="text-sm text-muted-foreground">@{pool.creatorUsername}</p>
          {pool.description && (
            <p className="text-sm text-muted-foreground mt-1">{pool.description}</p>
          )}
        </div>

        <form action={submitPayment} className="flex flex-col gap-4">
          <input type="hidden" name="poolId" value={pool.id} />
          <input type="hidden" name="slug" value={pool.slug} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="payerName">Your Name</Label>
            <Input id="payerName" name="payerName" placeholder="e.g. Ahmed" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount (£)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder={pool.perPersonAmount ? (pool.perPersonAmount / 100).toFixed(2) : "0.00"}
              defaultValue={pool.perPersonAmount ? (pool.perPersonAmount / 100).toFixed(2) : ""}
              required
            />
            {pool.perPersonAmount && (
              <p className="text-xs text-muted-foreground">
                Suggested: {fmt(pool.perPersonAmount)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">
              Note <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input id="note" name="note" placeholder="e.g. For June sessions" />
          </div>

          <SubmitButton>Chip In</SubmitButton>
        </form>
      </div>
    </main>
  );
}
