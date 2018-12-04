import { BaseClass } from './base';
export function isArray(obj: any): boolean {
    return Array.isArray(obj);
}
export function coalesce(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
        if (typeof args[i] != 'undefined')
            return args[i];
    }
}
export function min(...args: Array<number | null>): number {
    return Math.min.apply(null, args.filter(n => typeof n == 'number'))
}

export function max(...args: Array<number | null>): number {
    return Math.max.apply(null, args.filter(n => typeof n == 'number'))
}

export function cap(value: number, low: number | null, high: number | null): number {
    return min(max(value, low), high);
}

export function ToArray<T>(item: T | Array<T>): Array<T> {
    return <Array<T>>(isArray(item) ? item : [item]);
}
export interface IntDictionary<T> {
    [name: number]: T
}
export function serialClone<T>(obj: any): T {
    return <T>JSON.parse(JSON.stringify(obj));
}
export function clone<T>(obj: T | BaseClass, instantiate?: boolean): T {
    return <T>(typeof (<BaseClass>obj).clone == 'function' ? (<BaseClass>obj).clone(instantiate) : obj);
}
export function ArrayClone<T>(array: Array<T>, instantiate?: boolean): Array<T> {
    const cloned: Array<T> = [];
    for (let i = 0; i < array.length; i++) {
        cloned[i] = clone<T>(array[i], instantiate)
    }
    return cloned;
}
export type Filter<T> = (d: T) => boolean;
export interface KeyValuePair<T> {
    [name: string]: T
}