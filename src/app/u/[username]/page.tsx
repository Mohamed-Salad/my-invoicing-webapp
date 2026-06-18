import { db } from "@/db";
import { Pools, Payments } from "@/db/schema";
import { eq, sum } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { fmt } from "@/lib/utils";

type Props = { params: Promise<{ username: string }> };

export default async function CreatorPage({ params }: Props) {
  const { username } = await params;

  const pools = await db
    .select({
      id: Pools.id,
      name: Pools.name,
      totalAmount: Pools.totalAmount,
      perPersonAmount: Pools.perPersonAmount,
      description: Pools.description,
      status: Pools.status,
      slug: Pools.slug,
      createdAt: Pools.createdAt,
      collected: sum(Payments.amount),
    })
    .from(Pools)
    .leftJoin(Payments, eq(Pools.id, Payments.poolId))
    .where(eq(Pools.creatorUsername, username))
    .groupBy(Pools.id)
    .orderBy(Pools.createdAt);

  if (pools.length === 0) notFound();

  const activePools = pools.filter((p) => p.status === "active");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
            {username[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">@{username}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activePools.length} active pool{activePools.length !== 1 ? "s" : ""}
          </p>
        </div>

        {activePools.length === 0 ? (
          <div className="text-center py-12 border rounded-xl text-muted-foreground">
            <p>No active pools at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activePools.map((pool) => {
              const collected = Number(pool.collected ?? 0);
              const pct =
                pool.totalAmount > 0
                  ? Math.min(100, Math.round((collected / pool.totalAmount) * 100))
                  : 0;

              return (
                <div key={pool.id} className="rounded-xl border p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold">{pool.name}</h2>
                      {pool.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{pool.description}</p>
                      )}
                    </div>
                    <Badge variant="default" className="rounded-full text-xs shrink-0">
                      active
                    </Badge>
                  </div>

                  {pool.perPersonAmount && (
                    <p className="text-sm text-muted-foreground">
                      Your share:{" "}
                      <span className="font-semibold text-foreground">
                        {fmt(pool.perPersonAmount)}
                      </span>
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {fmt(collected)} / {fmt(pool.totalAmount)}
                    </span>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/pay/${pool.slug}`}>Chip In →</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          <Link href="/" className="hover:text-foreground">
            Powered by ChipIn
          </Link>
        </p>
      </div>
    </main>
  );
}
