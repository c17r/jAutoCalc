import { findFields, getFieldSelector } from './utils';
import { autoCalc } from './autocalc';
import { IOptions, IVars, IFunctions } from './interfaces';

const NAMESPACE = 'jautocalc';
const TAG = '_' + NAMESPACE;
let EVENTS = 'focus change blur'

export function init(jq: JQuery, opts: IOptions, vars: IVars, funcs: IFunctions): JQuery {
    return jq.each(function (this: HTMLElement) {
        const $ctx = $(this);
        $('[' + opts.attribute + ']:not([' + TAG + '])', $ctx).each(function (this: HTMLElement) {
            const $this = $(this);
            const eq = $this.attr(opts.attribute);
            const fields = findFields(eq);

            if (fields.length == 0) {
                return;
            }

            for (let i = 0; i < fields.length; i++) {
                if ($(getFieldSelector(fields[i]), $ctx).length == 0) {
                    return;
                }
            }

            if (opts.keyEventsFire) {
                EVENTS += ' keyup keydown keypress';
            }

            const fireEvents = EVENTS.split(' ').join('.' + NAMESPACE + ' ');

            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                $(getFieldSelector(field), $ctx).bind(fireEvents, {
                    equation: eq,
                    equationFields: fields,
                    result: $this,
                    context: $ctx,
                    opts: opts,
                    vars: vars,
                    funcs: funcs
                }, function (e) {
                    autoCalc(e.data.equation, e.data.equationFields, e.data.result, e.data.context, e.data.opts, e.data.vars, e.data.funcs);
                });
            }
            if (opts.readOnlyResults) {
                $this.attr('readonly', 'readonly');
            }
            $this.attr(TAG, TAG);
            if (opts.initFire) {
                $(getFieldSelector(fields[0]), $ctx).change();
            }
        });
    });
}

export function destroy(jq: JQuery, opts: IOptions): JQuery {
    return jq.each(function (this: HTMLElement) {
        const $ctx = $(this);
        $('[' + opts.attribute + '][' + TAG + ']', $ctx).each(function (this: HTMLElement) {
            const $this = $(this);
            const eq = $this.attr(opts.attribute);
            const fields = findFields(eq);
            if (fields.length == 0) {
                return;
            }
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                $(getFieldSelector(field), $ctx).unbind('.' + NAMESPACE);
            }
            if (opts.readOnlyResults) {
                $this.removeAttr('readonly');
            }
            $this.removeAttr(TAG);
        });
    });
}
