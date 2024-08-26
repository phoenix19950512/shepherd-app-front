import { firebaseAuth } from './firebase';
import { ToastId, createStandaloneToast } from '@chakra-ui/react';
import { isArray } from 'lodash';
import { DateTime, IANAZone } from 'luxon';
import moment, { Duration, Moment } from 'moment-timezone';

const { toast } = createStandaloneToast();

declare global {
  interface Window {
    networkErrorToast: ToastId;
  }
}

export const isProduction = process.env.NODE_ENV === 'production';

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export const ServiceFeePercentage = 0.05;

export const MinPasswordLength = 8;

export const getOptionValue = (
  opts: Array<{ value: any; label: any }>,
  val: any
) => {
  if (isArray(val)) {
    return opts.filter((o) => val.includes(o.value));
  }
  return opts.find((o) => o.value === val);
};

export const doFetch = async (
  input: RequestInfo,
  init?: RequestInit,
  showErrorMessage = false,
  initHeaders = {}
) => {
  const headers: HeadersInit = { ...initHeaders };

  const token = await firebaseAuth.currentUser?.getIdToken();
  headers['x-shepherd-header'] = 'vunderkind23';

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok && showErrorMessage) {
    if (window.networkErrorToast) {
      toast.close(window.networkErrorToast);
    }
    window.networkErrorToast = toast({
      title: 'An error occurred.',
      status: 'error',
      position: 'top',
      isClosable: true
    });
    throw response;
  }

  return response;
};
export const educationLevelOptions = [
  {
    label: 'Primary School Certificate',
    value: 'primary-school-cert'
  },
  {
    label: 'Junior Secondary School Certificate',
    value: 'junior-secondary-school-cert'
  },
  {
    label: 'Senior Secondary School Certificate',
    value: 'senior-secondary-school-cert'
  },
  {
    label: 'National Diploma (ND)',
    value: 'national-diploma'
  },
  {
    label: 'Higher National Diploma (HND)',
    value: 'higher-national-diploma'
  },
  {
    label: "Bachelor's Degree (BSc, BA, BEng, etc.)",
    value: 'bachelors-degree'
  },
  {
    label: "Master's Degree (MSc, MA, MEng, etc.)",
    value: 'masters-degree'
  },
  {
    label: 'Doctoral Degree (PhD, MD, etc.)',
    value: 'doctoral-degree'
  },
  {
    label: 'Vocational/Technical Certificate',
    value: 'vocation-technical-cert'
  }
];
interface Schedule {
  [day: string]: {
    begin: string;
    end: string;
  };
}

export const convertTimeToUTC = (time: string, tzIdentifier: string) => {
  // Parse the input time string
  const parsedTime = moment.tz(time, 'hh:mm A', tzIdentifier);

  // Convert the parsed time to UTC+0 with the same format
  const utcTime = parsedTime.utc().format('hh:mm A');

  return utcTime;
};

export const convertScheduleToUTC = (schedule: Schedule) => {
  const tzIdentifier = moment.tz.guess();
  const utcSchedule = {};

  for (const day in schedule) {
    if (schedule[day]) {
      const beginTime = schedule[day].begin;
      const endTime = schedule[day].end;

      const beginUTC = convertTimeToUTC(beginTime, tzIdentifier);
      const endUTC = convertTimeToUTC(endTime, tzIdentifier);

      utcSchedule[day] = {
        begin: beginUTC,
        end: endUTC
      };
    }
  }

  return utcSchedule;
};

export const numberToDayOfWeekName = (num: number, format = 'dddd') => {
  // Use the adjusted number to get the day of the week's name
  // 0 for Sunday, 1 for Monday and so on...
  return moment().day(num).format(format);
};
export const DayOfWeekNameToNumber = (num: number, format = 'dddd') =>
  moment().day(num).format(format);

export const convertUtcToUserTime = (utcTime) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the UTC time string using Moment.js
  const utcMoment = moment.utc(utcTime);

  // Convert the UTC time to the user's timezone
  const userMoment = utcMoment.tz(userTimezone);

  // Format the user's time in a desired format
  return userMoment.format('h:mm A');
};

