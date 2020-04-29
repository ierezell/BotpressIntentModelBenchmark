
export type Intent = Array<string>;
export type UttInt = [string, string];
export type WordType = "greetings" | "thanks" | "yes" | "no";
export type DatasRaw = Array<[string, Intent]>;
export type DatasNum = Array<[string, number[]]>;


export interface IWordDict {
    "greetings": Array<string>;
    "thanks": Array<string>;
    "yes": Array<string>;
    "no": Array<string>;
}

export const words: IWordDict = {
    "greetings": ["Hi", "Hello", "Hola", "Yo", "Hey", "Howdy", "greetings", "welcome", "good morning", "good afternoon", "good evening", "hi there", "hello there"],
    "thanks": ["Thanks", "Thx", "Thank you", "I appreciate", "Appreciate", "gratitude", "thank you so much", "I am grateful", "appreciated", "thank you very much", "much obliged", "many thanks", "thank-you"],
    "yes": ["Wonderful", "Yes", "Perfect", "That's perfect", "Yes please", "Affirmative", "Ok", "good", "absolutely", "yep", "okidoki", "of course", "definitely", "yeah", "agreed", "I consent", "yea", "indeed", "fine", "absolutely", "yep", "okay", "yea", "all right", "certainly", "of course", "affirmative", "definitely", "indubitably", "yeah", "agreed", "ok", "consent", "naturally", "positively", "indeed", "by all means", "assuredly", "fine", "assent", "very well", "exactly", "I accept", "aye", "unquestionably", "willingly", "good", "agree", "I agree", "precisely", "surely", "affirmatively", "I approve", "gladly", "undoubtedly", "accept", "ay"],
    "no": ["yesn't", "negative", "no way", "nix", "nay", "by no means", "not at all", "never", "nope", "nothing", "absolutely not", "refusal", "denial", "not", "none", "rejection", "hell no", "not by any means", "certainly not", "nah", "na", "shall not", "scarcely"]
};

export interface Intent2Number {
    [key: string]: number;
}

export interface Number2Intent {
    [key: number]: string;
}

export interface OptionsPoutine {
    svm?: boolean,
    deep?: boolean,
    train?: boolean,
    acc?: boolean,
    acc_multi?: boolean,
    acc_greedy?: boolean,
    load?: boolean,
    save?: boolean
}

export interface ProbDict {
    [key: string]: number[]
}