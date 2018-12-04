import { Modifier } from "./modifier";
import { ArrayClone, coalesce } from "./util";
import { TimeUnit } from "./enums";
import { BaseClass } from "./base";
import { AbilityContext, EffectContext } from "./context";

export class Effect extends BaseClass {
    static objectType = 'Effect';
    context?: EffectContext;

    priorty: EffectPriorty = { major: 50, minor: 50 };
    tick: TimeUnit = TimeUnit.Immediate;
    local: any = {}
    modifiers: Array<Modifier> = [];
    rolls: Array<number> = [0];

    constructor(settings: EffectSettings, instantiate?: boolean) {
        super(Effect, settings, instantiate);
        const { local, modifiers, priorty } = settings;
        this.local = coalesce(local, this.local);
        this.modifiers = ArrayClone(modifiers, instantiate);
        this.priorty.minor = coalesce(priorty.minor, this.priorty.minor);
        this.priorty.major = coalesce(priorty.major, this.priorty.major);
    }

    addContext(context: AbilityContext) {
        this.context = context.effectContext({ effect: this });
        this.modifiers.map(m => m.addContext(<EffectContext>this.context));
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.priorty = this.priorty;
        obj.tick = this.tick;
        obj.local = this.local;
        obj.modifiers = this.modifiers.map(m => m.toJSON());

        return obj;
    }
}
interface EffectSettings {
    id: string
    local: any
    modifiers: Array<Modifier>
    priorty: EffectPriorty
}
interface EffectPriorty { major: number, minor: number }