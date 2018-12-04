import { Entity } from "./entity";
import { Ability } from "./ability";
import { Effect } from "./effect";
import { UUID } from "./uuid";

export class History {
    private history: Array<ActivityLogEntry> = [];

    log(type: string, activity: ActivityLogAbility | ActivityLogEffect | ActivityLogEntity) {
        const a = {
            uuid: new UUID(['history', type], true),
            type: type,
            time: Date.now(),
            activity: activity.toJSON()
        }
        this.history.push(a);
    }
    toJSON(): any {
        return this.history.map(a => {
            return {
                uuid: a.uuid.toString(),
                type: a.type,
                time: a.time,
                activity: a.activity
            }
        })
    }
}

interface ActivityLogEntry {
    uuid: UUID
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