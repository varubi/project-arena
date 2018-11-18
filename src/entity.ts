import { UUID, ToArray, Dictionary, DictionaryClone } from './util'
import { Ability } from './ability'
import { Encounter } from './encounter'
import { Effect } from './effect';
import { Attribute } from './attribute';
import { Modifier } from './modifier';

export class Entity {
    public id: string = '';
    public uuid: UUID;
    public name: string = '';
    public abilities: Dictionary<Ability> = {};
    public attributes: Dictionary<Attribute> = {};
    public attributeMap: Dictionary<Attribute> = {};
    public encounter?: Encounter;

    constructor(settings: EntitySettings) {
        const { id, name, attributes, abilities } = settings;
        this.id = id;
        this.name = name;
        this.abilities = abilities;
        this.attributes = attributes;
        for (const key in attributes) {
            const att = attributes[key];
            this.attributeMap[att.id] = att;
            this.attributes[att.uuid.objectId] = att;
        }
        this.uuid = new UUID(['Entity', id]);
    }

    public applyEffect(effects: Dictionary<Effect>) {
        for (const key in effects) {
            this.applyModifier(effects[key].modifiers);
        }
    }

    public applyModifier(modifiers: Modifier | Array<Modifier>) {
        modifiers = ToArray<Modifier>(modifiers);
        console.log(modifiers)
        modifiers.forEach(m => {
            if (this.attributeMap[m.attribute])
                this.attributeMap[m.attribute].apply(m.value);
        })
    }

    public linkEncounter(encounter: Encounter) {
        this.encounter = encounter;
    }

    public doAction(name: string, target?: string) {
        if (!this.encounter)
            return;

        const E = !target ? this : this.encounter.filterEntities(d => d.id == target)[0];
        this.encounter.entityAction(this, this.abilities[name], E);
    }
    public clone(): Entity {
        return new Entity({
            id: this.id,
            name: this.name,
            abilities: DictionaryClone<Ability>(this.abilities),
            attributes: DictionaryClone<Attribute>(this.attributes)
        })

    }
}
interface EntitySettings {
    id: string,
    name: string,
    abilities: Dictionary<Ability>,
    attributes: Dictionary<Attribute>
}