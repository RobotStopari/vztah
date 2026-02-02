// Password hashing
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Date helpers
export function daysBetween(date) {
  const now = new Date();
  return Math.floor((date - now) / (1000 * 60 * 60 * 24));
}

export function formatDifference(days) {
  if (days === 0) return "Dnes!";
  if (days === 1) return "Zítra";
  if (days < 0) return `${-days} dní zpět`;
  return `Za ${days} dní`;
}

export function nextBirthday(month, day) {
  const now = new Date();
  let birthday = new Date(now.getFullYear(), month - 1, day);
  if (birthday < now) birthday.setFullYear(now.getFullYear() + 1);
  return birthday;
}

export function nextAnniversary(startDate) {
  const now = new Date();
  let year = now.getFullYear();
  let annDate = new Date(year, startDate.getMonth(), startDate.getDate());
  if (annDate < now) annDate.setFullYear(year + 1);
  const number = annDate.getFullYear() - startDate.getFullYear();
  return { date: annDate, number };
}
