export function slugify(inputString: any) {
  return inputString
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'Novemeber',
  'December',
];

export function formatDate(date: any) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();

  return `${day} ${monthNames[month]}, ${year}`;
}

/** Short month + day, e.g. "Jan 05" (Intl). */
export function formatShortMonthDay(date: Date | string | number = new Date()) {
  const jsDate = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
  }).format(jsDate);
}

/**
 * Laravel-style datetime for form fields: `yyyy-MM-dd HH:mm:ss`.
 * (Replaces the incorrect date-fns token string `yyyy-MM-dd H:i:s`.)
 */
export function formatDateTimeForInput(date: Date | string | number) {
  const jsDate = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(jsDate.getTime())) {
    return '';
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${jsDate.getFullYear()}-${pad(jsDate.getMonth() + 1)}-${pad(jsDate.getDate())}` +
    ` ${pad(jsDate.getHours())}:${pad(jsDate.getMinutes())}:${pad(jsDate.getSeconds())}`
  );
}

export function DateFormat(date: any) {
  const jsDate = new Date(date);

  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();
  return `${monthNames[month]} ${year}`;
}
