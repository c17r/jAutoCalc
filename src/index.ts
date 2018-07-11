/*
    jAutoCalc.js
    Copyright (c) 2010 3StorySoftware, LLC
    see LICENSE for details
*/
import $ from 'jquery';
import { init, destroy } from './admin';
import { funcs } from './functions';
import { vars } from './parse';

$.fn.jAutoCalc = Object.assign<JAutoCalcFunction, JAutoCalcDefaults>(
    function (this: JQuery, ...args:any[]): JQuery {

        let method = 'init'
        let o = $.extend({}, $.fn.jAutoCalc.defaults);
        const publicMethods: { [name: string]: Function } = {
            init: init,
            destroy: destroy
        };

        for(const arg of args) {
            if (typeof arg  === 'string') {
                method = arg.toString();
            }
            if (typeof arg === 'object') {
                o = $.extend(o, arg);
            }
        }

        const f = $.extend({}, funcs, o.funcs);
        const v = $.extend([], vars, o.vars);

        if (publicMethods[method]) {
            return publicMethods[method](this, o, v, f);
        } else {
            return init(this, o, v, f);
        }
    },
    {
        defaults: {
            attribute: 'jAutoCalc',
            thousandOpts: [',', '.', ' '],
            decimalOpts: ['.', ','],
            decimalPlaces: -1,
            initFire: true,
            chainFire: true,
            keyEventsFire: false,
            readOnlyResults: true,
            showParseError: true,
            emptyAsZero: false,
            smartIntegers: false,
            onShowResult: null,
            funcs: {},
            vars: {}
        }
    }
);
