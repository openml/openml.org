import { clsx, type classNameValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: classNameValue[]) {
  return twMerge(clsx(inputs));
}
