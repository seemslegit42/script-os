
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It also merges Tailwind CSS classes without style conflicts.
 * @param {...ClassValue[]} inputs - A list of class names or conditional class objects.
 * @returns {string} The combined and merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
