import { Ability } from './ability';
import { Entity } from './entity';
import { ActivityLog } from './activitylog';
import { Dictionary } from './util';

export class Encounter {
    private log: ActivityLog = new ActivityLog();
    private entities: Dictionary<Entity> = {};

    constructor(settings: EncounterSettings) {
        if (settings.entities) {
            for (const key in settings.entities) {
                this.addEntity(settings.entities[key]);
            }
        }
    }
    public addEntity(entity: Entity) {
        if (this.entities[entity.uuid.objectId])
            return;
        this.entities[entity.uuid.objectId] = entity;
        entity.linkEncounter(this);
    }
    public entityAction(entity: Entity, ability: Ability, target: Entity) {
        this.log.add({
            time: Date.now(),
            src: entity,
            target: target,
            ability: ability
        })
        console.log(this.log)
        target.applyEffect(ability.effects);
    }
    public filterEntities(filter: (d: any) => {}): Array<Entity> {
        const results: Array<Entity> = [];
        for (const key in this.entities) {
            if (filter(this.entities[key]))
                results.push(this.entities[key]);
        }
        return results;
    }
    public entity(id: string): void | Entity {
        if (this.entities[id])
            return this.entities[id];
    }
}
interface EncounterSettings {
    entities?: Dictionary<Entity>
}