export const convertTimeToDateTime = (time) => {
  if (!time) {
    return null;
  }
  const currentDate = new Date();

  // Regular expression to match different time formats
  const timeRegex =
    /^(\d{1,2}|0\d{1,2})(?::(\d{2}))?(?:\s)?(AM|PM)$|^(\d{1,2}|0\d{1,2})(AM|PM)$/i;
  const matches = time.match(timeRegex);

  if (!matches) {
    return null; // Invalid time format
  }

  let hours = parseInt(matches[1], 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const ampm = (matches[3] || '').toLowerCase();

  if (ampm === 'pm' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'am' && hours === 12) {
    hours = 0;
  }

  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours24 = String(currentDate.getHours()).padStart(2, '0');
  const minutesStr = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = '00';
  return `${year}-${month}-${day} ${hours24}:${minutesStr}:${seconds}`;
};

// Function to convert time from one timezone to another and format it as "5PM"
export const convertTimeToTimeZone = (inputTime, inputTimeZone) => {
  // Define an array of possible date/time formats
  const inputFormats = ['YYYY-MM-DDTHH:mm:ss.SSSZ', 'YYYY-MM-DD HH:mm:ss'];

  // Attempt to parse the input time using different formats
  const inputMoment = moment.tz(inputTime, inputFormats, inputTimeZone);

  if (!inputMoment.isValid()) {
    return 'Invalid input time format';
  }

  // Convert to the output timezone
  const outputMoment = inputMoment.clone().tz(moment.tz.guess());

  // Format the result as "5PM"
  const formattedTime = outputMoment.format('h:mmA');

  return formattedTime;
};

export const convertISOToCustomFormat = (isoString) => {
  const date = new Date(isoString);

  // Get date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Get time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Create the custom format
  const customFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return customFormat;
};

// // Example usage:
// const inputTime1 = '2023-10-03T09:30:00.000Z'; // ISO format
// const inputTime2 = '2023-10-03 09:30:00'; // Custom format
// const inputTime3 = '9AM'; // Custom format
// const inputTimeZone = 'America/New_York'; // Input timezone
// const outputTimeZone = 'Europe/London'; // Output timezone

// const formattedTime1 = convertTimeToTimeZone(
//   convertISOToCustomFormat(inputTime1),
//   inputTimeZone
// );
// const formattedTime2 = convertTimeToTimeZone(inputTime2, inputTimeZone);
// const formattedTime3 = convertTimeToTimeZone(
//   convertTimeToDateTime(inputTime3),
//   inputTimeZone
// );
// console.log(`Formatted time 1: ${formattedTime1}`);
// console.log(`Formatted time 2: ${formattedTime2}`);
// console.log(`Formatted time 3: ${formattedTime3}`);

export const convertToNewFormat = (scheduleData) => {
  const daysMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const convertedData = {};

  scheduleData.forEach((day) => {
    const dayIndex = daysMap[day.name];
    convertedData[dayIndex] = day.times.map((time) => ({
      begin: time.start,
      end: time.end
    }));
  });

  return convertedData;
};
export const convertToPreviousFormat = (convertedData) => {
  const daysArray = [
    { name: 'Sunday', times: [] },
    { name: 'Monday', times: [] },
    { name: 'Tuesday', times: [] },
    { name: 'Wednesday', times: [] },
    { name: 'Thursday', times: [] },
    { name: 'Friday', times: [] },
    { name: 'Saturday', times: [] }
  ];

  for (const dayIndex in convertedData) {
    const numericIndex = parseInt(dayIndex, 10); // Convert dayIndex to a number
    const dayTimes = convertedData[numericIndex];
    // const dayName = Object.keys(daysArray[numericIndex - 1])[0];
    const formattedTimes = dayTimes.map(
      (time: { begin: string; end: string }) => ({
        start: time.begin,
        end: time.end
      })
    );
    daysArray[numericIndex].times = formattedTimes;
  }
  return daysArray;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isSameWeek = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.round(Math.abs((date1 - date2) / oneDay));
  return diff <= 6 && date1.getDay() >= date2.getDay();
};

export const isSameMonth = (date1, date2) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const leadingZero = (num: number) => `0${num}`.slice(-2);

export const roundDate = (
  date: Date | Moment,
  duration: Duration,
  method: 'ceil'
) => {
  return moment(Math[method](+date / +duration) * +duration);
};
export const twoDigitFormat = (d: number) => {
  return d < 10 ? '0' + d.toString() : d.toString();
};

export const textTruncate = function (
  str: string,
  length: number,
  ending?: any
) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

export const getCroppedImg = (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx?.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const base64data = canvas?.toDataURL('image/jpeg', 1);
      resolve(base64data);
    };

    image.onerror = reject;
    image.src = imageSrc;
  });
};

