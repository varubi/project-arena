import { Encounter } from './encounter';
import { Entity } from './entity';
import { Ability } from './ability';
import { GameAdapter } from './adapter';
import { OID } from './oid';
import { TimeUnit } from './enums'
(window as any).ARENA = {
    Encounter: Encounter,
    Entity: Entity,
    Ability: Ability,
    GameAdapter: GameAdapter,
    OID: OID
}
