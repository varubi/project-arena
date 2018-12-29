import { Effect } from './effect';
import { BaseClass } from './base';
import { AbilityContext } from './context';
import { KVDB } from './kvdb';

export class Ability extends BaseClass {
    static className = 'Ability';
    context?: AbilityContext;
    name: string = '';
    effects: KVDB<Effect> = new KVDB<Effect>();
    triggerAction: boolean = true;

    constructor(settings: AbilitySettings, instantiate?: boolean) {
        super(Ability, settings, instantiate);
        const { name, effects, triggerAction } = settings;
        this.name = name;
        this.triggerAction = triggerAction;
        this.effects = effects.clone(instantiate)
    }

    addContext(context: AbilityContext) {
        this.context = context;
        this.effects.forEach(item => item.addContext(context))
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.name = this.name;
        obj.effects = {}
        this.effects.forEach((item, key) => obj.effects[key] = item.toJSON())
        return obj;
    }
}

interface AbilitySettings {
    id: string
    name: string
    effects: KVDB<Effect>
    triggerAction: boolean
}