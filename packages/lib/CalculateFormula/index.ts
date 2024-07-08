
export type op = "+" | "-" | "*" | "×" | "/" | "÷"
export interface CharMap {
    [proName: string]: {
        max: number,
        min: number
    }
}
export interface CalculateFormulaParams {
    infix: Array<string | number>,
    allowedChar?: boolean,
    charMap?: CharMap,
    autoChange?: boolean
}
export default class CalculateFormula {

    readonly infix: Array<string | number>;
    readonly isLegal: boolean;
    readonly result: number;
    readonly minRes: number;
    readonly maxRes: number;
    readonly formula: string;
    private allowedChar = false;
    readonly charMap = {} as CharMap;
    private autoChange = false;

    /**
     * let cf1 = new CalculateFormula({ infix: ["(", 2, "+", 1, ")", "*", 3, "×", 2, "/", 2, "÷", 2] });
     * 
     * let cf2 = new CalculateFormula({ infix: ["1", "+", "3"], autoChange: true });
     * 
     * let cf3 = new CalculateFormula({ infix: ["A", "+", 3], allowedChar: true, charMap: { "A": { min: 1, max: 2 } } });
     */
    constructor(params: CalculateFormulaParams) {
        this.infix = params.infix;
        if (params.allowedChar) {
            this.allowedChar = params.allowedChar;
        }
        if (params.charMap) {
            this.charMap = params.charMap;
        }
        if (params.autoChange) {
            this.autoChange = params.autoChange;
        }
        const res = this._infixCalculate(this.infix);
        this.isLegal = res.isLegal;
        this.result = res.result;


        if (this.isLegal) {
            this.formula = params.infix.join("");
            this.minRes = this._calculateMin(this.infix);
            this.maxRes = this._calculateMax(this.infix);
        }
    }

    private _infixCalculate(infix: Array<string | number>, allowedChar = this.allowedChar) {
        let res = { isLegal: false, result: 0 };
        if (!allowedChar) {
            let stack1 = [],
                stack2 = [],
                preOpOrBracket = false; // 判断上一个是 OpOrBracket 还是 operand

            for (let i = 0; i < infix.length; i++) {
                if (infix[i] === undefined || infix[i] === null) return res
                if (infix[i] === "(" || this._isOperator(infix[i])) {
                    stack1.push(infix[i]);
                } else {
                    if (this._isOperand(infix[i])) {
                        stack2.push(infix[i]);
                    }
                    if (
                        infix[i] === ")" ||
                        (i + 1 === infix.length && stack1.length !== 0)
                    ) {
                        let operator = stack1[stack1.length - 1];
                        if (preOpOrBracket && infix[i] === ")") return res;

                        while (operator !== "(") {
                            let operatorIdx = stack1.length - 1;
                            let rightOperandIdx = stack2.length - 1;

                            while (
                                stack1.length !== 0 &&
                                this._ge(stack1[operatorIdx - 1], stack1[operatorIdx])
                            ) {
                                operatorIdx--;
                                rightOperandIdx--;
                            }
                            let rightOperand = stack2[rightOperandIdx];
                            let leftOperand = stack2[rightOperandIdx - 1];
                            operator = stack1[operatorIdx];
                            if (leftOperand === undefined || rightOperand === undefined)
                                return res;
                            if ((operator === "/" || operator === "÷") && rightOperand === 0)
                                return res;
                            if (typeof leftOperand === 'string' || typeof rightOperand === 'string') {
                                console.warn("you should set autoChange to true")
                            }
                            stack2.splice(
                                rightOperandIdx - 1,
                                2,
                                this._cal(Number(leftOperand), operator, Number(rightOperand))
                            );
                            stack1.splice(operatorIdx, 1);
                            if (stack1.length === 0) break;
                            operator = stack1[stack1.length - 1]
                        }

                        stack1.pop();
                    }
                }
                preOpOrBracket = this._isOpOrBracket(infix[i]);
            }
            if (stack1.length + 1 !== stack2.length) return res;
            res.result = stack2.pop();
        } else {
            res.result = undefined;
            let stack = [],
                operatorCount = 0,
                operandCount = 0;
            for (let i = 0; i < infix.length; i++) {
                if (infix[i] === "(") {
                    stack.push(infix[i]);
                } else if (infix[i] === ")") {
                    let leftBracket = stack.pop();
                    if (i === 0) return res;
                    if (leftBracket !== "(" || infix[i - 1] === "(") return res;
                } else if (this._isOperator(infix[i])) {
                    if (i + 1 === infix.length || i === 0) return res;
                    if (this._isOperator(infix[i + 1]) || this._isOperator(infix[i - 1]))
                        return res;
                    operatorCount++;
                } else operandCount++;
            }

            if (stack.length !== 0) return res;
            if (operatorCount + 1 !== operandCount) return res;
        }
        res.isLegal = true;
        return res;
    }

