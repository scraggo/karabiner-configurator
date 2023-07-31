import { FromKeyCode, map, ToMouseKey } from 'karabiner.ts';

/** [x, y] */
type Multiplier = -1 | 1 | null;
type Multipliers = [Multiplier, Multiplier];

const DISTANCES = {
  long: 2000,
  med: 1200,
  short: 600,
};

const DIRECTIONS: Record<string, [Multiplier, Multiplier]> = {
  '↑': [null, -1],
  '↖': [-1, -1],
  '↗': [1, -1],
  '↓': [null, 1],
  '↙': [-1, 1],
  '↘': [1, 1],
  '←': [-1, null],
  '→': [1, null],
};

const moveBy = (multipliers: Multipliers, distance: number) =>
  multipliers.map((m) => (m ? m * distance : null));

const makeMouseKey = (
  from: FromKeyCode,
  multipliers: Multipliers,
  distance: number
) => {
  const to = {} as ToMouseKey;
  const [x, y] = moveBy(multipliers, distance);

  if (typeof x === 'number') {
    to.x = x;
  }
  if (typeof y === 'number') {
    to.y = y;
  }

  return map(from).toMouseKey(to);
};

/**
 * Example:
 * {
 *   "from": {
 *       "key_code": "h"
 *   },
 *   "to": {
 *       "mouse_key": {
 *           "horizontal_wheel": 32
 *       }
 *   }
 * },
 */
const makeMouseScroll = (
  from: FromKeyCode,
  x?: number | null,
  y?: number | null
) => {
  const to = {} as ToMouseKey;

  /*
  x > 0 goes LEFT
  x < 0 goes RIGHT
  y > 0 goes DOWN
  y < 0 goes UP
  */
  if (typeof x === 'number') {
    to.horizontal_wheel = x;
  }
  if (typeof y === 'number') {
    to.vertical_wheel = y;
  }

  return map(from).toMouseKey(to);
};

export const mouse = [
  makeMouseKey('u', DIRECTIONS['↖'], DISTANCES.short),
  makeMouseKey('i', DIRECTIONS['↑'], DISTANCES.short),
  makeMouseKey('o', DIRECTIONS['↗'], DISTANCES.short),
  makeMouseKey('j', DIRECTIONS['←'], DISTANCES.short),
  makeMouseKey('l', DIRECTIONS['→'], DISTANCES.short),
  makeMouseKey('m', DIRECTIONS['↙'], DISTANCES.short),
  makeMouseKey('comma', DIRECTIONS['↓'], DISTANCES.short),
  makeMouseKey('period', DIRECTIONS['↘'], DISTANCES.short),

  // this is the main button, it's switched in my mac settings
  map('k').toPointingButton('button2'),

  // this is "right-click"
  map('k', ['left_control']).toPointingButton('button1'),

  map('f').toMouseKey({
    speed_multiplier: 3.5,
  }),
  map('d').toMouseKey({
    speed_multiplier: 0.5,
  }),
  makeMouseScroll('y', 32), // left
  makeMouseScroll('h', -32), // right
  makeMouseScroll('p', null, -32), // up
  makeMouseScroll('semicolon', null, 32), // down
].flat();
