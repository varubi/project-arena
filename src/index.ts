import { Encounter } from './encounter';
import { Entity } from './entity';
import { Ability } from './ability';
import { GameAdapter } from './adapter';
import { UUID } from './uuid';

(window as any).ARENA = {
    Encounter: Encounter,
    Entity: Entity,
    Ability: Ability,
    GameAdapter: GameAdapter,
    UUID: UUID
}
