/**
 * Convert a date to a relative time string (e.g., "5m ago", "2h ago")
 * @param {Date|string} date - The date to convert
 * @returns {string} Relative time string
 */
export const timeAgo = (date) => {
  const now = new Date();
  const time = new Date(date);
  const seconds = Math.floor((now - time) / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
};
