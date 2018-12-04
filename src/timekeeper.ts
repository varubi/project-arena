import { TimeUnit } from "./enums";
import { IntDictionary } from "./util";

export class Timekeeper {
    lastTick: TimeUnit = 0;
    lastChange: TimeUnit = 0;
    listeners: Array<Function> = [];

    counters: IntDictionary<number> = {
        [TimeUnit.Encounter]: 0,
        [TimeUnit.Round]: 0,
        [TimeUnit.Turn]: 0,
        [TimeUnit.Action]: 0
    }

    constructor(values?: TimekeeperValues) {
        if (!values)
            return;
        this.counters[TimeUnit.Encounter] = values.encounter;
        this.counters[TimeUnit.Round] = values.round;
        this.counters[TimeUnit.Turn] = values.turn;
        this.counters[TimeUnit.Action] = values.action;
    }

    toString(): string {
        const _ = ':';
        return this.counters[TimeUnit.Encounter] + _ +
            this.counters[TimeUnit.Round] + _ +
            this.counters[TimeUnit.Turn] + _ +
            this.counters[TimeUnit.Action];
    }

    reset(unit: TimeUnit): boolean {
        if (this.counters[unit] == 0)
            return false;
        this.counters[unit] = 0;
        return true;
    }

    tick(value: TimeUnit): TimeUnit {
        var changed: TimeUnit = value;

        if (value & TimeUnit.Encounter) {
            this.counters[TimeUnit.Encounter]++;
            changed |= this.reset(TimeUnit.Round) ? TimeUnit.Round : 0;
            changed |= this.reset(TimeUnit.Turn) ? TimeUnit.Turn : 0;
            changed |= this.reset(TimeUnit.Action) ? TimeUnit.Action : 0;
        }
        if (value & TimeUnit.Round) {
            this.counters[TimeUnit.Round]++;
            changed |= this.reset(TimeUnit.Turn) ? TimeUnit.Turn : 0;
            changed |= this.reset(TimeUnit.Action) ? TimeUnit.Action : 0;
        }
        if (value & TimeUnit.Turn) {
            this.counters[TimeUnit.Turn]++;
            changed |= this.reset(TimeUnit.Action) ? TimeUnit.Action : 0;
        }
        if (value & TimeUnit.Action)
            this.counters[TimeUnit.Action]++;

        this.lastChange = changed;
        this.lastTick = value;
        this.listeners.forEach(l => l(changed));

        return changed;
    }

    addListener(f: Function) {
        this.listeners.push(f);
    }
    removeListener(f: Function) {
        this.listeners = this.listeners.splice(this.listeners.indexOf(f), 1);
    }

    static parse(id: string): Timekeeper | null {
        if (!/\d+:\d+:\d+:\d+/.test(id))
            return null;
        const params = id.split(':');
        return new Timekeeper({
            encounter: parseInt(params[0]),
            round: parseInt(params[1]),
            turn: parseInt(params[2]),
            action: parseInt(params[3]),
        });
    }
}

interface TimekeeperValues {
    encounter: number
    round: number
    turn: number
    action: number
}