import { db } from "@/db";
import { Pools, Payments } from "@/db/schema";
import { eq, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { CirclePlus } from "lucide-react";
import { fmt } from "@/lib/utils";

export default async function Dashboard() {
  const pools = await db
    .select({
      id: Pools.id,
      name: Pools.name,
      totalAmount: Pools.totalAmount,
      creatorUsername: Pools.creatorUsername,
      status: Pools.status,
      slug: Pools.slug,
      createdAt: Pools.createdAt,
      collected: sum(Payments.amount),
    })
    .from(Pools)
    .leftJoin(Payments, eq(Pools.id, Payments.poolId))
    .groupBy(Pools.id)
    .orderBy(desc(Pools.createdAt));

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-1 block transition-colors">
            ← ChipIn
          </Link>
          <h1 className="text-3xl font-bold">Your Pools</h1>
        </div>
        <Button asChild>
          <Link href="/pools/new">
            <CirclePlus className="h-4 w-4 mr-2" />
            New Pool
          </Link>
        </Button>
      </div>

      {pools.length === 0 ? (
        <div className="text-center py-24 border rounded-2xl text-muted-foreground">
          <p className="text-lg font-medium mb-2">No pools yet</p>
          <p className="text-sm mb-6">Create your first pool to start collecting.</p>
          <Button asChild>
            <Link href="/pools/new">Create a Pool</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pools.map((pool) => {
            const collected = Number(pool.collected ?? 0);
            const outstanding = Math.max(0, pool.totalAmount - collected);
            const pct =
              pool.totalAmount > 0
                ? Math.min(100, Math.round((collected / pool.totalAmount) * 100))
                : 0;

            return (
              <Link
                key={pool.id}
                href={`/pools/${pool.id}`}
                className="group rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 p-5 flex gap-4 items-center"
              >
                <CircularProgress pct={pct} size={76} strokeWidth={7} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-sm truncate">{pool.name}</span>
                    <Badge
                      variant={pool.status === "active" ? "default" : "secondary"}
                      className="rounded-full text-xs"
                    >
                      {pool.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    @{pool.creatorUsername} ·{" "}
                    {new Date(pool.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-sm tabular-nums">{fmt(collected)}</span>
                    <span className="text-xs text-muted-foreground">/ {fmt(pool.totalAmount)}</span>
                  </div>
                  {outstanding > 0 ? (
                    <span className="text-xs text-destructive tabular-nums">
                      {fmt(outstanding)} outstanding
                    </span>
                  ) : (
                    <span className="text-xs text-green-600">Fully collected ✓</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
