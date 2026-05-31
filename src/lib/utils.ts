import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * WhatsApp নাম্বার normalize করে।
 * "01711-223344", "+88 01711 223344", "8801711223344" → সব হবে "1711223344"
 * এতে একই ব্যক্তি ফরম্যাট বদলে দুইবার ফর্ম দিতে পারবে না।
 */
export function normalizeWhatsapp(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "") // শুধু সংখ্যা
  if (digits.startsWith("880")) digits = digits.slice(3) // BD country code
  else if (digits.startsWith("88")) digits = digits.slice(2)
  if (digits.startsWith("0")) digits = digits.slice(1) // leading zero
  return digits
}
