import { format, parseISO } from 'date-fns';

/**
 * Converts a string date to a beautiful date and time string.
 * 
 * @param dateString The date string to be formatted (format: "YYYY-MM-DDTHH:mm:ssTZD").
 * @returns A beautifully formatted date and time string.
 */
export function toBeautifulDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'EEEE, MMM dd, yyyy @ h:mm a'); // Outputs: "October 31, 2023, 8:00 AM"
}