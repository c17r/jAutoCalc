/*
    Begin parse functions
    Taken from
        * http://stackoverflow.com/questions/28256/equation-expression-parser-with-precedence
        * http://users.telenet.be/bartl/expressionParser/expressionParser.html
*/
import $ from 'jquery';
import { IData, IOperation, IOperations, IVars, IOptions } from './interfaces';

const ops: IOperations = {
    '+': {
        op: '+',
        precedence: 10,
        assoc: 'L',
        exec: function (l: number, r: number) {
            return l + r;
        }
    },
    '-': {
        op: '-',
        precedence: 10,
        assoc: 'L',
        exec: function (l: number, r: number) {
            return l - r;
        }
    },
    '*': {
        op: '*',
        precedence: 20,
        assoc: 'L',
        exec: function (l: number, r: number) {
            return l * r;
        }
    },
    '/': {
        op: '/',
        precedence: 20,
        assoc: 'L',
        exec: function (l: number, r: number) {
            return l / r;
        }
    },
    '**': {
        op: '**',
        precedence: 30,
        assoc: 'R',
        exec: function (l: number, r: number) {
            return Math.pow(l, r);
        }
    }
};

export const vars: IVars = {
    e: Math.exp(1),
    pi: Math.atan2(1, 1) * 4
};

function parseVal(r: IData): number {
    const startOffset: number = r.offset;
    let value: number;
    let match: RegExpMatchArray;
    // floating point number
    // example of parsing ("lexing") without aid of regular expressions
    value = 0;
    while ('0123456789'.indexOf(r.string.substr(r.offset, 1)) >= 0 && r.offset < r.string.length) {
        r.offset++;
    }
    if (r.string.substr(r.offset, 1) == '.') {
        r.offset++;
        while ('0123456789'.indexOf(r.string.substr(r.offset, 1)) >= 0 && r.offset < r.string.length) {
            r.offset++;
        }
    }
    if (r.offset > startOffset) { // did that work?
        // OK, so I'm lazy...
        return parseFloat(r.string.substr(startOffset, r.offset - startOffset));
    } else if (r.string.substr(r.offset, 1) == '+') { // unary plus
        r.offset++;
        return parseVal(r);
    } else if (r.string.substr(r.offset, 1) == '-') { // unary minus
        r.offset++;
        return negate(parseVal(r));
    } else if (r.string.substr(r.offset, 1) == '(') { // expression in parens
        r.offset++; // eat "("
        value = parseExpr(r);
        if (r.string.substr(r.offset, 1) == ')') {
            r.offset++;
            return value;
        }
        r.error = "Parsing error: ')' expected";
        throw new Error('parseError');
    } else if ((match = /^[a-z_][a-z0-9_]*/i.exec(r.string.substr(r.offset))) != null) { // variable/constant name
        // sorry for the regular expression, but I'm too lazy to manually build a varname lexer
        const name = match[0]; // matched string
        r.offset += name.length;
        if (name in vars) {
            return vars[name]; // I know that thing!
        }
        r.error = "Semantic error: unknown variable '" + name + "'";
        throw new Error('unknownVar');
    } else {
        if (r.string.length == r.offset) {
            r.error = 'Parsing error at end of string: value expected';
            throw new Error('valueMissing');
        } else {
            r.error = "Parsing error: unrecognized value";
            throw new Error('valueNotParsed');
        }
    }
};

function negate(value: number): number {
    return -value;
};

function parseOp(r: IData) {
    if (r.string.substr(r.offset, 2) == '**') {
        r.offset += 2;
        return ops['**'];
    }
    if ('+-*/'.indexOf(r.string.substr(r.offset, 1)) >= 0) {
        return ops[r.string.substr(r.offset++, 1)];
    }
    return null;
};

function parseExpr(r: IData) {
    const stack: IOperation[] = [{
        precedence: 0,
        assoc: 'L'
    }];
    let value = parseVal(r); // first value on the left
    for (; ;) {
        const op = parseOp(r) || {
            precedence: 0,
            assoc: 'L'
        };
        while (op.precedence < stack[stack.length - 1].precedence ||
            (op.precedence == stack[stack.length - 1].precedence && op.assoc == 'L')) {
            // precedence op is too low, calculate with what we've got on the left, first
            const tos = stack.pop();
            if (!tos.exec) {
                return value; // end  reached
            }
            // do the calculation ("reduce"), producing a new value
            value = tos.exec(tos.value, value);
        }
        // store on stack and continue parsing ("shift")
        stack.push({
            op: op.op,
            precedence: op.precedence,
            assoc: op.assoc,
            exec: op.exec,
            value: value
        });
        value = parseVal(r); // value on the right
    }
};

export function parse(str: string, opts: IOptions): number | null {
    const r: IData = {
        string: str,
        offset: 0
    };
    try {
        const value = parseExpr(r);
        if (r.offset < r.string.length) {
            r.error = 'Syntax error: junk found at offset ' + r.offset;
            throw new Error('trailingJunk');
        }
        return value;
    } catch (e) {
        if (opts.showParseError) {
            alert(`${r.error} (${e}):\n${r.string.substr(0, r.offset)}<*>${r.string.substr(r.offset)}`);
        }
        return null;
    }
};
