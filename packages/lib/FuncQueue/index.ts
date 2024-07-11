interface FuncQueueParams {
    funcList: Function[]
    argsList: any[]
    intervalTime: number
}


class FuncQueue {
    private params: FuncQueueParams = {
        funcList: [],
        argsList: [],
        intervalTime: 1000
    }
    private loading: boolean
    private interval: number | NodeJS.Timeout | undefined
    get isLoading() {
        return this.loading
    }

    constructor(params?: Partial<FuncQueueParams>) {
        Object.assign(this.params, params)
    }

    private async next() {
        this.loading = true
        const func = this.params.funcList.shift()
        if (func) {
            const args = this.params.argsList.shift()
            await func(args)
        }
        this.loading = false
    }

    push(func: Function, args: any) {
        this.params.funcList.push(func)
        this.params.argsList.push(args)
    }

    start() {
        this.end()
        this.interval = setInterval(() => {
            if (!this.loading) {
                this.next()
            }
        }, this.params.intervalTime)
    }

    end() {
        clearInterval(this.interval)
        this.params.funcList = []
        this.params.argsList = []
        this.loading = false
    }
}
export default FuncQueue