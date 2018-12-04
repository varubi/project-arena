import { ToArray, KeyValuePair } from './util'

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

export class UUID {
    static cache: KeyValuePair<string> = {};

    name?: string;
    objectId: string = "00000000-0000-0000-0000-000000000000";
    instanceId?: string;

    constructor(namespace?: string | Array<string>, instantiate?: boolean) {
        if (namespace) {
            this.name = UUID.normalize(namespace);
            this.objectId = UUID.namespace(this.name);
        }
        if (instantiate) {
            this.instanceId = hash((Math.random() * 1000000).toString());
        }
    }

    instantiate() {
        this.instanceId = hash((Math.random() * 1000000).toString());
    }

    toString(): string {
        return this.objectId + (this.instanceId ? ':' + this.instanceId : '');
    }

    clone(instantiate?: boolean): UUID {
        const uuid = new UUID();
        uuid.objectId = this.objectId;
        uuid.instanceId = this.instanceId;
        uuid.name = this.name;
        if (instantiate)
            uuid.instantiate();

        return uuid;
    }

    static resolve(uuid: string): string | null {
        const items: Array<string> = uuid.split(':');
        return this.cache[items[0]]
    }
    static normalize(namespace: string | Array<string>) {
        return ToArray<string>(namespace)
            .join('.')
            .split('.')
            .filter(e => e)
            .join('.')
            .toLowerCase();
    }
    static namespace(id: string): string {
        id = UUID.normalize(id);
        const uuid = hash(id);
        UUID.cache[uuid] = id;
        return uuid;
    }
    static random() {
        return hash((Math.random() * 1000000).toString());
    }

    static parse(uuid: string): UUID {
        const items: Array<string> = uuid.split(':');
        const uuidObj = new UUID();
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(items[0]))
            uuidObj.objectId = items[0];
        uuidObj.name = this.cache[items[0]];
        return uuidObj;
    }
}