import { Filter } from './util'
import { Ability } from './ability'
import { Effect } from './effect';
import { Attribute } from './attribute';
import { BaseClass } from './base';
import { Context, EntityContext, EffectContext } from './context';
import { TimeUnit } from './enums';
import { Dictionary } from './dictionary';
export class Entity extends BaseClass {
    static objectType = 'Entity';
    context?: EntityContext;

    name: string = '';
    abilities: Dictionary<Ability>;
    attributes: Dictionary<Attribute>;
    effects: Array<Effect> = [];
    effectTicks: TimeUnit = 0;


    constructor(settings: EntitySettings, instantiate?: boolean) {
        super(Entity, settings, instantiate);
        const { name, attributes, abilities } = settings;
        this.name = name;
        this.abilities = abilities.clone(instantiate);
        this.attributes = attributes.clone(instantiate)
    }

    applyEffect(effect: Effect) {
        if (effect.context)
            effect.modifiers.forEach(m => {
                const atr = this.attributes.get(m.attributeUUID);
                if (atr)
                    atr.apply(m.value(<EffectContext>effect.context));
            })
    }

    addEffect(effect: Effect) {
        const nonImmediate = TimeUnit.Action | TimeUnit.Round | TimeUnit.Turn | TimeUnit.Encounter;
        if (effect.tick & nonImmediate) {
            this.effects.push(effect);
            this.refreshEffectTick();
        }

        if (effect.tick && TimeUnit.Immediate)
            this.applyEffect(effect);
    }

    getEffects(filter: Filter<Effect>) {
        return this.effects.filter(filter);
    }

    removeEffect(uuid: string) {
        this.effects = this.effects.filter(e => (e.uuid.toString() != uuid))
        this.refreshEffectTick();
    }

    refreshEffectTick() {
        this.effectTicks = this.effects.reduce((ticks, effect) => ticks | effect.tick, 0)
    }

    castAbility(abilityUUID: string, targetUUID?: string) {
        if (!this.context)
            return;
        const ability: Ability = this.abilities.get(abilityUUID);
        if (!ability)
            return;
        const target = !targetUUID ? this : this.context.encounter.getEntities(d => d.uuid.objectId == targetUUID)[0];
        if (!target)
            return;
        const cast = ability.clone(true)

        cast.addContext(this.context.abilityContext({ ability: cast, target: target }))
        target.applyAbility(cast)
        this.context.history.log('ability', {
            source: this,
            target: target,
            ability: cast,
            toJSON: () => {
                return {
                    source: this.toJSON(),
                    target: target.toJSON(),
                    ability: ability.toJSON()
                }
            }
        });
        if (ability.triggerAction)
            this.context.timekeeper.tick(TimeUnit.Action);
    }

    applyAbility(ability: Ability) {
        ability.effects.forEach(item => this.addEffect(item))
    }

    addContext(context: Context) {
        this.context = context.entityContext({ entity: this });
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.name = this.name;
        obj.abilities = this.abilities.toJSON();
        obj.attributes = this.attributes.toJSON();
        obj.effects = this.effects.map(e => e.toJSON());
        return obj;
    }

}
interface EntitySettings {
    id: string,
    name: string,
    abilities: Dictionary<Ability>,
    attributes: Dictionary<Attribute>
}
