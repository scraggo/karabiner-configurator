import { map } from 'karabiner.ts';

export const windowsToMacKeys = [
  map('left_command').to('left_option'),
  map('left_option').to('left_command'),
  map('right_option').to('right_command'),
];

export const capsToEscape = map('caps_lock').to('escape');
