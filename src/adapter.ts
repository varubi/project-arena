import { Attribute } from "./attribute";
import { Entity } from "./entity";
import { Ability } from "./ability";
import { KeyValuePair } from "./util";
import { Effect } from "./effect";
import { Modifier, ModifierValue } from "./modifier";
import { Encounter } from "./encounter";
import { EffectContext } from "./context";
import { TimeUnit } from "./enums";
import { Dictionary } from "./dictionary";
import { BaseClass } from "./base";

export function GameAdapter(settings: GameAdapterSettings): Encounter {
    const attributes = AttributeAdapter(settings.attributes);
    const effects = EffectAdapter(settings.effects);
    const abilities = AbilityAdapter(settings.abilities, effects);
    const entities = EntityAdapter(settings.entities, attributes, abilities);
    const encounter = new Encounter({ entities: entities });
    return encounter;
}
export function EntityAdapter(settings: KeyValuePair<JSONEntity>, attributes: KeyValuePair<Attribute>, abilities: KeyValuePair<Ability>): Dictionary<Entity> {
    const entities: Dictionary<Entity> = new Dictionary<Entity>();
    for (const key in settings) {
        const atts: KeyValuePair<Attribute> = {};
        for (const at in settings[key].attributes) {
            const entatt = settings[key].attributes[at];
            const attr = attributes[at];
            if (attr) {
                atts[attr.uuid.objectId] = attr.clone();
                atts[attr.uuid.objectId].value = (typeof entatt == 'number' ? entatt : entatt.value) || 0;
            }
        }

        entities.addUUID(
            new Entity({
                id: key,
                name: settings[key].name,
                attributes: Dictionary.CreateFrom<Attribute>(atts),
                abilities: refMap<Ability>(settings[key].abilities, abilities)
            })
        )
    }
    return entities;
}
export function AttributeAdapter(settings: KeyValuePair<JSONAttribute>): KeyValuePair<Attribute> {
    const attributes: KeyValuePair<Attribute> = {};
    for (const key in settings)
        attributes[key] = new Attribute({
            id: key,
            name: settings[key].name,
            min: settings[key].min,
            max: settings[key].max
        });

    return attributes;
}
export function AbilityAdapter(settings: KeyValuePair<JSONAbility>, effects: KeyValuePair<Effect>): KeyValuePair<Ability> {
    const abilities: KeyValuePair<Ability> = {};
    for (const key in settings) {
        abilities[key] = new Ability({
            id: key,
            name: settings[key].name,
            effects: refMap<Effect>(settings[key].effects, effects),
            triggerAction: true
        });
    }
    return abilities;
}

export function EffectAdapter(settings: KeyValuePair<JSONEffect>): KeyValuePair<Effect> {
    const effects: KeyValuePair<Effect> = {};
    for (const key in settings) {
        effects[key] = new Effect({
            id: key,
            local: settings[key].local,
            modifiers: ModifierAdapter(settings[key].modifiers),
            priorty: { minor: 50, major: 50 }
        });
    }
    return effects;
}

export function ModifierAdapter(settings: Array<JSONModifier>): Array<Modifier> {
    return settings.map(m =>
        new Modifier({
            id: '',
            attribute: m.attribute,
            value: ModifierValueAdapter(m.value)
        })
    )
}

function ModifierValueAdapter(value: number | ModifierValue): ModifierValue {
    return <ModifierValue>(typeof value == 'number' ? (contex: EffectContext) => value : value)
}

function refMap<T>(ids: Array<JSONRef | string>, map: KeyValuePair<T & BaseClass>): Dictionary<T> {
    const dict: Dictionary<T> = new Dictionary<T>();
    for (let i = 0; i < ids.length; i++) {
        const id: string = ids[i].hasOwnProperty('refId') ? (<JSONRef>ids[i]).refId : '';
        const obj = map[id]
        if (obj)
            dict.addUUID(obj.clone());
    }
    return dict;
}
interface GameAdapterSettings {
    entities: KeyValuePair<JSONEntity>
    attributes: KeyValuePair<JSONAttribute>
    abilities: KeyValuePair<JSONAbility>
    effects: KeyValuePair<JSONEffect>
}
interface JSONEntity {
    name: string
    attributes: KeyValuePair<number | JSONAttribute>
    abilities: Array<JSONRef>
}
interface JSONAttribute {
    name: string
    min: number
    max: number
    value?: number
}
interface JSONRef {
    refId: string
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
