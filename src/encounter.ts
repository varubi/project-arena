import { Entity } from './entity';
import { History } from './history';
import { Filter } from './util';
import { Timekeeper } from './timekeeper';
import { Context } from './context';
import { TimeUnit } from './enums';
import { KVDB } from './kvdb';

export class Encounter {
    timekeeper: Timekeeper = new Timekeeper();
    history: History = new History();
    entities: KVDB<Entity> = new KVDB<Entity>();
    context: Context;

    constructor(settings: EncounterSettings) {
        this.context = new Context({
            encounter: this,
            history: this.history,
            timekeeper: this.timekeeper
        });

        this.timekeeper.addListener((updated: TimeUnit) => {
            this.getEntities(e => !!(e.effectTicks & updated));
        });

        if (settings.entities)
            settings.entities.forEach(entity => this.addEntity(entity))
    }

    addEntity(entity: Entity): void {
        if (this.entities.get(entity.oid.rootId))
            return;
        this.entities.addOID(entity)
        entity.addContext(this.context);
        this.history.log('entity', { entity: entity, toJSON: () => entity.toJSON() })
    }

    getEntities(filter: Filter<Entity>): Array<Entity> {
        return this.entities.filter(filter).toArray();
    }

    entity(id: string): Entity {
        return this.entities.get(id)
    }

    toJSON(): any {
        return {
            timekeeper: this.timekeeper,
            history: this.history.toJSON(),
            entities: this.entities.toJSON(),
            context: this.context
        }
    }
}


interface EncounterSettings {
    entities?: KVDB<Entity>
}