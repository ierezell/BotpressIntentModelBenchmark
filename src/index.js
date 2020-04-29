"use strict";
exports.__esModule = true;
var load_data_1 = require("./load_data");
var generate_multi_intent_1 = require("./generate_multi_intent");
// import { type } from "os";
var list_utt_int = load_data_1.load_data("./data")[0];
var _a = generate_multi_intent_1.generate_multi_intent(list_utt_int), list_utt_multi_int = _a[0], multi_intents = _a[1], intent2number = _a[2], number2intent = _a[3];
console.log(typeof list_utt_multi_int, typeof multi_intents, typeof intent2number, typeof number2intent);
// type ClassifType = 'svm' | 'deep'
// class Classifier {
//     constructor(public mode: ClassifType) {
//         this.mode = mode;
//     }
//     train() {
//     }
//     ecoin() {
//     }
// }
// // Declare your variables
// var fs = require('fs');
// var menObject;
// // Read the file, and pass it to your callback
// fs.readFile('./men.json, handleJSONFile);
