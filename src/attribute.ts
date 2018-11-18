import { UUID, coalesce } from './util';

export class Attribute {
    public id: string;
    public uuid: UUID;
    public name: string = '';
    public min: number | null = null;
    public max: number | null = null;
    public value: number = 0;

    constructor(settings: AttributeSettings) {
        const { id, name, min, max, value } = settings;
        this.id = id;
        this.name = name;
        this.min = coalesce(min, this.min);
        this.max = coalesce(max, this.max);
        this.value = coalesce(value, this.value);
        this.uuid = new UUID(['Attribute', id]);
    }


    public apply(value: number) {
        if (this.max && this.value + value > this.max)
            return false;
        if (this.min && this.value + value < this.min)
            return false;

        this.value += value;
        return true;
    }

    public set(value: number) {
        if (this.max && value > this.max)
            return false;
        if (this.min && value < this.min)
            return false;

        this.value = value;
        return true;
    }

    public clone() {
        return new Attribute({
            id: this.id,
            name: this.name,
            value: this.value,
            min: this.min,
            max: this.max,
        });
    }
}

interface AttributeSettings {
    id: string
    name: string
    min?: number | null
    max?: number | null
    value?: number
}