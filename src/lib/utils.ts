/**
 * Utility function to conditionally join CSS class names.
 * Filters out falsy values and joins the remaining with spaces.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}
