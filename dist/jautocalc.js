/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/admin.ts":
/*!**********************!*\
  !*** ./src/admin.ts ***!
  \**********************/
/*! exports provided: init, destroy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy", function() { return destroy; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _autocalc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autocalc */ "./src/autocalc.ts");


const NAMESPACE = 'jautocalc';
const TAG = '_' + NAMESPACE;
let EVENTS = 'focus change blur';
function init(jq, opts, vars, funcs) {
    return jq.each(function () {
        const $ctx = $(this);
        $('[' + opts.attribute + ']:not([' + TAG + '])', $ctx).each(function () {
            const $this = $(this);
            const eq = $this.attr(opts.attribute);
            const fields = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["findFields"])(eq);
            if (fields.length == 0) {
                return;
            }
            for (let i = 0; i < fields.length; i++) {
                if ($(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getFieldSelector"])(fields[i]), $ctx).length == 0) {
                    return;
                }
            }
            if (opts.keyEventsFire) {
                EVENTS += ' keyup keydown keypress';
            }
            const fireEvents = EVENTS.split(' ').join('.' + NAMESPACE + ' ');
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                $(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getFieldSelector"])(field), $ctx).bind(fireEvents, {
                    equation: eq,
                    equationFields: fields,
                    result: $this,
                    context: $ctx,
                    opts: opts,
                    vars: vars,
                    funcs: funcs
                }, function (e) {
                    Object(_autocalc__WEBPACK_IMPORTED_MODULE_1__["autoCalc"])(e.data.equation, e.data.equationFields, e.data.result, e.data.context, e.data.opts, e.data.vars, e.data.funcs);
                });
            }
            if (opts.readOnlyResults) {
                $this.attr('readonly', 'readonly');
            }
            $this.attr(TAG, TAG);
            if (opts.initFire) {
                $(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getFieldSelector"])(fields[0]), $ctx).change();
            }
        });
    });
}
function destroy(jq, opts) {
    return jq.each(function () {
        const $ctx = $(this);
        $('[' + opts.attribute + '][' + TAG + ']', $ctx).each(function () {
            const $this = $(this);
            const eq = $this.attr(opts.attribute);
            const fields = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["findFields"])(eq);
            if (fields.length == 0) {
                return;
            }
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                $(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getFieldSelector"])(field), $ctx).unbind('.' + NAMESPACE);
            }
            if (opts.readOnlyResults) {
                $this.removeAttr('readonly');
            }
            $this.removeAttr(TAG);
        });
    });
}


/***/ }),

/***/ "./src/autocalc.ts":
/*!*************************!*\
  !*** ./src/autocalc.ts ***!
  \*************************/
/*! exports provided: autoCalc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoCalc", function() { return autoCalc; });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse */ "./src/parse.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


