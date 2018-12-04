import { TimeUnit } from "./enums";
import { Context } from "./context";

export class Duration {
    tick: TimeUnit;
    counter: number = 0;
    max: number = 0;
    run: Function = () => { };
    constructor(settings: DurationSettings) {
        this.tick = settings.tick;
        this.run = this.defaultRun;
    }
    expired(): boolean {
        return this.counter >= this.max;
    }
    private defaultRun(): boolean {
        this.counter++;
        return this.expired();
    }
}
interface DurationSettings {
    tick: TimeUnit,
    counter?: number,
    max?: number,
    run?: Function
    context: Context
}