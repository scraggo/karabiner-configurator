import { map, FromKeyCode, NumberKeyValue } from 'karabiner.ts';

const keysToNums: FromKeyCode[] = [
  // array index = number
  'm',
  'j',
  'k',
  'l',
  'u',
  'i',
  'o',
  // the rest are already mapped
];

export const number = keysToNums.map((k, i) =>
  map(k).to((i + 1) as NumberKeyValue)
);
