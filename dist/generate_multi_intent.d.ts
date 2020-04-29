import { Intent } from "./types";
/**
 *
 * @param list_utt_int Liste des utterances a un seul intent
 *  Ex
 *  ```
 *  generate_multi_intent([["Coucou", "greetings"], ["Book me a flight for NY", "Book_flight"]])
 * ```
 */
export declare function generate_multi_intent(list_utt_int: Array<[string, Intent]>): [Array<[string, Intent]>, Set<Intent>];
