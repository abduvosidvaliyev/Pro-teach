port { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs))
}

