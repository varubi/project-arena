
export class Roll {
    numberOfDice: number = 1;
    numberOfSides: number = 2;
    constructor() {

    }
    parse(string: string) {
        const matches = string.match(/^(\d*)d(\d+)$/i);
        if (!matches)
            return;
        this.numberOfDice = parseInt(matches[1]) || this.numberOfDice;
        this.numberOfSides = parseInt(matches[2]);


    }
}