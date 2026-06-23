export function slugify(inputString) {
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
  content,
  maxNumberOfWords,
  trailingIndicator = '...'
) => {
  const listOfWords = content.trim().split(' ');
  const truncatedContent = listOfWords.slice(0, maxNumberOfWords).join(' ');
  const excerpt = truncatedContent + trailingIndicator;
  const output = listOfWords.length > maxNumberOfWords ? excerpt : content;

  return output;
};

// export function filterByReference(arr1, arr2) {
//   let res = [];
//   res = arr1.filter(el => {
//     return !arr2.find(element => {
//       return element.id === el.id;
//     });
//   });
//   return res;
// }

// export function toTitleCase(str) {
//   return str.replace(
//     /\w\S*/g,
//     txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
//   );
// }

export const createArrayRange = (startingNumber, endingNumber, step = 1) =>
  Array.from(
    { length: (endingNumber - startingNumber) / step + 1 },
    (value, index) => startingNumber + index * step
  );

export const fetcher = async url => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function splitPosts(data) {
  const firstThreePosts = [];
  const otherPosts = [];

  data.forEach((item, idx) => {
    if (idx < 3) firstThreePosts.push(item);
    else otherPosts.push(item);
  });

  return [firstThreePosts, otherPosts];
}

// export const formatedDate = (date) => dayjs(date).fromNow();

// export function formatDateWithMoment(date, format) {
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

export function formatedDate(date) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();

  return `${formatDay(day)} ${monthNames[month]}, ${year}`;
}

export function formatDate(date) {
  const jsDate = new Date(date);
  const day = jsDate.getDate();
  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();

  return `${day} ${monthNames[month]}, ${year}`;
}

export function DateFormat(date) {
  const jsDate = new Date(date);

  const month = jsDate.getMonth();
  const year = jsDate.getFullYear();
  return `${monthNames[month]} ${year}`;
}

export function isUrl(str) {
  // let regexp =
  //   /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-/]))?/;
  const regexp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]+)*\/?$/;
  return regexp.test(str);
}

export function debounce(fn) {
  let queued = null;
  return [
    (...args) => {
      if (queued) cancelAnimationFrame(queued);
      queued = requestAnimationFrame(fn.bind(fn, ...args));
    },
    () => {
      cancelAnimationFrame(queued);
    },
  ];
}
