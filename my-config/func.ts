import { map, FromAndToKeyCode, toKey, toConsumerKey } from 'karabiner.ts';

const funcKeyMap = [
  null, // null: map to itself
  null,
  toKey('mission_control'),
  null,
  null,
  null,
  null,
  null,
  null,
  toConsumerKey('mute'),
  toConsumerKey('volume_decrement'),
  toConsumerKey('volume_increment'),
];

export const func = funcKeyMap.map((k, i) => {
  const funcKey = `f${i + 1}` as FromAndToKeyCode;
  const to = k === null ? toKey(funcKey) : k;
  return map(funcKey).to(to);
});
