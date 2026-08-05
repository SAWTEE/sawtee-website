export function slugify(inputString: any) {
  return inputString
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export const createExcerpt = (
  // @ts-ignore allowlist-migration
  content,
  // @ts-ignore allowlist-migration
  maxNumberOfWords,
  trailingIndicator = '...'
) => {
  const listOfWords = content.trim().split(' ');
  const truncatedContent = listOfWords.slice(0, maxNumberOfWords).join(' ');
  const excerpt = truncatedContent + trailingIndicator;
  const output = listOfWords.length > maxNumberOfWords ? excerpt : content;

  return output;
};

// export function filterByReference(arr1: any, arr2: any) {
//   let res = [];
//   res = arr1.filter((el: any) => {
//     return !arr2.find(element => {
//       return element.id === el.id;
//     });
//   });
//   return res;
// }

// export function toTitleCase(str: any) {
//   return str.replace(
//     /\w\S*/g,
//     txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//   );
// }

// @ts-ignore allowlist-migration
export const createArrayRange = (startingNumber, endingNumber, step = 1) =>
  Array.from(
    { length: (endingNumber - startingNumber) / step + 1 },
    (value: any, index: any) => startingNumber + index * step
  );

// @ts-ignore allowlist-migration
export const fetcher = async url => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    // @ts-ignore allowlist-migration
    error.info = await res.json();
    // @ts-ignore allowlist-migration
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function splitPosts(data: any) {
  // @ts-ignore allowlist-migration
  const firstThreePosts = [];
  // @ts-ignore allowlist-migration
  const otherPosts = [];

  data.forEach((item: any, idx: any) => {
    if (idx < 3) firstThreePosts.push(item);
    else otherPosts.push(item);
  });

  // @ts-ignore allowlist-migration
  return [firstThreePosts, otherPosts];
}

// export const formatedDate = (date: any) => dayjs(date).fromNow();

// export function formatDateWithMoment(date: any, format: any) {
//   return dayjs(date).format(format ? format : "MMM DD, YYYY");
// }

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

// @ts-ignore allowlist-migration
const formatDay = day => {
  const dayString = day.toString();
  const lastLetter = dayString[dayString.length - 1];
  let result;
  switch (lastLetter) {
    case '1':
      result = `${day}<sup>st</sup>`;
      break;
    case '2':
      result = `${day}<sup>nd</sup>`;
      break;
    case '3':
      result = `${day}<sup>rd</sup>`;
      break;
    default:
      result = `${day}<sup>th</sup>`;
      break;
  }
  return result;
};

export function formatedDate(date: any) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();

  return `${formatDay(day)} ${monthNames[month]}, ${year}`;
}

export function formatDate(date: any) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();

  return `${day} ${monthNames[month]}, ${year}`;
}

export function DateFormat(date: any) {
  const jsDate = new Date(date);

  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();
  return `${monthNames[month]} ${year}`;
}

export function isUrl(str: any) {
  // let regexp =
  //   /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/;
  const regexp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]+)*\/?$/;
  return regexp.test(str);
}

export function debounce(fn: any) {
  // @ts-ignore allowlist-migration
  let queued = null;
  return [
    // @ts-ignore allowlist-migration
    (...args) => {
      // @ts-ignore allowlist-migration
      if (queued) cancelAnimationFrame(queued);
      queued = requestAnimationFrame(fn.bind(fn, ...args));
    },
    () => {
      // @ts-ignore allowlist-migration
      cancelAnimationFrame(queued);
    },
  ];
}
