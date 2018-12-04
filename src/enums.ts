export enum JSONType {
    Null = bitFlag(0),
    String = bitFlag(1),
    Number = bitFlag(2),
    Array = bitFlag(3),
    Object = bitFlag(4),
    Boolean = bitFlag(5),
    Integer = bitFlag(2) | bitFlag(6),
}

export enum TimeUnit {
    Immediate = bitFlag(0),
    Action = bitFlag(1),
    Turn = bitFlag(2),
    Round = bitFlag(3),
    Encounter = bitFlag(4),
    Millisecond = bitFlag(5),
}

export enum Persistance {
    Temporary,
    Permanent
}

function bitFlag(i: number) {
    return 1 << i;
}
