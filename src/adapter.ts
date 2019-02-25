import { Attribute } from "./attribute";
import { Entity } from "./entity";
import { Ability } from "./ability";
import { Dictionary, ToArray } from "./util";
import { Effect } from "./effect";
import { Modifier, ModifierValue } from "./modifier";
import { Encounter } from "./encounter";
import { EffectContext } from "./context";
import { TimeUnit } from "./enums";
import { KVDB } from "./kvdb";
export class GameAdapter {
    attributes: InheritableJSON<JSONAttribute>
    effects: InheritableJSON<JSONEffect>
    abilities: InheritableJSON<JSONAbility>
    entities: InheritableJSON<JSONEntity>;
    encounter: Encounter;

    constructor(settings: GameAdapterSettings) {
        this.attributes = InheritableJSON.CreateResolvedFrom(settings.attributes, 'inherits');
        this.effects = InheritableJSON.CreateResolvedFrom(settings.effects, 'inherits');
        this.abilities = InheritableJSON.CreateResolvedFrom(settings.abilities, 'inherits');
        this.entities = InheritableJSON.CreateResolvedFrom(settings.entities, 'inherits');
        const entities: KVDB<Entity> = new KVDB<Entity>();
        this.entities.forEach((entity, k) => {
            entities.addOID(new Entity({
                id: k,
                name: entity.name,
                attributes: this.resolveAttributes(entity.attributes),
                abilities: this.resolveAbilities(entity.abilities)
            }))
        })
        this.encounter = new Encounter({ entities });
    }

    resolveAbilities(abilities: Array<JSONAbility>): KVDB<Ability> {
        const results = this.abilities
            .query(abilities)
            .map(v => new Ability({
                id: v.inherits!,
                name: v.name,
                effects: this.resolveEffects(v.effects),
                triggerAction: true
            }))
        return KVDB.CreateFromArray(results, 'oid.rootId')
    }

    resolveEffects(effects: Array<JSONEffect>): KVDB<Effect> {
        const results = this.effects
            .query(effects)
            .map((v, key) => new Effect({
                id: key.toString(),
                local: v.local,
                modifiers: GameAdapter.adaptModifier(v.modifiers),
                priorty: { minor: 50, major: 50 },
                tick: TimeUnit.Immediate
            }));
        return KVDB.CreateFromArray(results, 'oid.rootId')
    }

    resolveAttributes(attributes: Dictionary<number | JSONAttribute>): KVDB<Attribute> {
        const result = new KVDB<Attribute>();
        for (const attribute in attributes) {
            let queried;
            if (typeof attributes[attribute] == 'number') {
                queried = this.attributes.query(<JSONAttribute>{ inherits: attribute, value: <number>attributes[attribute] })
            } else {
                queried = this.attributes.query({ ...<JSONAttribute>attributes[attribute], inherits: attribute })
            }
            queried[0]
            result.addOID(new Attribute({ ...queried[0], id: attribute }))
        }
        return result;
    }

    static adaptModifier(settings: Array<JSONModifier>): Array<Modifier> {
        return settings.map(m =>
            new Modifier({
                id: '',
                attribute: m.attribute,
                value: GameAdapter.adaptModifierValues(m.value),
                priorty: { minor: 50, major: 50 }
            })
        )
    }

    static adaptModifierValues(value: number | ModifierValue): ModifierValue {
        return <ModifierValue>(typeof value == 'number' ? (context: EffectContext) => value : value)
    }
}

class InheritableJSON<T> extends KVDB<T>  {
    referenceKey: string = '';
    constructor(key: string) {
        super();
        this.referenceKey = key;
    }

    query(ids: string | T | Array<string | T>): Array<T> {
        ids = ToArray(ids);
        const results: Array<T> = []
        for (let i = 0; i < ids.length; i++) {
            results.push(this.resolve(ids[i]));
        }
        return results;
    }

    resolve(id: string | T): T {
        const usedKeys: Dictionary<boolean> = {};
        let ref: string | null = null;
        const refs: Array<T> = [];
        if (typeof id == 'string') {
            ref = id;
        } else {
            refs.push(id)
            if (id.hasOwnProperty(this.referenceKey)) {
                ref = (<any>id)[this.referenceKey]
            }
        }
        while (ref) {
            if (this.db[ref]) {
                usedKeys[ref] = true;
                refs.push(this.db[ref])
                if (this.db[ref].hasOwnProperty(this.referenceKey)) {
                    ref = ((<any>this.db[ref])[this.referenceKey])
                } else {
                    ref = null;
                }
            } else {
                throw `Unknown reference '${ref}'`
            }
            if (ref && usedKeys[ref]) {
                throw `Circular refernce '${ref}'`;
            }
        }
        return Object.assign({}, ...refs.reverse());
    }

    resolveAll() {
        this.forEach((v, k) => this.set(k, this.resolve(v)))
    }

    static CreateResolvedFrom<T>(data: Dictionary<T>, key: string): InheritableJSON<T> {
        const created = new InheritableJSON<T>(key);
        created.apply(data);
        created.resolveAll();
        return created;

    }
}

interface GameAdapterSettings {
    entities: Dictionary<JSONEntity>
    attributes: Dictionary<JSONAttribute>
    abilities: Dictionary<JSONAbility>
    effects: Dictionary<JSONEffect>
}

interface JSONEntity extends JSONRef {
    name: string
    attributes: Dictionary<number | JSONAttribute>
    abilities: Array<JSONAbility>
}

interface JSONAttribute extends JSONRef {
    name: string
    min: number
    max: number
    value?: number
}


interface JSONAbility extends JSONRef {
    name: string
    effects: Array<JSONEffect>
}

interface JSONEffect extends JSONRef {
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

interface JSONRef {
    inherits?: string
}