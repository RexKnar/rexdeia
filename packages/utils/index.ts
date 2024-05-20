import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const suffixes = [
  { suffix: 'T', threshold: 1e12 },
  { suffix: 'B', threshold: 1e9 },
  { suffix: 'M', threshold: 1e6 },
  { suffix: 'K', threshold: 1e3 },
  { suffix: '', threshold: 1 },
];

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

/**
 * Formats a number with a suffix based on the value of the number. The suffix corresponds to the
 * number's order of magnitude (e.g., K for thousands, M for millions, B for billions, and T for trillions).
 * If no valid suffix is found, the number is returned as it is. If the number modulus the threshold is 0,
 * the decimal places are omitted.
 *
 * @param {number} num The number to format.
 * @param {number} precision The number of decimal places in the formatted output. Defaults to 2.
 *
 * @returns {(string|number)} The number formatted with a suffix or the number if no matching suffix found.
 *
 * @example
 * formatNumberWithSuffix(1000) -> '1K'
 * formatNumberWithSuffix(5000000, 0) -> '5M'
 * formatNumberWithSuffix(1234) -> '1.23K'
 */
export function formatNumberWithSuffix(
  num: number,
  precision: number = 2
): string | number {
  const matchingSuffix = suffixes.find(
    (item) => Math.abs(num) >= item.threshold
  );

  if (!matchingSuffix) return num;

  const value = num / matchingSuffix.threshold;
  const hasDecimal = value % 1 !== 0;

  return hasDecimal
    ? value.toFixed(precision) + matchingSuffix.suffix
    : value.toFixed(0) + matchingSuffix.suffix;
}

export function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
