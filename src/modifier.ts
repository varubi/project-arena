import { EffectContext } from "./context";
import { OID } from "./oid";
import { BaseClass } from "./base";
import { Attribute } from "./attribute";
import { Priorty } from "./util";

export class Modifier extends BaseClass {
    static className = 'Modifier';

    attribute: string = '';
    attributeOID: string;
    value: ModifierValue = (context: EffectContext): number => 0;
    priorty: Priorty = { major: 50, minor: 50 };
    roll?: number = 0;

    constructor(settings: ModifierSettings, instantiate?: boolean) {
        super(Modifier, settings, instantiate);
        const { attribute, value, roll } = settings;
        this.attribute = attribute;
        this.attributeOID = OID.namespace(OID.normalize([Attribute.className, attribute]));
        this.value = value;
        this.roll = roll;
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.attribute = this.attribute;
        obj.attributeOID = this.attributeOID;
        obj.roll = this.roll;
        return obj;
    }
}

export type ModifierValue = (context: EffectContext) => number
interface ModifierSettings {
    id: string
    attribute: string
    value: ModifierValue
    priorty: Priorty
    roll?: number
}