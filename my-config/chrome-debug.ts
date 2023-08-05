import { ifApp, map, rule, toKey } from 'karabiner.ts';

// if application is chrome:
const isChrome = ifApp('Chrome');

// pause / resume: F8, cmd \
const play = toKey('backslash', '⌘');

// step over: F10, cmd '
const stepOver = toKey('quote', '⌘');

// step in: F11, cmd ;
const stepIn = toKey('semicolon', '⌘');

// step out: sh F11, sh cmd ;
const stepOut = toKey('semicolon', '⌘⇧');

// step: F9
const step = toKey('f9');

// disable / enable breakpoints: cmd F8
const enable = toKey('f8', '⌘');

export const debuggerSteps = [
  rule('Chrome Debugger Actions').manipulators([
    map('keypad_0').to(play).condition(isChrome),
    map('keypad_period').to(stepOver).condition(isChrome),
    map('keypad_1').to(stepIn).condition(isChrome),
    map('keypad_2').to(stepOut).condition(isChrome),
    map('keypad_3').to(step).condition(isChrome),
    map('keypad_enter').to(enable).condition(isChrome),
  ]),
];
