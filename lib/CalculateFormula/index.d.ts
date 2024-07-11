export type op = "+" | "-" | "*" | "×" | "/" | "÷";
export interface CharMap {
    [proName: string]: {
        max: number;
        min: number;
    };
}
export interface CalculateFormulaParams {
    infix: Array<string | number>;
    allowedChar?: boolean;
    charMap?: CharMap;
    autoChange?: boolean;
}
export default class CalculateFormula {
    readonly infix: Array<string | number>;
    readonly isLegal: boolean;
    readonly result: number;
    readonly minRes: number;
    readonly maxRes: number;
    readonly formula: string;
    private allowedChar;
    readonly charMap: CharMap;
    private autoChange;
    /**
     * let cf1 = new CalculateFormula({ infix: ["(", 2, "+", 1, ")", "*", 3, "×", 2, "/", 2, "÷", 2] });
     *
     * let cf2 = new CalculateFormula({ infix: ["1", "+", "3"], autoChange: true });
     *
     * let cf3 = new CalculateFormula({ infix: ["A", "+", 3], allowedChar: true, charMap: { "A": { min: 1, max: 2 } } });
     */
    constructor(params: CalculateFormulaParams);
    private _infixCalculate;
    private _calculateMin;
    private _calculateMax;
    private _cal;
    private _replace;
    private _isOperator;
    private _isOpOrBracket;
    private _isOperand;
    private _ge;
}
