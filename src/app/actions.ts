"use server";
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { Pools, Participants, Payments } from '@/db/schema';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

export async function createPool(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const totalAmount = Math.round(parseFloat(formData.get('totalAmount') as string) * 100);
  const numPlayersRaw = formData.get('numPlayers') as string;
  const hostName = formData.get('hostName') as string;
  const slug = randomBytes(4).toString('hex');

  const numPlayers = numPlayersRaw ? parseInt(numPlayersRaw) : null;
  const perPersonAmount = numPlayers && numPlayers > 0 ? Math.round(totalAmount / numPlayers) : null;

  const [pool] = await db.insert(Pools).values({
    name,
    description: description || null,
    totalAmount,
    perPersonAmount,
    hostName,
    slug,
  }).returning({ id: Pools.id });

  redirect(`/pools/${pool.id}`);
}

export async function addParticipant(formData: FormData) {
  const poolId = parseInt(formData.get('poolId') as string);
  const name = formData.get('name') as string;
  const amountOwed = Math.round(parseFloat(formData.get('amountOwed') as string) * 100);

  await db.insert(Participants).values({ poolId, name, amountOwed });

  redirect(`/pools/${poolId}`);
}

export async function submitPayment(formData: FormData) {
  const poolId = parseInt(formData.get('poolId') as string);
  const payerName = (formData.get('payerName') as string).trim();
  const amount = Math.round(parseFloat(formData.get('amount') as string) * 100);
  const note = formData.get('note') as string;
  const slug = formData.get('slug') as string;

  const participants = await db.query.Participants.findMany({
    where: eq(Participants.poolId, poolId),
  });
  const matched = participants.find(
    (p) => p.name.toLowerCase().trim() === payerName.toLowerCase()
  );

  await db.insert(Payments).values({
    poolId,
    payerName,
    amount,
    note: note || null,
    participantId: matched?.id ?? null,
  });

  redirect(`/pay/${slug}?paid=true`);
}
