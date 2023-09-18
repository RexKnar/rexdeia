import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names into one string and applies tailwind styles.
 *
 * @param {...ClassValue[]} inputs - The class names to join and apply styles to.
 * @return The merged and styled class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to titilize.
 * @return The string with the first letter capitalized.
 */
export function titilize(str: string) {
  return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to copy to the clipboard.
 */
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
