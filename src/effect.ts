import { Modifier } from "./modifier";
import { ToArray, UUID, ArrayClone } from "./util";

export class Effect {
    public id: string;
    public uuid: UUID;
    public duration?: number;
    public modifiers: Array<Modifier> = [];
    constructor(settings: EffectSettings) {
        const { id, duration, modifiers } = settings;
        this.id = id;
        this.uuid = new UUID(['Ability', id]);
        this.duration = duration;
        this.modifiers = ToArray(modifiers);
    }
    clone(): Effect {
        return new Effect({
            id: this.id,
            duration: this.duration,
            modifiers: ArrayClone<Modifier>(this.modifiers)
        });
    }
}
interface EffectSettings {
    id: string
    duration?: number
    modifiers: Modifier | Array<Modifier>
}