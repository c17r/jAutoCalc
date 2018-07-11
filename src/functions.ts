import $ from 'jquery';
import { INumberFormat, IFunctions, IOptions } from "./interfaces";
import { getFieldSelector, numCleanse} from './utils'

export const funcs: IFunctions = {
    'sum': {
        rgx: 'sum\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery, opts: IOptions, numberFormat: INumberFormat): number {
            let m = 0;
            $(getFieldSelector(field), ctx).each(function () {
                const n = parseFloat(numCleanse($(this).val(), opts, numberFormat));
                m += n;
            });
            return m;
        }
    },
    'avg': {
        rgx: 'avg\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery, opts: IOptions, numberFormat: INumberFormat): number {
            let m = 0;
            const c = $(getFieldSelector(field), ctx).each(function () {
                const n = parseFloat(numCleanse($(this).val(), opts, numberFormat));
                m += n;
            }).length;
            return m / c;
        }
    },
    'min': {
        rgx: 'min\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery, opts: IOptions, numberFormat: INumberFormat): number {
            return Math.min.apply(this, $(getFieldSelector(field), ctx).map(function (i, e) {
                return numCleanse($(e).val(), opts, numberFormat);
            }).get());
        }
    },
    'max': {
        rgx: 'max\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery, opts: IOptions, numberFormat: INumberFormat): number {
            return Math.max.apply(this, $(getFieldSelector(field), ctx).map(function (i, e) {
                return numCleanse($(e).val(), opts, numberFormat);
            }).get());
        }
    },
    'count': {
        rgx: 'count\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery): number {
            return $(getFieldSelector(field), ctx).length;
        }
    },
    'countNotEmpty': {
        rgx: 'countNotEmpty\\({([^}]+)}\\)',
        exec: function (field: string, ctx: JQuery): number {
            return $.grep($(getFieldSelector(field), ctx), function (n) {
                const val = $(n).val() + '';
                return val.length > 0;
            }).length;
        }
    }
}
