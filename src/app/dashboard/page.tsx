import { db } from "@/db";
import { Pools, Payments } from "@/db/schema";
import { eq, sum, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-1 block">
            ← ChipIn
          </Link>
          <h1 className="text-3xl font-bold">Pools</h1>
        </div>
        <Button asChild>
          <Link href="/pools/new">
            <CirclePlus className="h-4 w-4 mr-2" />
            New Pool
          </Link>
        </Button>
      </div>

      {pools.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border rounded-xl">
          <p className="text-lg font-medium mb-2">No pools yet</p>
          <p className="text-sm mb-6">Create your first pool to start collecting payments.</p>
          <Button asChild>
            <Link href="/pools/new">Create a Pool</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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
                className="flex items-center justify-between rounded-xl border px-5 py-4 hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">{pool.name}</span>
                    <Badge
                      variant={pool.status === "active" ? "default" : "secondary"}
                      className="rounded-full text-xs"
                    >
                      {pool.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    @{pool.creatorUsername} ·{" "}
                    {new Date(pool.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                  <span className="font-semibold">
                    {fmt(collected)}{" "}
                    <span className="text-muted-foreground font-normal">/ {fmt(pool.totalAmount)}</span>
                  </span>
                  {outstanding > 0 ? (
                    <span className="text-xs text-destructive">{fmt(outstanding)} outstanding</span>
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
