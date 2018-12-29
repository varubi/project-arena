import { Attribute } from "./attribute";
import { Entity } from "./entity";
import { Ability } from "./ability";
import { Dictionary } from "./util";
import { Effect } from "./effect";
import { Modifier, ModifierValue } from "./modifier";
import { Encounter } from "./encounter";
import { EffectContext } from "./context";
import { TimeUnit } from "./enums";
import { KVDB } from "./kvdb";
import { BaseClass } from "./base";

export class GameAdapter {
    attributes: Dictionary<Attribute> = {}
    effects: Dictionary<Effect> = {}
    abilities: Dictionary<Ability> = {}
    entities: KVDB<Entity>;
    encounter: Encounter;

    constructor(settings: GameAdapterSettings) {
        this.attributes = this.adaptAttributes(settings.attributes);
        this.effects = this.adaptEffects(settings.effects);
        this.abilities = this.adaptAbilities(settings.abilities, this.effects);
        this.entities = this.adaptEntities(settings.entities);
        this.encounter = new Encounter({ entities: this.entities });
    }

    adaptEntities(settings: Dictionary<JSONEntity>): KVDB<Entity> {
        const entities: KVDB<Entity> = new KVDB<Entity>();
        for (const key in settings) {
            const atts: Dictionary<Attribute> = {};
            for (const at in settings[key].attributes) {
                const entatt = settings[key].attributes[at];
                const attr = this.attributes[at];
                if (attr) {
                    atts[attr.oid.rootId] = attr.clone();
                    atts[attr.oid.rootId].value = (typeof entatt == 'number' ? entatt : entatt.value) || 0;
                }
            }

            entities.addOID(
                new Entity({
                    id: key,
                    name: settings[key].name,
                    attributes: KVDB.CreateFrom<Attribute>(atts),
                    abilities: this.refMap<Ability>(settings[key].abilities, this.abilities)
                })
            )
        }
        return entities;
    }

    adaptAttributes(settings: Dictionary<JSONAttribute>): Dictionary<Attribute> {
        const attributes: Dictionary<Attribute> = {};
        for (const key in settings)
            attributes[key] = new Attribute({
                id: key,
                name: settings[key].name,
                min: settings[key].min,
                max: settings[key].max
            });

        return attributes;
    }

    adaptAbilities(settings: Dictionary<JSONAbility>, effects: Dictionary<Effect>): Dictionary<Ability> {
        const abilities: Dictionary<Ability> = {};
        for (const key in settings) {
            abilities[key] = new Ability({
                id: key,
                name: settings[key].name,
                effects: this.refMap<Effect>(settings[key].effects, effects),
                triggerAction: true
            });
        }
        return abilities;
    }

    adaptEffects(settings: Dictionary<JSONEffect>): Dictionary<Effect> {
        const effects: Dictionary<Effect> = {};
        for (const key in settings) {
            effects[key] = new Effect({
                id: key,
                local: settings[key].local,
                modifiers: this.adaptModifier(settings[key].modifiers),
                priorty: { minor: 50, major: 50 },
                tick: TimeUnit.Immediate
            });
        }
        return effects;
    }

    adaptModifier(settings: Array<JSONModifier>): Array<Modifier> {
        return settings.map(m =>
            new Modifier({
                id: '',
                attribute: m.attribute,
                value: this.adaptModifierValues(m.value),
                priorty: { minor: 50, major: 50 }
            })
        )
    }

    adaptModifierValues(value: number | ModifierValue): ModifierValue {
        return <ModifierValue>(typeof value == 'number' ? (context: EffectContext) => value : value)
    }

    refMap<T>(ids: Array<JSONRef | string>, map: Dictionary<T & BaseClass>): KVDB<T> {
        const dict: KVDB<T> = new KVDB<T>();
        for (let i = 0; i < ids.length; i++) {
            const id: string = ids[i].hasOwnProperty('references') ? (<JSONRef>ids[i]).references : '';
            const obj = map[id]
            if (obj)
                dict.addOID(obj.clone());
        }
        return dict;
    }
}

interface GameAdapterSettings {
    entities: Dictionary<JSONEntity>
    attributes: Dictionary<JSONAttribute>
    abilities: Dictionary<JSONAbility>
    effects: Dictionary<JSONEffect>
}

interface JSONEntity {
    name: string
    attributes: Dictionary<number | JSONAttribute>
    abilities: Array<JSONRef>
}

interface JSONAttribute {
    name: string
    min: number
    max: number
    value?: number
}

interface JSONRef {
    references: string
}

interface JSONAbility {
    name: string
    effects: Array<JSONRef>
}

interface JSONEffect {
    tick: TimeUnit
    local?: any
    modifiers: Array<JSONModifier>,
    priorty: {
        major: number
        minor: number
    }
}
interface JSONModifier {
    attribute: string
    value: number | ModifierValue
}
