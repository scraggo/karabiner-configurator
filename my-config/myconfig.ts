import { toComplexProfile, toSimpleProfile } from '../utils/kts-wrappers';
import { KarabinerProfile, KarabinerProfileDevice } from '../utils/types';
import { Writer } from '../utils/writer';
import { func } from './func';
import { mouse } from './mouse';
import { nav } from './nav';
import { number } from './number';
import { layerProfile, selectLayerProfile, PROFILES } from './select-profile';
import { capsToEscape } from './simple';

export const DEVICES = {
  appleSmall: { product_id: 541, vendor_id: 1452 },
};

export const configWriter = new Writer();

/**
 * Convenience wrapper over a few `Writer` methods.
 * Provides the ability to build a single profile with simple, function key, and
 * complex modifications.
 */
const alterProfile = (
  profileName: KarabinerProfile['name'],
  deviceProps: undefined | KarabinerProfileDevice['identifiers'],
  mods: {
    simple?: any[];
    func?: any[];
    complex?: any[];
  }
) => {
  if (mods.simple) {
    configWriter.makeSimpleMods(profileName, mods.simple, deviceProps);
  }

  if (mods.func) {
    configWriter.makeFunctionMods(profileName, mods.func, deviceProps);
  }

  if (mods.complex) {
    configWriter.makeComplexMods(profileName, mods.complex);
  }
};

alterProfile(PROFILES.Main, DEVICES.appleSmall, {
  simple: toSimpleProfile(capsToEscape),
  func: toSimpleProfile(func),
  complex: toComplexProfile(selectLayerProfile),
});

alterProfile(PROFILES.Mouse, DEVICES.appleSmall, {
  simple: toSimpleProfile([capsToEscape, mouse]),
  func: toSimpleProfile(func),
  complex: toComplexProfile(selectLayerProfile),
});

alterProfile(PROFILES.Number, DEVICES.appleSmall, {
  simple: toSimpleProfile([capsToEscape, number]),
  func: toSimpleProfile(func),
  complex: toComplexProfile(selectLayerProfile),
});

alterProfile(PROFILES.Nav, DEVICES.appleSmall, {
  simple: toSimpleProfile([capsToEscape, nav]),
  func: toSimpleProfile(func),
  complex: toComplexProfile(layerProfile),
});