export const languageOptions = [
  {
    id: 63,
    name: 'JavaScript (Node.js 12.14.0)',
    label: 'JavaScript (Node.js 12.14.0)',
    value: 'javascript'
  },
  {
    id: 45,
    name: 'Assembly (NASM 2.14.02)',
    label: 'Assembly (NASM 2.14.02)',
    value: 'assembly'
  },
  {
    id: 46,
    name: 'Bash (5.0.0)',
    label: 'Bash (5.0.0)',
    value: 'bash'
  },
  {
    id: 47,
    name: 'Basic (FBC 1.07.1)',
    label: 'Basic (FBC 1.07.1)',
    value: 'basic'
  },
  {
    id: 75,
    name: 'C (Clang 7.0.1)',
    label: 'C (Clang 7.0.1)',
    value: 'c'
  },
  {
    id: 76,
    name: 'C++ (Clang 7.0.1)',
    label: 'C++ (Clang 7.0.1)',
    value: 'cpp'
  },
  {
    id: 48,
    name: 'C (GCC 7.4.0)',
    label: 'C (GCC 7.4.0)',
    value: 'c'
  },
  {
    id: 52,
    name: 'C++ (GCC 7.4.0)',
    label: 'C++ (GCC 7.4.0)',
    value: 'cpp'
  },
  {
    id: 49,
    name: 'C (GCC 8.3.0)',
    label: 'C (GCC 8.3.0)',
    value: 'c'
  },
  {
    id: 53,
    name: 'C++ (GCC 8.3.0)',
    label: 'C++ (GCC 8.3.0)',
    value: 'cpp'
  },
  {
    id: 50,
    name: 'C (GCC 9.2.0)',
    label: 'C (GCC 9.2.0)',
    value: 'c'
  },
  {
    id: 54,
    name: 'C++ (GCC 9.2.0)',
    label: 'C++ (GCC 9.2.0)',
    value: 'cpp'
  },
  {
    id: 86,
    name: 'Clojure (1.10.1)',
    label: 'Clojure (1.10.1)',
    value: 'clojure'
  },
  {
    id: 51,
    name: 'C# (Mono 6.6.0.161)',
    label: 'C# (Mono 6.6.0.161)',
    value: 'csharp'
  },
  {
    id: 77,
    name: 'COBOL (GnuCOBOL 2.2)',
    label: 'COBOL (GnuCOBOL 2.2)',
    value: 'cobol'
  },
  {
    id: 55,
    name: 'Common Lisp (SBCL 2.0.0)',
    label: 'Common Lisp (SBCL 2.0.0)',
    value: 'lisp'
  },
  {
    id: 56,
    name: 'D (DMD 2.089.1)',
    label: 'D (DMD 2.089.1)',
    value: 'd'
  },
  {
    id: 57,
    name: 'Elixir (1.9.4)',
    label: 'Elixir (1.9.4)',
    value: 'elixir'
  },
  {
    id: 58,
    name: 'Erlang (OTP 22.2)',
    label: 'Erlang (OTP 22.2)',
    value: 'erlang'
  },
  {
    id: 44,
    label: 'Executable',
    name: 'Executable',
    value: 'exe'
  },
  {
    id: 87,
    name: 'F# (.NET Core SDK 3.1.202)',
    label: 'F# (.NET Core SDK 3.1.202)',
    value: 'fsharp'
  },
  {
    id: 59,
    name: 'Fortran (GFortran 9.2.0)',
    label: 'Fortran (GFortran 9.2.0)',
    value: 'fortran'
  },
  {
    id: 60,
    name: 'Go (1.13.5)',
    label: 'Go (1.13.5)',
    value: 'go'
  },
  {
    id: 88,
    name: 'Groovy (3.0.3)',
    label: 'Groovy (3.0.3)',
    value: 'groovy'
  },
  {
    id: 61,
    name: 'Haskell (GHC 8.8.1)',
    label: 'Haskell (GHC 8.8.1)',
    value: 'haskell'
  },
  {
    id: 62,
    name: 'Java (OpenJDK 13.0.1)',
    label: 'Java (OpenJDK 13.0.1)',
    value: 'java'
  },

  {
    id: 78,
    name: 'Kotlin (1.3.70)',
    label: 'Kotlin (1.3.70)',
    value: 'kotlin'
  },
  {
    id: 64,
    name: 'Lua (5.3.5)',
    label: 'Lua (5.3.5)',
    value: 'lua'
  },

  {
    id: 79,
    name: 'Objective-C (Clang 7.0.1)',
    label: 'Objective-C (Clang 7.0.1)',
    value: 'objectivec'
  },
  {
    id: 65,
    name: 'OCaml (4.09.0)',
    label: 'OCaml (4.09.0)',
    value: 'ocaml'
  },
  {
    id: 66,
    name: 'Octave (5.1.0)',
    label: 'Octave (5.1.0)',
    value: 'octave'
  },
  {
    id: 67,
    name: 'Pascal (FPC 3.0.4)',
    label: 'Pascal (FPC 3.0.4)',
    value: 'pascal'
  },
  {
    id: 85,
    name: 'Perl (5.28.1)',
    label: 'Perl (5.28.1)',
    value: 'perl'
  },
  {
    id: 68,
    name: 'PHP (7.4.1)',
    label: 'PHP (7.4.1)',
    value: 'php'
  },
  {
    id: 43,
    label: 'Plain Text',
    name: 'Plain Text',
    value: 'text'
  },
  {
    id: 69,
    name: 'Prolog (GNU Prolog 1.4.5)',
    label: 'Prolog (GNU Prolog 1.4.5)',
    value: 'prolog'
  },
  {
    id: 70,
    name: 'Python (2.7.17)',
    label: 'Python (2.7.17)',
    value: 'python'
  },
  {
    id: 71,
    name: 'Python (3.8.1)',
    label: 'Python (3.8.1)',
    value: 'python'
  },
  {
    id: 80,
    name: 'R (4.0.0)',
    label: 'R (4.0.0)',
    value: 'r'
  },
  {
    id: 72,
    name: 'Ruby (2.7.0)',
    label: 'Ruby (2.7.0)',
    value: 'ruby'
  },
  {
    id: 73,
    name: 'Rust (1.40.0)',
    label: 'Rust (1.40.0)',
    value: 'rust'
  },
  {
    id: 81,
    name: 'Scala (2.13.2)',
    label: 'Scala (2.13.2)',
    value: 'scala'
  },
  {
    id: 82,
    name: 'SQL (SQLite 3.27.2)',
    label: 'SQL (SQLite 3.27.2)',
    value: 'sql'
  },
  {
    id: 83,
    name: 'Swift (5.2.3)',
    label: 'Swift (5.2.3)',
    value: 'swift'
  },
  {
    id: 74,
    name: 'TypeScript (3.7.4)',
    label: 'TypeScript (3.7.4)',
    value: 'typescript'
  },
  {
    id: 84,
    name: 'Visual Basic.Net (vbnc 0.0.0.5943)',
    label: 'Visual Basic.Net (vbnc 0.0.0.5943)',
    value: 'vbnet'
  }
];

