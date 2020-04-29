export declare type Intent = Array<string>;
export declare type UttInt = [string, string];
export declare type WordType = "greetings" | "thanks" | "yes" | "no";
export interface IWordDict {
    "greetings": Array<string>;
    "thanks": Array<string>;
    "yes": Array<string>;
    "no": Array<string>;
}
export interface Intent2Number {
    [key: string]: number;
}
export interface Number2Intent {
    [key: number]: string;
}
