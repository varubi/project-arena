import { ToArray, Dictionary } from './util'

export class OID {
    static cache: Dictionary<string> = {};

    name?: string;
    rootId: string = "00000000";
    instanceId?: string;

    constructor(namespace?: string | Array<string>, instantiate?: boolean) {
        if (namespace) {
            this.name = OID.normalize(namespace);
            this.rootId = OID.namespace(this.name);
        }
        if (instantiate)
            this.instantiate();

    }

    instantiate() {
        this.instanceId = OID.hash((Math.random() * 1000000).toString());
    }

    toString(): string {
        return this.rootId + (this.instanceId ? ':' + this.instanceId : '');
    }

    clone(instantiate?: boolean): OID {
        const oid = new OID();
        oid.rootId = this.rootId;
        oid.instanceId = this.instanceId;
        oid.name = this.name;
        if (instantiate)
            oid.instantiate();

        return oid;
    }
    dispose() {
        delete OID.cache[this.rootId]
    }

    static resolve(oid: string): string | null {
        const items: Array<string> = oid.split(':');
        return OID.cache[items[0]]
    }

    static normalize(namespace: string | Array<string>) {
        return ToArray<string>(namespace)
            .join('.')
            .split('.')
            .map(e => e.trim())
            .filter(e => e)
            .join('.')
            .toLowerCase();
    }

    static namespace(id: string): string {
        id = OID.normalize(id);
        const oid = OID.hash(id);
        OID.cache[oid] = id;
        return oid;
    }

    static random() {
        return OID.hash((Math.random() * 1000000).toString());
    }

    static hash(str: string): string {
        var hval = 2166136261;
        for (var i = 0; i < str.length; ++i) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return (hval >>> 0).toString(16);
    }

    static parse(oid: string): OID {
        const items: Array<string> = oid.split(':');
        const oidObj = new OID();
        if (/^[0-9a-fA-F]{8}:[0-9a-fA-F]{8}$/.test(items[0]))
            oidObj.rootId = items[0];
        oidObj.name = OID.cache[items[0]];
        return oidObj;
    }
}