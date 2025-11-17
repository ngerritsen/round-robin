export const genArr = <T = any>(size: number, fill?: T) => {
  if (fill !== undefined) return Array(size).fill(fill);
  return Array.from(Array(size).keys());
};

export const inShuffle = (arr: number[]) => {
  const n = arr.length;
  const half = Math.ceil(n / 2);
  const left = arr.slice(0, half);
  const right = arr.slice(half);

  const result = [];

  for (let i = 0; i < Math.floor(n / 2); i++) {
    result.push(right[i], left[i]);
  }

  if (n % 2 !== 0) {
    result.push(left[half - 1]);
  }

  return result;
};

export const increment = (arr: number[]) => arr.map((n) => n + 1);
