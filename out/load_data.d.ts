import { Intent, Intent2Number, Number2Intent } from "./types";
/**
 *
 * @param path chamin du dossier contenant les json
 *  Ex
 *  ```
 *  load_data("./data"])
 * ```
 * Used then in @see{@link {[ici]{ generate_multi_intent.generate_multi_intent } } }
 */
export declare function load_data(path: string): [Array<[string, Intent]>, Set<string>, Intent2Number, Number2Intent];
