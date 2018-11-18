const uuid5 = require('uuid/v5');
const uuid1 = require('uuid/v1');

export function isArray(obj: any): boolean {
    return Array.isArray(obj);
}
export function hash(str: string): string {
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var hash = 0;
    if (str.length)
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
    hash = hash >>> 0;
    return hash.toString(16);
}
export function coalesce(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != 'undefined')
            return args[i];
    }
}
export function ToArray<T>(item: T | Array<T>): Array<T> {
    return <Array<T>>(isArray(item) ? item : [item]);
}
export function validateJSON(source: JSONObject | Array<JSONObject>, validator: JSONValidator | number): boolean {
    if (Array.isArray(source))
        for (let i = 0; i < source.length; i++) {
            if (!validateJSON(source[i], validator))
                return false;
        }
    else
        for (const key in source) {
            const srctype: string = typeof source[key];

        }
    return true;
}
interface JSONValidator {
    [name: string]: number
}
interface JSONObject {
    [name: string]: string | number | boolean | object | Array<JSONObject>
}
export interface IntDictionary<T> {
    [name: number]: T
}
export interface Dictionary<T> {
    [name: string]: T
}
export function DictionaryClone<T>(dictionary: Dictionary<T & Cloneable>): Dictionary<T> {
    const clone: Dictionary<T> = {};
    for (const key in dictionary) {
        clone[key] = dictionary[key].clone();
    }
    return clone;
}
export function DictionaryUUID<T>(dictionary: Dictionary<T & UUIDClass>): Dictionary<T> {
    const clone: Dictionary<T> = {};
    for (const key in dictionary) {
        clone[dictionary[key].uuid.objectId] = dictionary[key];
    }
    return clone;
}
export function ArrayClone<T>(array: Array<T & Cloneable>): Array<T> {
    const clone: Array<T> = [];
    for (let i = 0; i < array.length; i++) {
        clone[i] = array[i].clone();
    }
    return clone;
}
export interface Cloneable {
    clone: Function
}
export interface UUIDClass {
    uuid: UUID
}
export class UUID {
    name: string = '';
    objectId: string = "00000000-0000-0000-0000-000000000000";
    instanceId?: string;

    constructor(namespace?: string | Array<string>, instanceId?: boolean) {
        if (namespace) {
            this.name = ToArray<string>(namespace).join('.').split('.').filter(e => e).join('.');
            this.objectId = uuid5(this.name, '1b671a64-40d5-491e-99b0-da01ff1f3341');
        }
        if (instanceId) {
            this.instanceId = uuid1();
        }
    }

    instantiate() {
        if (!this.instanceId)
            this.instanceId = uuid1();
    }

    toString(): string {
        return this.objectId + (this.instanceId ? ':' + this.instanceId : '');
    }

    fork(): UUID {
        const uuid = this.clone();
        if (this.instanceId)
            uuid.instantiate();
        return uuid;
    }

    clone(): UUID {
        const uuid = new UUID();
        uuid.objectId = this.objectId;
        uuid.instanceId = this.instanceId;
        uuid.name = this.name;
        return uuid;
    }

    static parse(uuid: string): UUID {
        const items: Array<string> = uuid.split(':');
        const uuidObj = new UUID();
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(items[0]))
            uuidObj.objectId = items[0];
        return uuidObj;
    }
}