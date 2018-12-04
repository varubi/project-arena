import { Filter, clone } from './util';
import { BaseClass } from './base';
import { KeyValuePair } from './util';
export class Dictionary<T>{
    items: KeyValuePair<T> = {};
    constructor() {

    }

    get(key: string): T {
        return this.items[key];
    }

    set(key: string, obj: T) {
        this.items[key] = obj;
    }

    addUUID(obj: T & BaseClass) {
        this.items[obj.uuid.objectId] = obj;
    }

    apply(reference: KeyValuePair<T>) {
        for (const key in reference)
            this.set(key, reference[key])
    }

    delete(key: string) {
        delete this.items[key];
    }

    clone(instantiate?: boolean): Dictionary<T> {
        const cloned: Dictionary<T> = new Dictionary<T>();
        this.forEach((item, key) => cloned.set(key, clone<T>(item, instantiate)))
        return cloned;
    }

    forEach(iterator: Iterator<T>) {
        for (const key in this.items)
            iterator(this.items[key], key)
    }

    filter(filter: Filter<T>): Array<T> {
        const results: Array<T> = [];
        this.forEach(item => filter(item) && results.push(item))
        return results;
    }
    toJSON(): KeyValuePair<T> {
        const json: KeyValuePair<T> = {};
        this.forEach((item, key) => json[key] = typeof (<any>item).toJSON == 'function' ? (<any>item).toJSON() : item)
        return json;
    }
    static CreateFrom<T>(reference: KeyValuePair<T>) {
        const result = new Dictionary<T>();
        result.apply(reference);
        return result;
    }
}
type Iterator<T> = (item: T, key: string) => void
