import {
  FromKeyCode as KTS_FromKeyCode,
  FunctionKeyCode as KTS_FunctionKeyCode,
  DeviceIdentifier as KTS_DeviceIdentifier,
  KarabinerProfile as KTS_KarabinerProfile,
  Rule as KTS_Rule,
} from 'karabiner.ts';

export interface KarabinerModsBase {
  fn_function_keys: { from: KTS_FunctionKeyCode; to: any }[];
  simple_modifications: { from: KTS_FromKeyCode }[];
}

export type KarabinerProfileDevice = KarabinerModsBase & {
  identifiers: KTS_DeviceIdentifier & {
    // make these non-optional
    product_id: number;
    vendor_id: number;
  };
};

export interface KarabinerComplexRule extends KTS_Rule {}

export type KarabinerProfile = KTS_KarabinerProfile & {
  devices: KarabinerProfileDevice[];
};

export interface KarabinerConfig {
  global: Object;
  profiles: KarabinerProfile[];
}
