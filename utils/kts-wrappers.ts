import { rule } from 'karabiner.ts';

type Builder = { build: (arg?: any) => any };

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
export function toSimple(builder: Builder[]) {
  return wrapAndBuild(builder).manipulators.map((manipulator) => {
    const { description, type, ...rest } = manipulator as any;

    // delete from modifiers if undefined
    if ('from' in rest && !rest.from.modifiers) {
      delete rest.from.modifiers;
    }

    // delete to modifiers if undefined
    if ('to' in rest) {
      rest.to = rest.to.map((rawTo: any) => {
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
    return rules.flatMap((r) =>
      Array.isArray(r) ? toSimple(r) : toSimple([r])
    );
  }

  return toSimple([rules]);
}

/**
 * Map (private) BasicRuleBuilder collection to Karabiner-readable array
 * @param rules BasicRuleBuilder[]
 */
export function toComplexProfile(rules: Builder[]) {
  return rules.flatMap(build);
}
