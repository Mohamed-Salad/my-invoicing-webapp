"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/ui/SubmitButton";
import { createPool } from "@/app/actions";
import Link from "next/link";
import { useState } from "react";

export default function NewPool() {
  const [totalAmount, setTotalAmount] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [username, setUsername] = useState("");

  const perPerson =
    totalAmount && numPlayers && parseInt(numPlayers) > 0
      ? (parseFloat(totalAmount) / parseInt(numPlayers)).toFixed(2)
      : null;

  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-1">Create a Pool</h1>
      <p className="text-muted-foreground mb-8">Share the link and track who chips in.</p>

      <form action={createPool} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="creatorUsername">Your Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
              /u/
            </span>
            <Input
              id="creatorUsername"
              name="creatorUsername"
              placeholder="mohamedS"
              className="pl-9"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Payers find your pools at{" "}
            <span className="font-medium text-foreground">/u/{cleanUsername || "username"}</span>.
            Letters, numbers and underscores only.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Pool Name</Label>
          <Input id="name" name="name" placeholder="e.g. June Football Sessions" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="totalAmount">Total Amount (£)</Label>
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="120.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="numPlayers">
              No. of Players{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="numPlayers"
              name="numPlayers"
              type="number"
              min="1"
              placeholder="12"
              value={numPlayers}
              onChange={(e) => setNumPlayers(e.target.value)}
            />
          </div>
        </div>

        {perPerson && (
          <div className="rounded-lg bg-muted px-4 py-3 text-sm">
            Each player owes <span className="font-semibold">£{perPerson}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            Description{" "}
            <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="e.g. Monthly 5-a-side at Faisal's Sports Centre"
          />
        </div>

        <SubmitButton>Create Pool</SubmitButton>
      </form>
    </main>
  );
}
