import { db } from "@/db";
import { Pools, Payments } from "@/db/schema";
import { eq, sum } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/CircularProgress";
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

  const activePools = pools.filter((p) => p.status === "active");

  if (pools.length === 0) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Creator header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-primary">
            {username[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 className="text-2xl font-bold">@{username}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activePools.length} active pool{activePools.length !== 1 ? "s" : ""}
          </p>
        </div>

        {activePools.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl text-muted-foreground">
            <p>No active pools right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activePools.map((pool) => {
              const collected = Number(pool.collected ?? 0);
              const pct =
                pool.totalAmount > 0
                  ? Math.min(100, Math.round((collected / pool.totalAmount) * 100))
                  : 0;

              return (
                <div key={pool.id} className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <CircularProgress pct={pct} size={72} strokeWidth={6} />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold leading-snug">{pool.name}</h2>
                      {pool.description && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {pool.description}
                        </p>
                      )}
                      {pool.perPersonAmount && (
                        <p className="text-sm mt-1">
                          Your share:{" "}
                          <span className="font-semibold">{fmt(pool.perPersonAmount)}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/pay/${pool.slug}`}>Chip In →</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-10">
          <Link href="/" className="hover:text-foreground transition-colors">
            Powered by ChipIn
          </Link>
        </p>
      </div>
    </main>
  );
}
