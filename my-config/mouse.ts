import { FromKeyCode, map, ToMouseKey } from 'karabiner.ts';

const createMouseMovement = (
  from: FromKeyCode,
  x?: number | null,
  y?: number | null
) => {
  const to = {} as ToMouseKey;

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
const createScroll = (
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

const DISTANCES = {
  long: 2000,
  med: 1200,
  short: 600,
};

const UP = {
  fast: createMouseMovement('i', null, -DISTANCES.long),
  med: createMouseMovement('i', null, -DISTANCES.med),
  slow: createMouseMovement('i', null, -DISTANCES.short),
};
const UP_LEFT = {
  fast: createMouseMovement('u', -DISTANCES.long, -DISTANCES.long),
  med: createMouseMovement('u', -DISTANCES.med, -DISTANCES.med),
  slow: createMouseMovement('u', -DISTANCES.short, -DISTANCES.short),
};
const UP_RIGHT = {
  fast: createMouseMovement('o', DISTANCES.long, -DISTANCES.long),
  med: createMouseMovement('o', DISTANCES.med, -DISTANCES.med),
  slow: createMouseMovement('o', DISTANCES.short, -DISTANCES.short),
};
const DOWN = {
  fast: createMouseMovement('comma', null, DISTANCES.long),
  med: createMouseMovement('comma', null, DISTANCES.med),
  slow: createMouseMovement('comma', null, DISTANCES.short),
};
const DOWN_LEFT = {
  fast: createMouseMovement('m', -DISTANCES.long, DISTANCES.long),
  med: createMouseMovement('m', -DISTANCES.med, DISTANCES.med),
  slow: createMouseMovement('m', -DISTANCES.short, DISTANCES.short),
};
const DOWN_RIGHT = {
  fast: createMouseMovement('period', DISTANCES.long, DISTANCES.long),
  med: createMouseMovement('period', DISTANCES.med, DISTANCES.med),
  slow: createMouseMovement('period', DISTANCES.short, DISTANCES.short),
};
const LEFT = {
  fast: createMouseMovement('j', -DISTANCES.long),
  med: createMouseMovement('j', -DISTANCES.med),
  slow: createMouseMovement('j', -DISTANCES.short),
};
const RIGHT = {
  fast: createMouseMovement('l', DISTANCES.long),
  med: createMouseMovement('l', DISTANCES.med),
  slow: createMouseMovement('l', DISTANCES.short),
};

export const mouse = [
  UP.slow,
  UP_LEFT.slow,
  UP_RIGHT.slow,
  DOWN.slow,
  DOWN_LEFT.slow,
  DOWN_RIGHT.slow,
  LEFT.slow,
  RIGHT.slow,

  // this is the main button, it's switched in my mac settings
  map('k').toPointingButton('button2'),

  // this is "right-click"
  map('k', ['left_control']).toPointingButton('button1'),

  map('left_shift').toMouseKey({
    speed_multiplier: 3.5,
  }),
  map('left_option').toMouseKey({
    speed_multiplier: 0.5,
  }),
  createScroll('y', 32), // left
  createScroll('h', -32), // right
  createScroll('p', null, -32), // up
  createScroll('semicolon', null, 32), // down
].flat();
