import { Entity } from "./entity";
import { Ability } from "./ability";
import { Effect } from "./effect";
import { OID } from "./oid";

export class History {
    private history: Array<ActivityLogEntry> = [];

    log(type: string, activity: ActivityLogAbility | ActivityLogEffect | ActivityLogEntity) {
        const a = {
            oid: new OID(['history', type], true),
            type: type.toLowerCase(),
            time: Date.now(),
            activity: activity.toJSON()
        }
        this.history.push(a);
        console.log(this.history)
    }
    toJSON(): any {
        return this.history.map(a => {
            return {
                oid: a.oid.toString(),
                type: a.type,
                time: a.time,
                activity: a.activity
            }
        })
    }
}

interface ActivityLogEntry {
    oid: OID
    time: number
    type: string
    activity: ActivityLogAbility | ActivityLogEffect | ActivityLogEntity
}

interface ActivityLogAbility {
    source: Entity
    target: Entity
    ability: Ability
    toJSON: Function
}

interface ActivityLogEffect {
    effect: Effect
    toJSON: Function
}

interface ActivityLogEntity {
    entity: Entity
    toJSON: Function
}