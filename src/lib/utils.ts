import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(pence: number | null | undefined): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    (pence ?? 0) / 100
  );
}