export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  csharp: '6.12.0',
  php: '8.2.3',
  ruby: '3.0.1',
  go: '1.16.2',
  rust: '1.68.2',
  swift: '5.3.3',
  kotlin: '1.8.20',
  scala: '3.2.2',
  perl: '5.34.0',
  lua: '5.4.4',
  dart: '2.19.6',
  r: '4.1.1',
  sql: '3.36.0'
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  ruby: `def greet(name)\n\tputs "Hello, #{name}!"\nend\n\ngreet('Alex')\n`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, Go!")\n}`,
  rust: `fn main() {\n\tprintln!("Hello, Rust!");\n}`,
  swift: `func greet(name: String) {\n\tprint("Hello, \\(name)!")\n}\n\ngreet(name: "Alex")\n`,
  kotlin: `fun main() {\n\tprintln("Hello, Kotlin!")\n}`,
  scala: `object HelloWorld {\n\tdef main(args: Array[String]): Unit = {\n\t\tprintln("Hello, Scala!")\n\t}\n}`,
  perl: `sub greet {\n\tmy $name = shift;\n\tprint "Hello, $name!\\n";\n}\n\ngreet("Alex");\n`,
  lua: `function greet(name)\n\tprint("Hello, " .. name .. "!")\nend\n\ngreet("Alex")\n`,
  dart: `void main() {\n\tprint("Hello, Dart!");\n}`,
  r: `greet <- function(name) {\n\tprint(paste("Hello,", name, "!"))\n}\n\ngreet("Alex")\n`,
  sql: `SELECT 'Hello, SQL!' AS message;`
};
