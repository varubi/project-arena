import { UUID } from "./uuid";
import { Context } from "./context";

export abstract class BaseClass {
    static objectType: string = 'BaseClass';

    id: string = '';
    uuid: UUID;
    objectReference: any = BaseClass;
    context?: Context;

    constructor(objectReference: any, settings: { id: string }, instantiate?: boolean) {
        this.objectReference = objectReference;
        this.id = settings.id || (objectReference.objectType + '-' + UUID.random());
        this.uuid = BaseClass.UUID([objectReference.objectType, this.id], instantiate);
    }

    addContext(context: Context) {
        this.context = context;
    }

    clone(instantiate?: boolean): this {
        return new (<any>this.objectReference)(this, instantiate);
    }

    toString() {
        return this.uuid.toString();
    }

    toJSON() {
        return this.toString();
    }

    static ToJSON(object: BaseClass & any): any {
        return {
            objectType: object.objectReference.objectType,
            id: object.id,
            uuid: object.uuid.toString(),
        };
    }

    static UUID(id: string | Array<string>, instantiate?: boolean) {
        return new UUID(id, instantiate)
    }
}
