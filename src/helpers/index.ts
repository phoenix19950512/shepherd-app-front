import { format, isPast, isToday, isYesterday } from 'date-fns';

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const uid = (alphaNumeric = true, length = 10) => {
  let _length;

  if (length > 10) {
    _length = 10;
  } else if (length <= 0) {
    _length = 1;
  } else {
    _length = length;
  }

  return alphaNumeric
    ? Math.random()
        .toString(32)
        .slice(2, _length + 2)
    : Math.random()
        .toString()
        .slice(2, _length + 2);
};

export const getDateString = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (isPast(date)) {
    return format(date, 'do MMMM yyyy');
  }
  return '';
};

export const copierHandler = (copiedText = '', setSwitchView: any) => {
  navigator.clipboard.writeText(copiedText);
  setSwitchView(true);
  setTimeout(() => {
    setSwitchView(false);
  }, 700);
};
export const languages = [
  'English',
  'Spanish',
  'French',
  'Mandarin',
  'Portuguese',
  'Ukranian',
  'Arabic',
  'Hindi',
  'German',
  'Italian',
  'Turkish',
  'Vietnamese',
  'Swahili',
  'Polish'
] as const;
const getDateStringTest = (date: any) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options as any);
};
export function encodeQueryParams(
  params: Record<string, string | string[]>
): string {
  const encodedParams = Object.entries(params).map(([key, value]) => {
    if (Array.isArray(value)) {
      const encodedValue = value
        .map((item) => encodeURIComponent(item))
        .join(',');
      return `${encodeURIComponent(key)}=${encodedValue}`;
    } else {
      const encodedValue = encodeURIComponent(value);
      return `${encodeURIComponent(key)}=${encodedValue}`;
    }
  });

  return `?${encodedParams.join('&')}`;
}
export const arrangeDataByDate = (data: any) => {
  return data.reduce((acc, item) => {
    const date = item.createdAt.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};
