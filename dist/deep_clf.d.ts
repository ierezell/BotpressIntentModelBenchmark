export declare class Deep_clf {
    clf: any;
    constructor(nb_intent: number);
    train(datas: number[][]): void;
    predict(data: number[][]): any;
}
