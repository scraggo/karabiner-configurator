import { toComplexProfile, toSimpleProfile } from '../utils/kts-wrappers';
import { KarabinerProfileDevice } from '../utils/types';
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
  profileName: string,
  deviceProps: KarabinerProfileDevice['identifiers'],
  simpleMods?: any[],
  funcMods?: any[],
  complexMods?: any[]
) => {
  if (simpleMods) {
    configWriter.makeSimpleMods(
      {
        profileName,
        deviceProps,
      },
      simpleMods
    );
  }

  if (funcMods) {
    configWriter.makeFunctionMods(
      {
        profileName,
        deviceProps,
      },
      funcMods
    );
  }

  if (complexMods) {
    configWriter.makeComplexMods(
      {
        profileName,
      },
      complexMods
    );
  }
};

alterProfile(
  PROFILES.Main,
  DEVICES.appleSmall,
  toSimpleProfile(capsToEscape),
  toSimpleProfile(func),
  toComplexProfile(selectLayerProfile)
);

alterProfile(
  PROFILES.Mouse,
  DEVICES.appleSmall,
  toSimpleProfile([capsToEscape, mouse]),
  toSimpleProfile(func),
  toComplexProfile(selectLayerProfile)
);

alterProfile(
  PROFILES.Number,
  DEVICES.appleSmall,
  toSimpleProfile([capsToEscape, number]),
  toSimpleProfile(func),
  toComplexProfile(selectLayerProfile)
);

alterProfile(
  PROFILES.Nav,
  DEVICES.appleSmall,
  toSimpleProfile([capsToEscape, nav]),
  toSimpleProfile(func),
  toComplexProfile(layerProfile)
);

// writer.backupRootConfig();
// writer.writeToFile(testOutputPath);
// writer.overwriteRootConfig();