function autoCalc(eq, fields, result, ctx, opts, vars, funcs) {
    let resultValue = '';
    const numberFormat = {
        dec: '',
        decPlaces: -1,
        thou: '',
        sym: '',
        symLoc: -1
    };
    for (const func in funcs) {
        const f = funcs[func];
        const r = new RegExp(f.rgx, 'gi');
        let m;
        while ((m = r.exec(eq)) != null) {
            const v = f.exec(m[1], ctx, opts, numberFormat);
            eq = eq.replace(new RegExp(f.rgx, 'gi'), v);
        }
    }
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const fieldValue = $(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).val();
        const numValue = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numCleanse"])(fieldValue, opts, numberFormat);
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
    const tmp = Object(_parse__WEBPACK_IMPORTED_MODULE_0__["parse"])(eq, opts);
    if (tmp == null) {
        resultValue = '';
    }
    else {
        resultValue = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numberFix"])(tmp, numberFormat.decPlaces);
    }
    resultValue = resultValue.replace(/\./g, '<c>');
    resultValue = resultValue.replace(/\,/g, '<t>');
    resultValue = resultValue.replace(/<c>/g, numberFormat.dec);
    resultValue = resultValue.replace(/<t>/g, numberFormat.thou);
    if (numberFormat.symLoc > -1) {
        if (numberFormat.symLoc == 0) {
            resultValue = numberFormat.sym + resultValue;
        }
        else {
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


/***/ }),

/***/ "./src/functions.ts":
/*!**************************!*\
  !*** ./src/functions.ts ***!
  \**************************/
/*! exports provided: funcs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "funcs", function() { return funcs; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


const funcs = {
    'sum': {
        rgx: 'sum\\({([^}]+)}\\)',
        exec: function (field, ctx, opts, numberFormat) {
            let m = 0;
            jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).each(function () {
                const n = parseFloat(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numCleanse"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).val(), opts, numberFormat));
                m += n;
            });
            return m;
        }
    },
    'avg': {
        rgx: 'avg\\({([^}]+)}\\)',
        exec: function (field, ctx, opts, numberFormat) {
            let m = 0;
            const c = jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).each(function () {
                const n = parseFloat(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numCleanse"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).val(), opts, numberFormat));
                m += n;
            }).length;
            return m / c;
        }
    },
    'min': {
        rgx: 'min\\({([^}]+)}\\)',
        exec: function (field, ctx, opts, numberFormat) {
            return Math.min.apply(this, jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).map(function (i, e) {
                return Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numCleanse"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()(e).val(), opts, numberFormat);
            }).get());
        }
    },
    'max': {
        rgx: 'max\\({([^}]+)}\\)',
        exec: function (field, ctx, opts, numberFormat) {
            return Math.max.apply(this, jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).map(function (i, e) {
                return Object(_utils__WEBPACK_IMPORTED_MODULE_1__["numCleanse"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()(e).val(), opts, numberFormat);
            }).get());
        }
    },
    'count': {
        rgx: 'count\\({([^}]+)}\\)',
        exec: function (field, ctx) {
            return jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx).length;
        }
    },
    'countNotEmpty': {
        rgx: 'countNotEmpty\\({([^}]+)}\\)',
        exec: function (field, ctx) {
            return jquery__WEBPACK_IMPORTED_MODULE_0___default.a.grep(jquery__WEBPACK_IMPORTED_MODULE_0___default()(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFieldSelector"])(field), ctx), function (n) {
                const val = jquery__WEBPACK_IMPORTED_MODULE_0___default()(n).val() + '';
                return val.length > 0;
            }).length;
        }
    }
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin */ "./src/admin.ts");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions */ "./src/functions.ts");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parse */ "./src/parse.ts");




jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fn.jAutoCalc = Object.assign(function (...args) {
    let method = 'init';
    let o = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.extend({}, jquery__WEBPACK_IMPORTED_MODULE_0___default.a.fn.jAutoCalc.defaults);
    const publicMethods = {
        init: _admin__WEBPACK_IMPORTED_MODULE_1__["init"],
        destroy: _admin__WEBPACK_IMPORTED_MODULE_1__["destroy"]
    };
    for (const arg of args) {
        if (typeof arg === 'string') {
            method = arg.toString();
        }
        if (typeof arg === 'object') {
            o = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.extend(o, arg);
        }
    }
    const f = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.extend({}, _functions__WEBPACK_IMPORTED_MODULE_2__["funcs"], o.funcs);
    const v = jquery__WEBPACK_IMPORTED_MODULE_0___default.a.extend([], _parse__WEBPACK_IMPORTED_MODULE_3__["vars"], o.vars);
    if (publicMethods[method]) {
        return publicMethods[method](this, o, v, f);
    }
    else {
        return Object(_admin__WEBPACK_IMPORTED_MODULE_1__["init"])(this, o, v, f);
    }
}, {
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
});


/***/ }),

/***/ "./src/parse.ts":
/*!**********************!*\
  !*** ./src/parse.ts ***!
  \**********************/
