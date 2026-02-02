// === FUNCTIONS ===
function nextBirthday(month, day) {
  const now = new Date();
  let year = now.getFullYear();
  let date = new Date(year, month - 1, day);
  if (date < now) date = new Date(year + 1, month - 1, day);
  return date;
}

function nextAnniversary(startDate) {
  const now = new Date();
  let year = now.getFullYear();
  let anniversary = new Date(year, startDate.getMonth(), startDate.getDate());
  let number = year - startDate.getFullYear();
  if (anniversary < now) {
    anniversary = new Date(year + 1, startDate.getMonth(), startDate.getDate());
    number += 1;
  }
  return { date: anniversary, number };
}

function daysBetween(date) {
  const now = new Date();
  return Math.round((date - now) / (1000 * 60 * 60 * 24));
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function fractionOfYear(diffDays) {
  const now = new Date();
  const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
  return (diffDays / daysInYear).toFixed(2).replace(".", ",");
}

function formatDifference(diffDays) {
  if (diffDays > 0) return `Za ${diffDays} dní (Za ${fractionOfYear(diffDays)} roku)`;
  if (diffDays < 0) return `Před ${Math.abs(diffDays)} dny`;
  return "Dnes";
}
