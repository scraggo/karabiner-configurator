# karabiner-ts-multi-profile

## Why this repo?

Building on what's provided by [karabiner.ts](https://github.com/evan-liu/karabiner.ts), I'm generating my [Karabiner-Elements](https://karabiner-elements.pqrs.org/) `karabiner.json` config programmatically. To fit my use cases, I added utilities to

- create simple and function key modifications
- add modifications to multiple profiles and optionally devices within

[This post](https://www.scraggo.com/karabiner-ts-multi-profile/) goes more into my motivations for building this and has more general research on Karabiner-Elements.

`karabiner.ts` deserves a shoutout for providing a fantastic developer experience. It allows you to concisely create modifications with auto-completion  thanks to very through TypeScript typings. Given that and it's high-level of parity with Karabiner features, I recommend it highly!

Also check out [the other external Karabiner JSON generators](https://karabiner-elements.pqrs.org/docs/json/external-json-generators/).

## How to use

### Getting started

Prerequisites:

- Install [Karabiner-Elements](https://karabiner-elements.pqrs.org/)
- In the Karabiner-Elements UI, create profiles with names that exactly match what you'll be writing
- Optional: Get the `product_id` and `vendor_id` for any devices you'll want to modify
- Fork this repo, run `npm install`

Then, make customizations in the `my-config` directory.

Commands in `package.json`:

```sh
# Generate test output in the my-config/test-output directory
npm run test

# Overwrite root karabiner.json file with my config
npm run write
```

You'd probably want to take some time to explore and make your modifications before running the `write` command!

### Overview

The majority of the files in the `my-config` directory utilize `karabiner.ts` to create simple modifications. Taking a look at `my-config/simple.ts` might be a good place to start.

The `my-config/myconfig.ts` file uses what's in the `utils` directory to finalize modifications. Here's a sample that writes `caps_lock` to `escape`, my preferred function key assignments, and a complex modification that runs the karabiner cli to switch a profile:

```ts
import { toComplexProfile, toSimpleProfile } from '../utils/kts-wrappers';
import { KarabinerProfileDevice } from '../utils/types';
import { Writer } from '../utils/writer';
import { func } from './func';
import { selectLayerProfile } from './select-profile';
import { capsToEscape } from './simple';

export const DEVICES = {
  appleSmall: { product_id: 541, vendor_id: 1452 },
};

export const configWriter = new Writer();

export const alterProfile = (
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
  'Main',
  DEVICES.appleSmall,
  toSimpleProfile(capsToEscape),
  toSimpleProfile(func),
  toComplexProfile(selectLayerProfile)
);
```

### `toComplexProfile` and `toSimpleProfile`

These functions are imported from `utils/kts-wrappers.ts`.

- `toComplexProfile` is a light wrapper to build an array of complex rules.
- `toSimpleProfile` has a little more going on. Since `simple_modifications` aren't provided out of the box with `karabiner.ts`, this function takes a single mod or array of mods, peels out the unneeded complex properties ("description", "manipulators", "type", etc), and returns an array of simple objects like what's shown below:

```json
[
  {
    "from": {
      "key_code": "SOME_KEY"
    },
    "to": {
      "key_code": "SOME_OTHER_KEY"
    }
  }
]
```

Note: There are limits on the capabilities of `simple_modifications`. Documentation is lacking on them, so proceed with caution.

### Writer

The `Writer` class (imported from `utils/writer.ts`) is used in lieu of `writeToProfile` provided by `karabiner.ts`. Initializing an instance of `Writer` puts your current Karabiner config into memory. The methods provided by an instance of `Writer` modify that instance - nothing is "saved" until one of the `write...` functions is called.

The `alterProfile` function above is a convenience wrapper over a few `Writer` methods. It provides the ability to build a single profile with simple, function key, and complex modifications.

After your modifications are in place, you'll probably want to test them out. Use `writeToFile` to output a JSON file to a given path:

```ts
import path from 'path';
import { Writer } from '../utils/writer';

export const configWriter = new Writer();

// ... make your modifications ...

const testOutputPath = path.resolve(
  '.',
  'my-config',
  'test-output',
  '_root.json'
);

configWriter.writeToFile(testOutputPath);
```

Use `overwriteRootConfig()` to finish the job. It writes the in-memory modifications to disk at the default `karabiner.json` path:

```ts
configWriter.overwriteRootConfig();
```

This function automatically generates a backup.

Note: The time-stamp for the backup file format is what's provided by `Date.now()`: `Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).` Example: `~/.config/karabiner/automatic_backups/karabiner_1690062724842.json` (This is different from Karabiner's `YYYYMMDD` format.)

If for some reason you want to create just a back up the root config, you can run:

```ts
configWriter.backupRootConfig();
```
