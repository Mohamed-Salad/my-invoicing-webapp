"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function UsernameSearch() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean) router.push(`/u/${clean}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g. mohamedS"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
      />
      <Button type="submit" variant="secondary" size="icon" className="shrink-0">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
