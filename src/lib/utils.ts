import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Confetti from 'react-dom-confetti';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
