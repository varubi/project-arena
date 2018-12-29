import { OID } from "./oid";
import { Context } from "./context";

export abstract class BaseClass {
    static className: string = 'BaseClass';

    id: string = '';
    oid: OID;
    root: this = this;
    subclass: any = BaseClass;
    context?: Context;

    constructor(objectReference: any, settings: { id: string, root?: any }, instantiate?: boolean) {
        this.root = settings.root || this;
        this.subclass = objectReference;
        this.id = settings.id || (objectReference.className + '-' + OID.random());
        this.oid = BaseClass.OID([objectReference.className, this.id], instantiate);
    }

    addContext(context: Context) {
        this.context = context;
    }

    clone(instantiate?: boolean): this {
        return new (<any>this.subclass)(this, instantiate);
    }
    
    cloneRoot(instantiate?: boolean): this {
        return new (<any>this.subclass)(this.root, instantiate);
    }

    toString() {
        return this.oid.toString();
    }

    toJSON() {
        return this.toString();
    }

    static ToJSON(object: BaseClass & any): any {
        return {
            id: object.id,
            oid: object.oid.toString(),
            subclass: object.subclass.className,
        };
    }

    static OID(id: string | Array<string>, instantiate?: boolean) {
        return new OID(id, instantiate)
    }
}
