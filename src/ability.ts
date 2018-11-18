import { UUID, Dictionary } from './util';
import { Effect } from './effect';

export class Ability {
    public id: string = '';
    public uuid: UUID;
    public name: string = '';
    public effects: Dictionary<Effect> = {};

    constructor(settings: AbilitySettings) {
        const { id, name, effects } = settings;
        this.id = id;
        this.name = name;
        this.uuid = new UUID(['Ability', id]);
        this.effects = effects;
    }
    public clone(): Ability {
        const cloned = new Ability({ id: this.id, name: this.name, effects: this.effects });
        return cloned;
    }
}
interface AbilitySettings {
    id: string,
    name: string,
    effects: Dictionary<Effect>
}