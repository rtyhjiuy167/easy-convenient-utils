interface FuncQueueParams {
    funcList: Function[];
    argsList: any[];
    intervalTime: number;
}
declare class FuncQueue {
    private params;
    private loading;
    private interval;
    get isLoading(): boolean;
    constructor(params?: Partial<FuncQueueParams>);
    private next;
    push(func: Function, args: any): void;
    start(): void;
    end(): void;
}
export default FuncQueue;
