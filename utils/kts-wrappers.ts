import {
  layer,
  map,
  rule,
  withMapper,
  writeToProfile,
  NumberKeyValue,
} from 'karabiner.ts';

type Builder = { build: (...any) => any };

function wrapInRule(builder: Builder[]) {
  return rule('').manipulators(builder);
}

export function build(builder: Builder) {
  return builder.build();
}

function wrapAndBuild(builder: Builder[]) {
  return build(wrapInRule(builder));
}

/**
 * Pull out unneeded properties
 * @param builder - (private) BasicManipulatorBuilder
 */
export function toSimple(builder) {
  return wrapAndBuild(builder).manipulators.map((manipulator) => {
    const { description, type, ...rest } = manipulator as any;

    // delete from modifiers if undefined
    if ('from' in rest && !rest.from.modifiers) {
      delete rest.from.modifiers;
    }

    // delete to modifiers if undefined
    if ('to' in rest) {
      rest.to = rest.to.map((rawTo) => {
        const { modifiers } = rawTo;
        if (!modifiers) {
          delete rawTo.modifiers;
        }
        return rawTo;
      });
    }

    // make to an object instead of array of length 1
    if ('to' in rest && rest.to.length === 1) {
      rest.to = rest.to[0];
    }
    return rest;
  });
}

/**
 * Map (private) BasicManipulatorBuilder collection to Karabiner-readable array
 * @param rules BasicManipulatorBuilder[]
 */
export function toSimpleProfile(rules: Builder | (Builder | Builder[])[]) {
  if (Array.isArray(rules)) {
    return rules.flatMap(toSimple);
  }

  return toSimple(rules);
}

/**
 * Map (private) BasicRuleBuilder collection to Karabiner-readable array
 * @param rules BasicRuleBuilder[]
 */
export function toComplexProfile(rules: Builder[]) {
  return rules.flatMap(build);
}

export function writeExample() {
  // ! Change '--dry-run' to your Karabiner-Elements Profile name.
  // (--dry-run print the config json into console)
  // + Create a new profile if needed.
  writeToProfile('--dry-run', [
    // It is not required, but recommended to put symbol alias to layers,
    // (If you type fast, use simlayer instead, see https://evan-liu.github.io/karabiner.ts/rules/simlayer)
    // to make it easier to write '←' instead of 'left_arrow'.
    // Supported alias: https://github.com/evan-liu/karabiner.ts/blob/main/src/utils/key-alias.ts
    layer('/', 'symbol-mode').manipulators([
      //     / + [ 1    2    3    4    5 ] =>
      withMapper(['⌘', '⌥', '⌃', '⇧', '⇪'])((k, i) =>
        map((i + 1) as NumberKeyValue).toPaste(k)
      ),
      withMapper(['←', '→', '↑', '↓', '␣', '⏎', '⇥', '⎋', '⌫', '⌦', '⇪'])((k) =>
        map(k).toPaste(k)
      ),
    ]),

    rule('Key mapping').manipulators([
      // config key mappings
      map(1).to(1),
    ]),
  ]);
}
