"use server";
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { Pools, Participants, Payments } from '@/db/schema';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

function parsePence(raw: FormDataEntryValue | null): number {
  const val = parseFloat((raw as string) ?? '');
  if (isNaN(val) || val < 0) throw new Error('Invalid amount — must be a positive number');
  return Math.round(val * 100);
}

function requireString(raw: FormDataEntryValue | null, field: string): string {
  const val = (raw as string | null)?.trim() ?? '';
  if (!val) throw new Error(`${field} is required`);
  return val;
}

export async function createPool(formData: FormData) {
  const name = requireString(formData.get('name'), 'Pool name');
  const creatorUsername = requireString(formData.get('creatorUsername'), 'Username')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  const description = (formData.get('description') as string | null)?.trim() || null;
  const totalAmount = parsePence(formData.get('totalAmount'));
  const numPlayersRaw = formData.get('numPlayers') as string;
  const slug = randomBytes(6).toString('hex');

  const numPlayers = numPlayersRaw ? parseInt(numPlayersRaw) : null;
  const perPersonAmount =
    numPlayers && numPlayers > 0 && totalAmount > 0
      ? Math.round(totalAmount / numPlayers)
      : null;

  const [pool] = await db
    .insert(Pools)
    .values({ name, description, totalAmount, perPersonAmount, creatorUsername, slug })
    .returning({ id: Pools.id });

  redirect(`/pools/${pool.id}`);
}

export async function addParticipant(formData: FormData) {
  const poolId = parseInt(formData.get('poolId') as string);
  if (isNaN(poolId)) throw new Error('Invalid pool');
  const name = requireString(formData.get('name'), 'Player name');
  const amountOwed = parsePence(formData.get('amountOwed'));

  await db.insert(Participants).values({ poolId, name, amountOwed });
  redirect(`/pools/${poolId}`);
}

export async function submitPayment(formData: FormData) {
  const poolId = parseInt(formData.get('poolId') as string);
  if (isNaN(poolId)) throw new Error('Invalid pool');
  const payerName = requireString(formData.get('payerName'), 'Your name');
  const amount = parsePence(formData.get('amount'));
  const note = (formData.get('note') as string | null)?.trim() || null;
  const slug = requireString(formData.get('slug'), 'slug');

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
    note,
    participantId: matched?.id ?? null,
  });

  redirect(`/pay/${slug}?paid=true`);
}
