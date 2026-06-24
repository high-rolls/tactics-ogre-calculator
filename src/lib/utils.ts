import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withDefault<T>(items: T[], defaultItem: T): T[] {
  return items.length ? items : [defaultItem]
}