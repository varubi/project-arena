import { coalesce, cap } from './util';
import { BaseClass } from './base';

export class Attribute extends BaseClass {
    static className = 'Attribute';

    visible: boolean = true;
    name: string = '';
    min: number | null = null;
    max: number | null = null;
    value: number = 0;

    constructor(settings: AttributeSettings, instantiate?: boolean) {
        super(Attribute, settings, instantiate);
        const { name, min, max, value, visible } = settings;
        this.name = name;
        this.min = coalesce(min, this.min);
        this.max = coalesce(max, this.max);
        this.value = coalesce(value, this.value);
        this.visible = coalesce(visible, this.visible);
    }

    apply(value: number) {
        this.value = cap(this.value + value, this.min, this.max);
    }

    set(value: number) {
        this.value = cap(value, this.min, this.max);
    }

    toJSON() {
        const obj = BaseClass.ToJSON(this);
        obj.name = this.name;
        obj.visible = this.visible;
        obj.min = this.min;
        obj.max = this.max;
        obj.value = this.value;

        return obj;
    }
}

interface AttributeSettings {
    id: string
    name: string
    min?: number | null
    max?: number | null
    value?: number
    visible?: boolean
}