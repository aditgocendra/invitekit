import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function labelFromKey(key: string): string {
  const parts = key.match(/^[a-z]+|[A-Z][a-z]*|[0-9]+/g) ?? [key];
  const sentence = parts.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
