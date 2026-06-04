export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const daysUntil = (date: Date) => {
  const today = startOfToday();
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Compare by UTC calendar day. The client encodes a date-only deadline as UTC
// midnight (new Date("YYYY-MM-DD").toISOString()), so comparing against the
// server's *local* midnight could reject a valid same-day deadline for users
// behind UTC. Normalizing both sides to a UTC day number avoids that.
const utcDayNumber = (date: Date) => {
  const d = new Date(date);
  return d.getUTCFullYear() * 10000 + d.getUTCMonth() * 100 + d.getUTCDate();
};

export const isPastDeadline = (date: Date) => utcDayNumber(new Date(date)) < utcDayNumber(new Date());
