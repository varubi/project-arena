import { Attribute } from "./attribute";
import { Entity } from "./entity";
import { Ability } from "./ability";
import { Dictionary, Cloneable, DictionaryUUID, UUIDClass } from "./util";
import { Effect } from "./effect";
import { Modifier } from "./modifier";
import { Encounter } from "./encounter";

export function GameAdapter(settings: GameAdapterSettings): Encounter {
    const attributes = AttributeAdapter(settings.attributes);
    const effects = EffectAdapter(settings.effects);
    const abilities = AbilityAdapter(settings.abilities, effects);
    const entities = EntityAdapter(settings.entities, attributes, abilities);
    const encounter = new Encounter({ entities: entities });
    return encounter;
}
export function EntityAdapter(settings: Dictionary<JSONEntity>, attributes: Dictionary<Attribute>, abilities: Dictionary<Ability>): Dictionary<Entity> {
    const entities: Dictionary<Entity> = {};
    for (const key in settings) {
        const atts: Dictionary<Attribute> = {};
        for (const at in settings[key].attributes) {
            const entatt = settings[key].attributes[at];
            if (attributes[at])
                atts[at] = attributes[at].clone();
            atts[at].value = (typeof entatt == 'number' ? entatt : entatt.value) || 0;
        }
        const e: Entity = new Entity({
            id: key,
            name: settings[key].name,
            attributes: DictionaryUUID<Attribute>(atts),
            abilities: refMap<Ability>(settings[key].abilities, abilities)
        });
        entities[key] = e;
    }
    return entities;
}
export function AttributeAdapter(settings: Dictionary<JSONAttribute>): Dictionary<Attribute> {
    const attributes: Dictionary<Attribute> = {};
    for (const key in settings) {
        const a: Attribute = new Attribute({
            id: key,
            name: settings[key].name,
            min: settings[key].min,
            max: settings[key].max
        });
        attributes[key] = a;
    }
    return attributes;
}
export function AbilityAdapter(settings: Dictionary<JSONAbility>, effects: Dictionary<Effect>): Dictionary<Ability> {
    const abilities: Dictionary<Ability> = {};
    for (const key in settings) {
        const a: Ability = new Ability({
            id: key,
            name: settings[key].name,
            effects: refMap<Effect>(settings[key].effects, effects)
        });
        abilities[key] = a;
    }
    return abilities;

}
export function EffectAdapter(settings: Dictionary<JSONEffect>): Dictionary<Effect> {
    const effects: Dictionary<Effect> = {};
    for (const key in settings) {
        const e: Effect = new Effect({
            id: key,
            duration: settings[key].duration,
            modifiers: ModifierAdapter(settings[key].modifiers)
        });
        effects[key] = e;
    }
    return effects;
}
export function ModifierAdapter(settings: Array<JSONModifier>): Array<Modifier> {
    return settings.map(m =>
        new Modifier({
            attribute: m.attribute,
            value: m.value
        })
    )
}
function refMap<T>(ids: Array<JSONRef | string>, map: Dictionary<T & Cloneable & UUIDClass>): Dictionary<T & UUIDClass> {
    const dict: Dictionary<T & UUIDClass> = {};
    for (let i = 0; i < ids.length; i++) {
        const id: string = ids[i].hasOwnProperty('refId') ? (<JSONRef>ids[i]).refId : '';
        if (map[id])
            dict[id] = map[id].clone();
    }
    return DictionaryUUID<T & UUIDClass>(dict);
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
    refId: string
}
interface JSONAbility {
    name: string
    effects: Array<JSONRef>
}
interface JSONEffect {
    duration?: number
    modifiers: Array<JSONModifier>
}
interface JSONModifier {
    attribute: string
    value: number
}
