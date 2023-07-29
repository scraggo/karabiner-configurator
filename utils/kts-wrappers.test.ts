import assert from 'assert/strict';
import { map, rule } from 'karabiner.ts';
// import { printJSON } from './log';
import { toComplexProfile, toSimpleProfile } from './kts-wrappers';

// ---
const rule1 = map(1).to(1);
const rulesArr = [map(2).to(2)];
const simple = toSimpleProfile([rule1, rulesArr]);
assert.deepEqual(simple, [
  {
    from: {
      key_code: '1',
    },
    to: {
      key_code: '1',
    },
  },
  {
    from: {
      key_code: '2',
    },
    to: {
      key_code: '2',
    },
  },
]);
console.log('✅ simple test');
// ---
const cRule = rule('').manipulators([map(3).to(3)]);
const complex = toComplexProfile([cRule]);
assert.equal(complex.length, 1);
assert.equal(complex[0].description, '');
assert.equal(complex[0].manipulators.length, 1);
assert.equal(complex[0].manipulators[0].from.key_code, '3');
assert.equal(complex[0].manipulators[0].to[0].key_code, '3');
console.log('✅ complex test');
// assert.deepEqual(complex, [
//   {
//     description: '',
//     manipulators: [
//       {
//         type: 'basic',
//         from: {
//           key_code: '3',
//         },
//         to: [
//           {
//             key_code: '3',
//           },
//         ],
//       },
//     ],
//   },
// ]);

// const flatRules = [rule1, rulesArr].flat();
// printJSON(flatRules.flatMap(toSimple));
// printJSON([rule1, rulesArr].flatMap(toSimple));
// printJSON(toSimpleProfile(rule1, rulesArr));
// printJSON(toSimpleRules(myRule1));
// printJSON(toSimpleRules(numberPad));
// printJSON([rulesArr, rule1].flat().map(toSimple));
// printJSON(layerProfile.map((rule) => rule.build()));
// printJSON(selectLayerProfile.map((rule) => rule.build()));
// printJSON(simplify(capsToEscape));
// printJSON(simplify(capsToEscape.build()));
// printJSON([number, func, capsToEscape, nav, mouse].flat().map(simplify));
