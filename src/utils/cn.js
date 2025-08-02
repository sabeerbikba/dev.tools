import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join class names and merge Tailwind CSS classes.
 *
 * - Uses `clsx` to handle conditional and dynamic class names.
 * - Applies `tailwind-merge` to resolve conflicting Tailwind classes (e.g., `p-2 p-4` → `p-4`).
 *
 * @param inputs - Any number of class name values (strings, arrays, objects).
 * @returns A single merged class name string.
 */

export default (...inputs) => twMerge(clsx(inputs));