    private _calculateMin(infix: Array<string | number>, label = "min", autoChange = this.autoChange) {
        let minInfix = infix.concat();
        for (let i = 0; i < minInfix.length; i++) {
            let obj = this.charMap[minInfix[i]];
            if (autoChange && !Number.isNaN(Number(minInfix[i]))) {
                minInfix[i] = Number(minInfix[i])
            } else if (
                !this._isOpOrBracket(minInfix[i]) && typeof minInfix[i] !== 'number'
            ) {
                // 进行转换
                if (obj === undefined) {
                    console.log(`charMap ${minInfix[i]} is undefined`);
                    return;
                }
                if (Number.isNaN(Number(obj[label]))) {
                    console.error(`${minInfix[i]}.${label} is NaN`);
                    return;
                }
                minInfix[i] = Number(obj[label]);
            }
        }
        const res = this._infixCalculate(minInfix, false);
        return res.result;
    }

    private _calculateMax(infix: Array<string | number>, label = "max", autoChange = this.autoChange) {

        let maxInfix = infix.concat();
        for (let i = 0; i < maxInfix.length; i++) {
            let obj = this.charMap[maxInfix[i]];

            // 如果记录的为数值或能转成数值的字符串，则不需要转换对应的 min
            // 否则需要转换，转换时需要判断待转换值是否为 数值或能转成数值的字符串
            if (autoChange && !Number.isNaN(Number(maxInfix[i]))) {
                maxInfix[i] = Number(maxInfix[i])
            } else if (
                !this._isOpOrBracket(maxInfix[i]) && typeof maxInfix[i] !== 'number'
            ) {
                // 进行转换
                if (obj === undefined) {
                    console.log(`charMap ${maxInfix[i]} is undefined`);
                    return;
                }
                if (Number.isNaN(Number(obj[label]))) {
                    console.error(`${maxInfix[i]}.${label} is NaN`);
                    return;
                }
                maxInfix[i] = Number(obj[label]);
            }

        }

        const res = this._infixCalculate(maxInfix, false);
        return res.result;
    }

    private _cal(LeftNum: number, op: op, RightNum: number) {
        switch (op) {
            case "+":
                return LeftNum + RightNum;
            case "-":
                return LeftNum - RightNum;
            case "*":
            case "×":
                return LeftNum * RightNum;
            case "/":
            case "÷":
                return LeftNum / RightNum;
        }
    }
    private _replace(a: string) {
        switch (a) {
            case "(":
                return 0;
            case "+":
                return 1;
            case "-":
                return 2;
            case "*":
            case "×":
                return 3;
            case "/":
            case "÷":
                return 4;
        }
    }

    private _isOperator(a: string | number) {
        return /^[\+\-\*\/÷×]$/.test(String(a));
    }
    private _isOpOrBracket(a: string | number) {
        return /^[\+\-\*\/\(\)×÷]$/.test(String(a));
    }
    private _isOperand(a: string | number) {
        return !Number.isNaN(Number(a));
    }
    private _ge(large: string, small: string) {
        return this._replace(small) <= this._replace(large) ? true : false;
    }
}
