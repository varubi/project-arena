import { Filter, clone } from './util';
import { BaseClass } from './base';
import { Dictionary } from './util';
export class KVDB<T>{
    items: Dictionary<T> = {};

    constructor() {

    }

    get(key: string): T {
        return this.items[key];
    }

    set(key: string, obj: T) {
        this.items[key] = obj;
    }

    addOID(obj: T & BaseClass) {
        this.items[obj.oid.rootId] = obj;
    }

    apply(reference: Dictionary<T>) {
        for (const key in reference)
            this.set(key, reference[key])
    }

    delete(key: string) {
        delete this.items[key];
    }

    clone(instantiate?: boolean): KVDB<T> {
        const cloned: KVDB<T> = new KVDB<T>();
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

    toJSON(): Dictionary<T> {
        const json: Dictionary<T> = {};
        this.forEach((item, key) => json[key] = typeof (<any>item).toJSON == 'function' ? (<any>item).toJSON() : item)
        return json;
    }

    static CreateFrom<T>(reference: Dictionary<T>) {
        const result = new KVDB<T>();
        result.apply(reference);
        return result;
    }
}
type Iterator<T> = (item: T, key: string) => void
