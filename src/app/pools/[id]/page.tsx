import { db } from "@/db";
import { Pools } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyButton } from "@/components/ui/CopyButton";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { addParticipant } from "@/app/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import { CheckCircle2, XCircle } from "lucide-react";
import { fmt } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function PoolDetail({ params }: Props) {
  const { id } = await params;
  const poolId = parseInt(id);
  if (isNaN(poolId)) notFound();

  const pool = await db.query.Pools.findFirst({
    where: eq(Pools.id, poolId),
    with: {
      participants: { orderBy: (p, { asc }) => [asc(p.name)] },
      payments: { orderBy: (p, { desc }) => [desc(p.createdAt)] },
    },
  });

  if (!pool) notFound();

  const totalCollected = pool.payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = Math.max(0, pool.totalAmount - totalCollected);
  const pct =
    pool.totalAmount > 0
      ? Math.min(100, Math.round((totalCollected / pool.totalAmount) * 100))
      : 0;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const shareUrl = `${baseUrl}/pay/${pool.slug}`;

  const paidNames = new Set(pool.payments.map((p) => p.payerName.toLowerCase().trim()));
  const participantsWithStatus = pool.participants.map((p) => ({
    ...p,
    paid: paidNames.has(p.name.toLowerCase().trim()),
  }));

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block transition-colors"
      >
        ← Dashboard
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl border bg-card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
        <CircularProgress
          pct={pct}
          label={fmt(totalCollected)}
          sublabel={`of ${fmt(pool.totalAmount)}`}
          size={180}
          strokeWidth={12}
        />

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{pool.name}</h1>
            <Badge
              variant={pool.status === "active" ? "default" : "secondary"}
              className="rounded-full"
            >
              {pool.status}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-5">
            @{pool.creatorUsername} ·{" "}
            {new Date(pool.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {pool.description && (
            <p className="text-sm text-muted-foreground mb-5">{pool.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/60 px-4 py-3">
              <div className="text-xs text-muted-foreground mb-0.5">Outstanding</div>
              <div
                className={`text-lg font-bold tabular-nums ${
                  outstanding > 0 ? "text-destructive" : "text-green-600"
                }`}
              >
                {fmt(outstanding)}
              </div>
            </div>
            <div className="rounded-xl bg-muted/60 px-4 py-3">
              <div className="text-xs text-muted-foreground mb-0.5">Payments</div>
              <div className="text-lg font-bold tabular-nums">{pool.payments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share link */}
      <div className="rounded-2xl border p-5 mb-8">
        <div className="text-sm font-medium mb-3">Share with your group</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-lg truncate">{shareUrl}</code>
          <CopyButton text={shareUrl} />
        </div>
        {pool.perPersonAmount && (
          <p className="text-xs text-muted-foreground mt-2">
            Suggested per player:{" "}
            <span className="font-semibold text-foreground">{fmt(pool.perPersonAmount)}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payments */}
        <div>
          <h2 className="text-base font-semibold mb-4">
            Payments Received{" "}
            <span className="text-muted-foreground font-normal">({pool.payments.length})</span>
          </h2>
          {pool.payments.length === 0 ? (
            <div className="border rounded-xl py-12 text-center text-sm text-muted-foreground">
              No payments yet
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pool.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {payment.payerName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{payment.payerName}</div>
                            {payment.note && (
                              <div className="text-xs text-muted-foreground">{payment.note}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm tabular-nums">
                        {fmt(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Players */}
        <div>
          <h2 className="text-base font-semibold mb-4">
            Expected Players{" "}
            <span className="text-muted-foreground font-normal">({pool.participants.length})</span>
          </h2>

          <form action={addParticipant} className="flex gap-2 mb-4">
            <input type="hidden" name="poolId" value={pool.id} />
            <Input name="name" placeholder="Player name" required className="flex-1 text-sm" />
            <Input
              name="amountOwed"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="£"
              className="w-20 text-sm"
              required
            />
            <SubmitButton>Add</SubmitButton>
          </form>

          {participantsWithStatus.length === 0 ? (
            <div className="border rounded-xl py-12 text-center text-sm text-muted-foreground">
              Add players above to track who&apos;s paid
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Owes</TableHead>
                    <TableHead className="text-center">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantsWithStatus.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              p.paid ? "bg-green-500" : "bg-destructive"
                            }`}
                          />
                          <span className="font-medium text-sm">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {fmt(p.amountOwed)}
                      </TableCell>
                      <TableCell className="text-center">
                        {p.paid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 inline" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive inline" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
