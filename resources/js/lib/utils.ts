import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function htmlToText(html) {
  if (html == null) return;
  return html.replace(/<[^>]+>/g, '');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars except word, space, hyphen
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim(); // Remove extra whitespace
}
