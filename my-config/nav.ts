import { FromAndToKeyCode, ModifierParam, map } from 'karabiner.ts';

export const navMap: ReadonlyArray<
  [FromAndToKeyCode, FromAndToKeyCode, ModifierParam?]
> = [
  ['j', 'left_arrow'],
  ['k', 'down_arrow'],
  ['l', 'right_arrow'],
  ['i', 'up_arrow'],
  ['p', 'page_up'],
  ['semicolon', 'page_down'],
  ['y', 'home'],
  ['h', 'end'],

  // switch tabs
  ['u', 'left_arrow', ['left_command', 'left_option']],
  ['o', 'right_arrow', ['left_command', 'left_option']],
];

export const nav = navMap.map(([from, to, modifiers]) =>
  map(from).to(to, modifiers)
);