/*! exports provided: vars, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vars", function() { return vars; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
const ops = {
    '+': {
        op: '+',
        precedence: 10,
        assoc: 'L',
        exec: function (l, r) {
            return l + r;
        }
    },
    '-': {
        op: '-',
        precedence: 10,
        assoc: 'L',
        exec: function (l, r) {
            return l - r;
        }
    },
    '*': {
        op: '*',
        precedence: 20,
        assoc: 'L',
        exec: function (l, r) {
            return l * r;
        }
    },
    '/': {
        op: '/',
        precedence: 20,
        assoc: 'L',
        exec: function (l, r) {
            return l / r;
        }
    },
    '**': {
        op: '**',
        precedence: 30,
        assoc: 'R',
        exec: function (l, r) {
            return Math.pow(l, r);
        }
    }
};
const vars = {
    e: Math.exp(1),
    pi: Math.atan2(1, 1) * 4
};
function parseVal(r) {
    const startOffset = r.offset;
    let value;
    let match;
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
    if (r.offset > startOffset) {
        return parseFloat(r.string.substr(startOffset, r.offset - startOffset));
    }
    else if (r.string.substr(r.offset, 1) == '+') {
        r.offset++;
        return parseVal(r);
    }
    else if (r.string.substr(r.offset, 1) == '-') {
        r.offset++;
        return negate(parseVal(r));
    }
    else if (r.string.substr(r.offset, 1) == '(') {
        r.offset++;
        value = parseExpr(r);
        if (r.string.substr(r.offset, 1) == ')') {
            r.offset++;
            return value;
        }
        r.error = "Parsing error: ')' expected";
        throw new Error('parseError');
    }
    else if ((match = /^[a-z_][a-z0-9_]*/i.exec(r.string.substr(r.offset))) != null) {
        const name = match[0];
        r.offset += name.length;
        if (name in vars) {
            return vars[name];
        }
        r.error = "Semantic error: unknown variable '" + name + "'";
        throw new Error('unknownVar');
    }
    else {
        if (r.string.length == r.offset) {
            r.error = 'Parsing error at end of string: value expected';
            throw new Error('valueMissing');
        }
        else {
            r.error = "Parsing error: unrecognized value";
            throw new Error('valueNotParsed');
        }
    }
}
;
function negate(value) {
    return -value;
}
;
function parseOp(r) {
    if (r.string.substr(r.offset, 2) == '**') {
        r.offset += 2;
        return ops['**'];
    }
    if ('+-*/'.indexOf(r.string.substr(r.offset, 1)) >= 0) {
        return ops[r.string.substr(r.offset++, 1)];
    }
    return null;
}
;
function parseExpr(r) {
    const stack = [{
            precedence: 0,
            assoc: 'L'
        }];
    let value = parseVal(r);
    for (;;) {
        const op = parseOp(r) || {
            precedence: 0,
            assoc: 'L'
        };
        while (op.precedence < stack[stack.length - 1].precedence ||
            (op.precedence == stack[stack.length - 1].precedence && op.assoc == 'L')) {
            const tos = stack.pop();
            if (!tos.exec) {
                return value;
            }
            value = tos.exec(tos.value, value);
        }
        stack.push({
            op: op.op,
            precedence: op.precedence,
            assoc: op.assoc,
            exec: op.exec,
            value: value
        });
        value = parseVal(r);
    }
}
;
function parse(str, opts) {
    const r = {
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
    }
    catch (e) {
        if (opts.showParseError) {
            alert(`${r.error} (${e}):\n${r.string.substr(0, r.offset)}<*>${r.string.substr(r.offset)}`);
        }
        return null;
    }
}
;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: findFields, getFieldSelector, numCleanse, numberFix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findFields", function() { return findFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFieldSelector", function() { return getFieldSelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numCleanse", function() { return numCleanse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numberFix", function() { return numberFix; });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);

function findFields(eq) {
    const fields = [];
    const r = /{([^}]+)}/gi;
    let m;
    while ((m = r.exec(eq)) != null) {
        fields.push(m[1]);
    }
    return fields;
}
;
function getFieldSelector(field) {
    if (/^[a-zA-Z].*/.test(field)) {
        return ':input[name="' + field + '"]';
    }
    return field;
}
;
function numCleanse(value, opts, numberFormat) {
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
        if (jquery__WEBPACK_IMPORTED_MODULE_0___default.a.inArray(ch, numOpts) != -1) {
            numValue = ch + numValue;
        }
        else {
            if (dec == '' && jquery__WEBPACK_IMPORTED_MODULE_0___default.a.inArray(ch, opts.decimalOpts) != -1) {
                decLoc = z;
                dec = ch;
                numValue = '.' + numValue;
            }
            else if (thou == '' && jquery__WEBPACK_IMPORTED_MODULE_0___default.a.inArray(ch, opts.thousandOpts) != -1) {
                thou = ch;
            }
            else if (sym == '' && jquery__WEBPACK_IMPORTED_MODULE_0___default.a.inArray(ch, sepOpts) == -1 && (z == 0 || z == fieldValue.length - 1)) {
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
}
;
function numberFix(num, decPlaces) {
    const n = num.toFixed(decPlaces) + '';
    const x = n.split('.');
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    let x1 = x[0];
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
;


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=jautocalc.js.map