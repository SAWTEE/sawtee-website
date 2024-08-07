import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function htmlToText(html) {
  if (html == null) return;
  return html.replace(/<[^>]+>/g, '');
}
