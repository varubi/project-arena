export enum JSONType {
    Null = bit(0),
    String = bit(1),
    Number = bit(2),
    Array = bit(3),
    Object = bit(4),
    Boolean = bit(5),
    Integer = bit(2) | bit(6),
}

export enum TimeUnit {
    Immediate = bit(0),
    Action = bit(1),
    Turn = bit(2),
    Round = bit(3),
    Encounter = bit(4),
    VirtualTime = bit(5),
    RealTime = bit(6),
}

export enum Persistance {
    Temporary,
    Permanent
}

function bit(i: number) {
    return 1 << i;
}
