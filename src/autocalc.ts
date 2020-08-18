import { parse } from './parse';
import { INumberFormat, IOptions, IVars, IFunctions } from './interfaces';
import { getFieldSelector, numCleanse, numberFix } from './utils';

/*
    Heart of the plugin:
        * replaces aggregate functions in the equation string with the result of the aggregate function
            (stripped to digits, decimal, and negative sign).
        * replaces the field names in the equation string with the actual field value (stripped to digits,
            decimal, and negative sign).
        * strips all whitespace out of equation
        * runs equation through parser
        * format result with proper thousand, decimal, and currency values
        * update result field with formatted result value
        * potentially trigger chain reaction calculations if necessary
*/
export function autoCalc(eq: string, fields: string[], result: JQuery, ctx: JQuery, opts: IOptions, vars: IVars, funcs: IFunctions) {
    let resultValue = '';
    const numberFormat: INumberFormat = {
        dec: '',
        decPlaces: -1,
        thou: '',
        sym: '',
        symLoc: -1
    };

    for (const func in funcs) {
        const f = funcs[func];
        const r = new RegExp(f.rgx, 'gi');
        let m: RegExpMatchArray;

        while ((m = r.exec(eq)) != null) {
            const v = f.exec(m[1], ctx, opts, numberFormat);
            eq = eq.replace(new RegExp(f.rgx, 'gi'), v);
        }
    }

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const fieldValue = $(getFieldSelector(field), ctx).val();
        const numValue = numCleanse(fieldValue, opts, numberFormat);
        if (numValue.length == 0) {
            result.val('').change();
            return;
        }
        eq = eq.replace(new RegExp('{' + field + '}', 'g'), numValue);
    }
    eq = eq.replace(/ /g, '');

    if (numberFormat.dec == '') {
        numberFormat.dec = opts.decimalOpts[0];
    }
    if (numberFormat.decPlaces == -1) {
        numberFormat.decPlaces = 0;
    }
    if (numberFormat.thou == '') {
        numberFormat.thou = opts.thousandOpts[0];
    }

    const tmp = parse(eq, opts);
    if (tmp == null) {
        resultValue = '';
    } else {
        resultValue = numberFix(tmp, numberFormat.decPlaces);
    }

    resultValue = resultValue.replace(/\./g, '<c>');
    resultValue = resultValue.replace(/\,/g, '<t>');
    resultValue = resultValue.replace(/<c>/g, numberFormat.dec);
    resultValue = resultValue.replace(/<t>/g, numberFormat.thou);
    if (numberFormat.symLoc > -1) {
        if (numberFormat.symLoc == 0) {
            resultValue = numberFormat.sym + resultValue;
        } else {
            resultValue = resultValue + numberFormat.sym;
        }
    }

    if (opts.smartIntegers) {
        resultValue = resultValue.replace(/[\,\.]0+$/, '');
    }
    if ($.isFunction(opts.onShowResult)) {
        resultValue = opts.onShowResult.call(result, resultValue);
    }

    result.val(resultValue);
    if (opts.chainFire) {
        const current = result.data('current');

        if (current === undefined || current !== resultValue) {
            result.data('current', resultValue);
            result.change();
        }
    }
}
