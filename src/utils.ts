import $ from 'jquery';
import { INumberFormat, IOptions } from './interfaces';

/**
 *
 * @param eq {string} equation
 * @returns {string[]} field names in equation or empty list
 */
export function findFields(eq: string): string[] {
    const fields = [];
    const r = /{([^}]+)}/gi;
    let m: RegExpMatchArray;

    while ((m = r.exec(eq)) != null) {
        fields.push(m[1]);
    }

    return fields;
};

/**
 *
 * @param field {string} field name
 * @returns {string} jquery input selector
 */
export function getFieldSelector(field: string): string {
    if (/^[a-zA-Z].*/.test(field)) {
        return ':input[name="' + field + '"]';
    }
    return field;
};

/**
 *
 * @param value {string | number | string[]} field value from input control
 * @param numberFormat {INumberFormat} formatted values to be used later
 */
export function numCleanse(value: string | number | string[], opts: IOptions, numberFormat: INumberFormat): string {
    const fieldValue = value + '';
    const sepOpts = opts.decimalOpts.concat(opts.thousandOpts);
    const numOpts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
    let numValue = '';
    let ch = '';
    let dec = '';
    let decLoc = -1;
    let thou = '';
    let sym = '';
    let symLoc = -1;
    let decPlaces = 0;

    for (let z = fieldValue.length - 1; z >= 0; z--) {
        ch = fieldValue.charAt(z);
        if ($.inArray(ch, numOpts) != -1) {
            numValue = ch + numValue;
        } else {
            if (dec == '' && $.inArray(ch, opts.decimalOpts) != -1) {
                decLoc = z;
                dec = ch;
                numValue = '.' + numValue;
            } else if (thou == '' && $.inArray(ch, opts.thousandOpts) != -1) {
                thou = ch;
            } else if (sym == '' && $.inArray(ch, sepOpts) == -1 && (z == 0 || z == fieldValue.length - 1)) {
                sym = ch;
                symLoc = z;
            }
        }
    }

    if (dec != '') {
        decPlaces = fieldValue.length - decLoc - 1;
        if (symLoc > decLoc) {
            decPlaces--;
        }
    }

    if (opts.decimalPlaces != -1) {
        decPlaces = opts.decimalPlaces;
    }

    if (arguments.length === 3) {
        if (numberFormat.dec == '' && dec != '') {
            numberFormat.dec = dec;
        }

        if ((numberFormat.decPlaces == -1 && decPlaces != -1) ||
            (numberFormat.decPlaces != -1 && decPlaces != -1 && decPlaces < numberFormat.decPlaces)) {
            numberFormat.decPlaces = decPlaces;
        }

        if (numberFormat.thou == '' && thou != '') {
            numberFormat.thou = thou;
        }
        if (numberFormat.sym == '' && sym != '') {
            numberFormat.sym = sym;
            numberFormat.symLoc = symLoc;
        }
    }

    if (opts.emptyAsZero && numValue == '') {
        numValue = '0';
    }
    return numValue;
};

/*
    Takes a numeric value, "fixes" it to the specified number of decimal places, and then formats for typical
    US format ("," for thousands and "." for decimal)
*/
export function numberFix(num: number, decPlaces: number): string {
    const n = num.toFixed(decPlaces) + '';
    const x = n.split('.');
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    let x1 = x[0];
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};
