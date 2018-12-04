import { AbilityContext, Context, EffectContext } from "./context";
import { UUID } from "./uuid";
import { BaseClass } from "./base";
import { Attribute } from "./attribute";

export class Modifier extends BaseClass {
    static objectType = 'Modifier';
     
    attribute: string = '';
    attributeUUID: string;
    value: ModifierValue = (context: EffectContext): number => 0;
    roll?: number = 0;

    constructor(settings: ModifierSettings, instantiate?: boolean) {
        super(Modifier, settings, instantiate);
        const { attribute, value, roll } = settings;
        this.attribute = attribute;
        this.attributeUUID = UUID.namespace(UUID.normalize([Attribute.objectType, attribute]));
        this.value = value;
        this.roll = roll;
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.attribute = this.attribute;
        obj.attributeUUID = this.attributeUUID;
        obj.roll = this.roll;
        return obj;
    }
}

export type ModifierValue = (context: EffectContext) => number
interface ModifierSettings {
    id: string,
    attribute: string,
    value: ModifierValue,
    roll?: number
}