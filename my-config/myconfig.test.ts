import assert from 'assert';
import { writeFileSync } from 'fs';
import path from 'path';

import { toComplexProfile, toSimpleProfile } from '../utils/kts-wrappers';

import { configWriter, DEVICES } from './myconfig';

import { layerProfile, selectLayerProfile, PROFILES } from './select-profile';

import { debuggerSteps } from './chrome-debug';
import { func } from './func';
import { mouse } from './mouse';
import { nav } from './nav';
import { number } from './number';
// import shiftLayer from './shift';
import { capsToEscape, windowsToMacKeys } from './simple';

// run from repo root
[
  { name: 'layerProfile', data: toComplexProfile(layerProfile) },
  { name: 'selectLayerProfile', data: toComplexProfile(selectLayerProfile) },
  { name: 'func', data: toSimpleProfile(func) },
  { name: 'mouse', data: toSimpleProfile(mouse) },
  { name: 'nav', data: toSimpleProfile(nav) },
  { name: 'number', data: toSimpleProfile(number) },
  { name: 'capsToEscape', data: toSimpleProfile(capsToEscape) },
  { name: 'debuggerSteps', data: toComplexProfile(debuggerSteps) },
  // { name: 'shiftLayer', data: shiftLayer },
  // { name: 'windowsToMacKeys', data: windowsToMacKeys },
].forEach(({ name, data }) => {
  writeFileSync(
    path.resolve('my-config', 'test-output', `${name}.json`),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
});

// quick tests
Object.keys(PROFILES).map((profile) => {
  assert.ok(
    configWriter.findProfileByName(profile),
    `Profile not set in config: ${profile}`
  );
  assert.ok(
    configWriter.findDeviceProfileByNameAndDeviceInfo(
      profile,
      DEVICES.appleSmall
    ),
    `Device not found in profile: ${DEVICES.appleSmall}`
  );
  console.log(`✅ Valid Profile: ${profile}`);
});
// console.log(writer.findProfileByName(PROFILES.Mouse).name);
// console.log(
//   writer.findDeviceProfileByNameAndDeviceInfo(
//     PROFILES.Mouse,
//     DEVICES.appleSmall
//   ).identifiers
// );

const testOutputPath = path.resolve(
  '.',
  'my-config',
  'test-output',
  '_root.json'
);

configWriter.writeToFile(testOutputPath);
