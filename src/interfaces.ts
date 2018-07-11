
export interface IFunctions {
    [func: string]: IFunction;
}

export interface IData {
    string: string;
    offset: number;
    error?: string;
}

export interface IOperation {
    op?: string;
    precedence: number;
    assoc: string;
    exec?: Function;
    value?: number;
}

export interface IOperations {
    [op: string]: IOperation;
}

export interface IVars {
    [name: string]: number;
}

export interface INumberFormat {
    dec: string;
    decPlaces: number;
    thou: string;
    sym: string;
    symLoc: number;
}

export interface IOptions {
    attribute?: string, // name of the attribute on the result field
    thousandOpts?: string[], // possible options for thousand separator.  if you know it's always going to be the same, change to a single item array
    decimalOpts?: string[], // possible options for decimal separator.  if you know it's always going to be the same, change to a single item array
    decimalPlaces?: number, // by default the plugin follows the rules of signigicant digits.  you may want to override with a fixed number, e.g. shopping cart where item quantity will be whole numbers
    initFire?: boolean, // should the plugin fire during the setup phase?  useful if the values of the equation are pre-filled from another source
    chainFire?: boolean, // should the plugin fire on the result field when a result is calculated?  useful if the result field is a value in another equation
    keyEventsFire?: boolean, // should the plugin show "insta-calculations" everytime keys are pressed in a value field?  by default, equation is only run on focus/blur
    readOnlyResults?: boolean, // should the plugin mark the result field(s) as read-only and un-editable by the user?
    showParseError?: boolean, // should the parser show the error as an alert box?  useful for debugging/testing
    emptyAsZero?: boolean, // empty values are treated as zero
    smartIntegers?: boolean, // numbers like 123.0000 displayed as 123
    onShowResult?: Function, // function (el,value) - allows to change value, which will be assigned to tl
    funcs?: { [name: string]: IFunction }, // register user defined functions
    vars?: { [name: string]: number } // user defined vars
}
