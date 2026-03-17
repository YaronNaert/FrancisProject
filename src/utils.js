export function clamp(n, min, max) {
  const x = Number.isFinite(n) ? n : min;
  return Math.min(max, Math.max(min, x));
}

export function format(n, digits = 0) {
  return new Intl.NumberFormat("nl-BE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export function nowDateNL() {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function diffYearsMonths(fromDate) {
  if (!fromDate) return { years: null, months: null };
  const d = new Date(fromDate);
  const now = new Date();

  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  const days = now.getDate() - d.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
  };
}

export function rerKcal(kg) {
  return 70 * Math.pow(kg, 0.75);
}

export function roundTo3kgBags(grams) {
  const kg = grams / 1000;
  return Math.ceil(kg / 3) * 3;
}