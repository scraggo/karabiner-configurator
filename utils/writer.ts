import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

import {
  KarabinerConfig,
  KarabinerModsBase,
  KarabinerProfileDevice,
  KarabinerProfile,
  KarabinerComplexRule,
} from './types';

interface ProfileProps {
  profileName: KarabinerProfile['name'];
  deviceProps?: null | KarabinerProfileDevice['identifiers'];
}

export const ROOT_PATH = path.join(
  homedir(),
  '.config',
  'karabiner',
  'karabiner.json'
);

export const BACKUP_PATH = path.join(
  homedir(),
  '.config',
  'karabiner',
  'automatic_backups'
);

const KEY_MOD_FN = 'fn_function_keys';
const KEY_MOD_COMPLEX = 'complex_modifications';
const KEY_MOD_SIMPLE = 'simple_modifications';

const selectorsTop = {
  global: (config: KarabinerConfig) => config.global,
  profiles: (config: KarabinerConfig) => config.profiles,
};

const selectorsProfile = {
  name: (profile: KarabinerProfile) => profile.name,
  devices: (profile: KarabinerProfile) => profile.devices,
};

/**
All devices:
profiles[] > {} > simple_modifications{}
profiles[] > {} > fn_function_keys{}
profiles[] > {} > complex_modifications{} > rules[]

Specific device:
profiles[] > {} > devices[] > {} > simple_modifications{}
profiles[] > {} > devices[] > {} > fn_function_keys{}
(complex_modifications only for all devices)
*/
const modifyAt = {
  [KEY_MOD_SIMPLE]: (
    profile: KarabinerProfile | KarabinerProfileDevice,
    keysToWrite: object[]
  ) => {
    profile[KEY_MOD_SIMPLE] = keysToWrite;
  },

  [KEY_MOD_FN]: (
    profile: KarabinerProfile | KarabinerProfileDevice,
    keysToWrite: object[]
  ) => {
    profile[KEY_MOD_FN] = keysToWrite;
  },

  [KEY_MOD_COMPLEX]: (
    profile: KarabinerProfile,
    keysToWrite: KarabinerComplexRule[]
  ) => {
    profile[KEY_MOD_COMPLEX].rules = keysToWrite;
  },
};

export class Writer {
  /** Unmodified root config */
  karabinerPath: string;

  configJSON: string;
  config: KarabinerConfig;

  constructor(karabinerPath = ROOT_PATH) {
    this.karabinerPath = karabinerPath;
    this.configJSON = readFileSync(this.karabinerPath, { encoding: 'utf-8' });
    this.config = JSON.parse(this.configJSON);
  }

  findProfileByName(profileName: string) {
    const profile = selectorsTop
      .profiles(this.config)
      .find((p) => selectorsProfile.name(p) === profileName);

    if (!profile) {
      throw new Error(`Profile not found: ${profileName}`);
    }

    return profile;
  }

  findDeviceProfileByNameAndDeviceInfo(
    profileName: ProfileProps['profileName'],
    deviceProps: KarabinerProfileDevice['identifiers']
  ) {
    const profile = this.findProfileByName(profileName);
    const devices = selectorsProfile.devices(profile);
    const deviceProfile = devices.find(({ identifiers }) => {
      const { product_id, vendor_id } = identifiers;
      return (
        deviceProps.product_id === product_id &&
        deviceProps.vendor_id === vendor_id
      );
    });

    if (!deviceProfile) {
      throw new Error(
        `Device for profile not found. profileName: ${profileName}, deviceProps: ${JSON.stringify(
          deviceProps
        )}`
      );
    }

    return deviceProfile;
  }

  /**
   * Include `deviceProps` if only modifying keys for device
   */
  makeSimpleMods(
    profileName: KarabinerProfile['name'],
    simpleKeys: KarabinerModsBase['simple_modifications'],
    deviceProps?: KarabinerProfileDevice['identifiers']
  ) {
    const profile = deviceProps
      ? this.findDeviceProfileByNameAndDeviceInfo(profileName, deviceProps)
      : this.findProfileByName(profileName);

    return modifyAt[KEY_MOD_SIMPLE](profile, simpleKeys);
  }

  /**
   * Include `deviceProps` if only modifying keys for device
   */
  makeFunctionMods(
    profileName: KarabinerProfile['name'],
    funcKeys: KarabinerModsBase['fn_function_keys'],
    deviceProps?: KarabinerProfileDevice['identifiers']
  ) {
    const profile = deviceProps
      ? this.findDeviceProfileByNameAndDeviceInfo(profileName, deviceProps)
      : this.findProfileByName(profileName);

    return modifyAt[KEY_MOD_FN](profile, funcKeys);
  }

  makeComplexMods(
    profileName: KarabinerProfile['name'],
    complexKeys: KarabinerComplexRule[]
  ) {
    return modifyAt[KEY_MOD_COMPLEX](
      this.findProfileByName(profileName),
      complexKeys
    );
  }

  backupRootConfig(backupPath = BACKUP_PATH) {
    // this format is different from karabiner's YYYYMMDD format
    const dest = path.join(backupPath, `karabiner_${Date.now()}.json`);

    // fs.copyFile is broke
    writeFileSync(dest, this.configJSON, {
      encoding: 'utf-8',
    });

    console.log(`📃 Successful backup to ${dest}`);
  }

  writeToFile(fullFilepath: string) {
    console.log('✏️  Writing config to', fullFilepath);
    writeFileSync(fullFilepath, JSON.stringify(this.config, null, 4), {
      encoding: 'utf-8',
    });
    console.log('🎉 Success!');
  }

  /**
   * Overwrites Karabiner config with your modifications.
   * @param options Provide { backupPath: 'my-path' } for an alternate backup path or { backupPath: null } if you'd rather not back up the file.
   */
  overwriteRootConfig({ backupPath } = { backupPath: BACKUP_PATH }) {
    if (typeof backupPath === 'string') {
      this.backupRootConfig(backupPath);
    }
    this.writeToFile(this.karabinerPath);
  }
}
