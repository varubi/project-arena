export class Modifier {
    public attribute: string = '';
    public value: number = 0;
    constructor(settings: ModifierSettings) {
        const { attribute, value } = settings;
        this.attribute = attribute;
        this.value = value;
    }
    clone() {
        return new Modifier({
            attribute: this.attribute,
            value: this.value
        })
    }
}
interface ModifierSettings {
    attribute: string,
    value: number
}