function range(start: number, end: number): number[] {
  const isReverse = start > end;
  const targetLength = isReverse ? start - end + 1 : end - start + 1;
  const arr = new Array(targetLength);
  const b = Array.apply(null, arr);
  const result = b.map((discard, n) => {
    return isReverse ? n + end : n + start;
  });

  return isReverse ? result.reverse() : result;
}

function arrayResize(array: any[], integer: number) {
  const factor = array.length / integer;

  return Array.apply(null, { length: integer }).map(function (_: any, i: number) {
    return array[Math.floor(i * factor)];
  });
}

export function nextCron(emailsPerMonth: number) {
  const days = emailDays(emailsPerMonth);

  // if today is beyond the last day of the month then look ahead into the next month
  const nextDay = days.filter((x) => x >= new Date().getDate() + 1)[0] ?? days[0];

  return `5 0 ${nextDay} * *`;
}

export function emailDays(emailsPerMonth: number): number[] {
  return arrayResize(range(1, 31), emailsPerMonth);
}

export const err = (err) => {
  console.error(err);
  process.exit(1);
};

const lineWrap = (s: string, w: number) =>
  s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");
