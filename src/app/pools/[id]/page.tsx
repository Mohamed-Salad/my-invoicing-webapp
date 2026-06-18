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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← Dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold">{pool.name}</h1>
          <Badge variant={pool.status === "active" ? "default" : "secondary"} className="rounded-full">
            {pool.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          @{pool.creatorUsername} ·{" "}
          {new Date(pool.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {pool.description && (
          <p className="text-sm text-muted-foreground mt-1">{pool.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Expected", value: fmt(pool.totalAmount), highlight: false },
          { label: "Collected", value: fmt(totalCollected), sub: `${pct}%`, highlight: false },
          { label: "Outstanding", value: fmt(outstanding), highlight: outstanding > 0 },
          { label: "Payments", value: pool.payments.length.toString(), highlight: false },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div className={`text-xl font-bold ${highlight ? "text-destructive" : ""}`}>{value}</div>
            {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
          </div>
        ))}
      </div>

      {/* Share link */}
      <div className="rounded-xl border p-4 mb-8">
        <div className="text-sm font-medium mb-2">Share this link with your group</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md truncate">{shareUrl}</code>
          <CopyButton text={shareUrl} />
        </div>
        {pool.perPersonAmount && (
          <p className="text-sm text-muted-foreground mt-2">
            Suggested per player:{" "}
            <span className="font-medium">{fmt(pool.perPersonAmount)}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payments received */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Payments Received ({pool.payments.length})
          </h2>
          {pool.payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center border rounded-xl">
              No payments yet.
            </p>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pool.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">{payment.payerName}</div>
                        {payment.note && (
                          <div className="text-xs text-muted-foreground">{payment.note}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {fmt(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
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

        {/* Expected players */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Expected Players ({pool.participants.length})
          </h2>

          <form action={addParticipant} className="flex gap-2 mb-4">
            <input type="hidden" name="poolId" value={pool.id} />
            <Input name="name" placeholder="Player name" required className="flex-1" />
            <Input
              name="amountOwed"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="£"
              className="w-24"
              required
            />
            <SubmitButton>Add</SubmitButton>
          </form>

          {participantsWithStatus.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center border rounded-xl">
              Add players above to track who&apos;s paid.
            </p>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Owes</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantsWithStatus.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">{fmt(p.amountOwed)}</TableCell>
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
