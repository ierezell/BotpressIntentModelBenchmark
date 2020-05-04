"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const { spawn } = require('child_process');
const Chalk = require('chalk');
class BertPython {
    constructor() { }
    async load() {
        // const server = spawn("python", ['../server.py'])
        let pong;
        let server_down = true;
        // server.stdout.on('data', (data: any) => { console.log(Chalk.cyanBright(`Serveur Flask : ${data}`)); });
        // server.stderr.on('data', (data: any) => { console.log(Chalk.redBright(`ERREUR Serveur Flask : ${data}`)); });
        while (server_down) {
            try {
                pong = await axios_1.default.post('http://localhost:5000/vectorize_utterances', { utterances: "ping" });
                server_down = false;
                break;
            }
            catch (e) {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    async getSentenceEmbedding(utterances) {
        const { data } = await axios_1.default.post('http://localhost:5000/vectorize_utterances', { utterances });
        return data.vectors[0];
    }
}
exports.BertPython = BertPython;
//# sourceMappingURL=bertpython.js.map