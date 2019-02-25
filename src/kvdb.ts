import { Filter, clone, GetProperty } from './util';
import { BaseClass } from './base';
import { Dictionary } from './util';
export class KVDB<T>{
    db: Dictionary<T> = {};

    constructor() {

    }

    get(key: string): T {
        return this.db[key];
    }

    set(key: string, obj: T) {
        this.db[key] = obj;
    }

    addOID(obj: T & BaseClass) {
        this.db[obj.oid.rootId] = obj;
    }

    apply(reference: Dictionary<T>) {
        for (const key in reference)
            this.set(key, reference[key])
    }
    applyArray(reference: Array<T>, key: string) {
        for (let i = 0; i < reference.length; i++)
            this.set(GetProperty<string>(reference[i], key), reference[i])
    }
    delete(key: string) {
        delete this.db[key];
    }

    export(): Dictionary<T> {
        return this.db;
    }

    clone(instantiate?: boolean): KVDB<T> {
        const cloned: KVDB<T> = new KVDB<T>();
        this.forEach((item, key) => cloned.set(key, clone<T>(item, instantiate)))
        return cloned;
    }

    forEach(iterator: Iterator<T>) {
        for (const key in this.db)
            iterator(this.db[key], key)
    }

    map<T2>(iterator: IteratorMap<T, T2>): KVDB<T2> {
        const results: KVDB<T2> = new KVDB<T2>();
        this.forEach((item, key) => results.set(key, iterator(item, key)))
        return results;
    }

    filter(filter: Filter<T>): KVDB<T> {
        const results: KVDB<T> = new KVDB<T>();
        this.forEach((item, key) => filter(item) && results.set(key, item))
        return results;
    }

    toJSON(): Dictionary<T> {
        const json: Dictionary<T> = {};
        this.forEach((item, key) => json[key] = typeof (<any>item).toJSON == 'function' ? (<any>item).toJSON() : item)
        return json;
    }

    toArray(): Array<T> {
        const results: Array<T> = [];
        this.forEach(item => results.push(item))
        return results;
    }

    static CreateFrom<T>(reference: Dictionary<T>): KVDB<T> {
        const result = new KVDB<T>();
        result.apply(reference);
        return result;
    }

    static CreateFromArray<T>(reference: Array<T>, key: string): KVDB<T> {
        const result = new KVDB<T>();
        result.applyArray(reference, key);
        return result;
    }
}
export type Iterator<T> = (item: T, key: string) => void
export type IteratorMap<T, T2> = (item: T, key: string) => T2
