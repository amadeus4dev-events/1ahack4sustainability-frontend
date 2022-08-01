/**
 * Transform a ISO 8601 duration string into a readable format
 * ISO 8601 describes a time (H, m, s) and a period (date, year).
 * This helper only returns the time information and cannot be used to format anything but a duration in Hours and minute.
 *
 * @param duration
 */
export function formatDuration(duration: string) {
  return duration.split('T')[1].replace('H', 'h ').toLowerCase();
}
