import { Encounter } from "./encounter";
import { Entity } from "./entity";
import { Ability } from "./ability";
import { Timekeeper } from "./timekeeper";
import { History } from "./history";
import { Effect } from "./effect";

export class Context {
    encounter: Encounter
    history: History;
    timekeeper: Timekeeper

    constructor(settings: ContextSettings) {
        const { encounter, timekeeper, history } = settings;
        this.history = history;
        this.encounter = encounter;
        this.timekeeper = timekeeper;
    }

    entityContext(settings: EntityContextSettings): EntityContext {
        return new EntityContext(this, settings);
    }

    static EntityContext(context: Context, settings: EntityContextSettings): EntityContext {
        return new EntityContext(context, settings);
    }

    abilityContext(settings: AbilityContextSettings): AbilityContext {
        return new AbilityContext(this, settings);
    }

    static AbilityContext(context: Context, settings: AbilityContextSettings): AbilityContext {
        return new AbilityContext(context, settings);
    }
}

export class EntityContext extends Context {
    entity: Entity;

    constructor(context: Context, settings: EntityContextSettings) {
        super(context);
        const { entity } = settings;
        this.entity = entity;
    }

    abilityContext(settings: AbilityEntityContextSettings): AbilityContext {
        return new AbilityContext(this, {
            source: this.entity,
            target: settings.target,
            ability: settings.ability
        });
    }

    AbilityContext(context: EntityContext, settings: AbilityEntityContextSettings): AbilityContext {
        return new AbilityContext(context, {
            source: context.entity,
            target: settings.target,
            ability: settings.ability
        });
    }
}

export class AbilityContext extends Context {
    ability: Ability;
    source: Entity;
    target: Entity;

    constructor(context: Context, settings: AbilityContextSettings) {
        super(context);
        const { ability, source, target } = settings;
        this.ability = ability;
        this.source = source;
        this.target = target || source;
    }
    effectContext(settings: EffectContextSettings) {
        return new EffectContext(this, settings)
    }
    EffectContext(context: AbilityContext, settings: EffectContextSettings) {
        return new EffectContext(context, settings);
    }
}

export class EffectContext extends AbilityContext {
    effect: Effect;
    constructor(context: AbilityContext, settings: EffectContextSettings) {
        super(context, context);
        this.effect = settings.effect;
    }
}

interface ContextSettings {
    encounter: Encounter
    timekeeper: Timekeeper
    history: History
    entity?: Entity
}

interface EntityContextSettings {
    entity: Entity
}

interface AbilityEntityContextSettings {
    ability: Ability
    target?: Entity
}

interface AbilityContextSettings {
    ability: Ability
    source: Entity
    target?: Entity
}

interface EffectContextSettings {
    effect: Effect;
}