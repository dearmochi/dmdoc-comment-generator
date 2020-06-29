declare module 'comma-separated-tokens' {
    export function parse(value: string): Array<string>;
    export function stringify(values: Array<string>, options: object): string;
}