import { map, FromKeyCode, rule } from 'karabiner.ts';

const KARABINER_CLI =
  '/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli';

export const PROFILES = {
  Main: 'Main',
  Mouse: 'Mouse',
  Nav: 'Nav',
  Number: 'Number',
};

const createDescription = (from: string, name: string) =>
  `${from} -> select profile: ${name}`;

const createProfileSelector = (fromKey: FromKeyCode, profileName: string) =>
  rule(createDescription(fromKey, profileName)).manipulators([
    map(fromKey).to$(`'${KARABINER_CLI}' --select-profile '${profileName}'`),
  ]);

// This profile goes into all the layers
export const selectLayerProfile = [createProfileSelector('f1', PROFILES.Nav)];

export const layerProfile = [
  // The rest go into the layer selection profile
  createProfileSelector('f1', PROFILES.Main),
  createProfileSelector('f2', PROFILES.Mouse),
  createProfileSelector('f3', PROFILES.Number),
];
