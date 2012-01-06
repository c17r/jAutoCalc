/*
	jAutoCalc.js
	Copyright (c) 2010 3StorySoftware, LLC
	see LICENSE for details
*/
(function($){
	$.fn.jAutoCalc = function(method) {
		var opts = {};
		
		var funcs = {
			'sum'	: { rgx: 'sum\\({([^}]+)}\\)', exec: function(field, ctx, numberFormat) {
															m = 0;
															$(':input[name="' + field + '"]', ctx).each(function() {
																n = numCleanse($(this).val(), numberFormat) * 1;
																m += n;
															});
															return m;
														} 
			},
			'avg'	: { rgx: 'avg\\({([^}]+)}\\)', exec: function(field, ctx, numberFormat) {
															m = 0;
															c = $(':input[name="' + field + '"]', ctx).each(function() {
																n = numCleanse($(this).val(), numberFormat) * 1;
																m += n;
															}).length;
															return m/c;
														} 
			},
			'min'	: { rgx: 'min\\({([^}]+)}\\)', exec: function(field, ctx, numberFormat) { return Math.min.apply(this, $(':input[name="' + field + '"]', ctx).map(function(i,e) { return numCleanse($(e).val(), numberFormat) }).get()); } },
			'max'	: { rgx: 'max\\({([^}]+)}\\)', exec: function(field, ctx, numberFormat) { return Math.max.apply(this, $(':input[name="' + field + '"]', ctx).map(function(i,e) { return numCleanse($(e).val(), numberFormat) }).get()); } },
			'count'	: { rgx: 'count\\({([^}]+)}\\)', exec: function(field, ctx) { return $(':input[name="' + field + '"]', ctx).length } }
		};
		
		/*
			Takes a string contain an equation.  Returns an array containing all the field names used in the equation or empty array if it can't find any
		*/
		var findFields = function(eq) {
			fields = new Array();
			r = /{([^}]+)}/gi;
			
			while((m = r.exec(eq)) != null)
				fields[fields.length] = m[1];
				
			return fields;
		};
		
		/*
			Takes the value from a field and strips it down to a numeric value, formatted with a period for the decimal.  If an object is passed in,
			numberFormat information is stored like decimal symbol, thousand symbol, currency symbol and position for potential use later.
		*/
		var numCleanse = function(fieldValue, numberFormat) {
			numValue = '';
			numOpts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
			ch = '';
			dec = '';
			decLoc = -1;
			thou = '';
			sym = '';
			symLoc = -1;
			decPlaces = 0;
			sepOpts = opts.decimalOpts.concat(opts.thousandOpts);
			
			for(z = fieldValue.length - 1; z >= 0; z--) {
				ch = fieldValue.charAt(z);
				if ($.inArray(ch, numOpts) != -1)
					numValue = ch + numValue;
				else {
					if (dec == '' && $.inArray(ch, opts.decimalOpts) != -1) {
						decLoc = z;
						dec = ch;
						numValue = '.' + numValue;
					} else if (thou == '' && $.inArray(ch, opts.thousandOpts) != -1) {
						thou = ch;
					} else if (sym == '' && $.inArray(ch, sepOpts) == -1 && (z == 0 || z == fieldValue.length -1)) {
						sym = ch;
						symLoc = z;
					}
				}
			}
			
			if (dec != '') {
				decPlaces = fieldValue.length - decLoc - 1;
				if (symLoc > decLoc) decPlaces--;
			}
			
			if (opts.decimalPlaces != -1) decPlaces = opts.decimalPlaces;
			
			if (arguments.length == 2) {
				if (numberFormat.dec == '' && dec != '') numberFormat.dec = dec;
				
				if ((numberFormat.decPlaces == -1 && decPlaces != -1) || (numberFormat.decPlaces != -1 && decPlaces != -1 && decPlaces < numberFormat.decPlaces))
					numberFormat.decPlaces = decPlaces;
				
				if (numberFormat.thou == '' && thou != '') numberFormat.thou = thou;
				if (numberFormat.sym == '' && sym != '') {
					numberFormat.sym = sym;
					numberFormat.symLoc = symLoc;
				}
			}
			
			return numValue;
		}
		
		/*
			Heart of the plugin:
				* replaces aggregate functions in the equation string with the result of the aggregate function (stripped to digits, decimal, and negative sign).
				* replaces the field names in the equation string with the actual field value (stripped to digits, decimal, and negative sign).
				* strips all whitespace out of equation
				* runs equation through parser
				* format result with proper thousand, decimal, and currency values
				* update result field with formatted result value
				* potentially trigger chain reaction calculations if necessary
		*/
		var doCalc = function(eq, fields, result, ctx) {
			field = '';
			fieldValue = '';
			numValue = '';
			resultvalue = '';
			var numberFormat = {
				dec: '',
				decPlaces: -1,
				thou: '',
				sym: '',
				symLoc: -1
			};
			
			for(func in funcs) {
				f = funcs[func];
				r = new RegExp(f.rgx, 'gi');
				while((m = r.exec(eq)) != null) {
					v = f.exec(m[1], ctx, numberFormat);
					eq = eq.replace(new RegExp(f.rgx, 'gi'), v);
				}
			}
			
			for(i = 0; i < fields.length; i++) {
				field = fields[i];
				fieldValue = $(':input[name="' + field + '"]', ctx).val();
				numValue = numCleanse(fieldValue, numberFormat);
				if (numValue.length == 0) {
					result.val('').change();
					return;
				}
				eq = eq.replace(new RegExp('{' + field + '}', 'g'), numValue);
			}
			eq = eq.replace(/ /g, '');

			if (numberFormat.dec == '') numberFormat.dec = opts.decimalOpts[0];
			if (numberFormat.decPlaces == -1) numberFormat.decPlaces = 0;
			if (numberFormat.thou == '') numberFormat.thou = opts.thousandOpts[0];
			
			resultValue = parse(eq);
			if (resultValue == null) resultValue = '';
			else resultValue = numberFix(resultValue, numberFormat.decPlaces);
			
			resultValue = resultValue.replace(/\./g, '<c>');
			resultValue = resultValue.replace(/\,/g, '<t>');
			resultValue = resultValue.replace(/\<c\>/g, numberFormat.dec);
			resultValue = resultValue.replace(/\<t\>/g, numberFormat.thou);
			if (numberFormat.symLoc > -1)
				if (numberFormat.symLoc == 0) resultValue = numberFormat.sym + resultValue;
				else resultValue = resultValue + numberFormat.sym;
			
			result.val(resultValue);
			if (opts.chainFire) result.change();
		};
		
		/*
			Takes a numeric value, "fixes" it to the specified number of decimal places, and then formats for typical US format ("," for thousands and "." for decimal)
		*/
		var numberFix = function(num, decPlaces) {
			n = num.toFixed(decPlaces) + '';
			x = n.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1))
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			return x1 + x2;
		};
		
		/*
			Begin parse functions
			Taken from
				* http://stackoverflow.com/questions/28256/equation-expression-parser-with-precedence
				* http://users.telenet.be/bartl/expressionParser/expressionParser.html
		*/
		var ops = {
		   '+'  : {op: '+', precedence: 10, assoc: 'L', exec: function(l,r) { return l+r; } },
		   '-'  : {op: '-', precedence: 10, assoc: 'L', exec: function(l,r) { return l-r; } },
		   '*'  : {op: '*', precedence: 20, assoc: 'L', exec: function(l,r) { return l*r; } },
		   '/'  : {op: '/', precedence: 20, assoc: 'L', exec: function(l,r) { return l/r; } },
		   '**' : {op: '**', precedence: 30, assoc: 'R', exec: function(l,r) { return Math.pow(l,r); } }
		};
		
		var vars = { e: Math.exp(1), pi: Math.atan2(1,1) * 4 };
		
		var parseVal = function(r) {
			var startOffset = r.offset;
			var value;
			var m;
			// floating point number
			// example of parsing ("lexing") without aid of regular expressions
			value = 0;
			while('0123456789'.indexOf(r.string.substr(r.offset, 1)) >= 0 && r.offset < r.string.length) r.offset++;
			if(r.string.substr(r.offset, 1) == '.') {
				r.offset++;
				while('0123456789'.indexOf(r.string.substr(r.offset, 1)) >= 0 && r.offset < r.string.length) r.offset++;
			}
			if(r.offset > startOffset) {  // did that work?
				// OK, so I'm lazy...
				return parseFloat(r.string.substr(startOffset, r.offset-startOffset));
			} else if(r.string.substr(r.offset, 1) == '+') {  // unary plus
				r.offset++;
				return parseVal(r);
			} else if(r.string.substr(r.offset, 1) == '-') {  // unary minus
				r.offset++;
				return negate(parseVal(r));
			} else if(r.string.substr(r.offset, 1) == '(') {  // expression in parens
				r.offset++;   // eat "("
				value = parseExpr(r);
				if(r.string.substr(r.offset, 1) == ')') {
					r.offset++;
					return value;
				}
				r.error = "Parsing error: ')' expected";
				throw 'parseError';
			} else if(m = /^[a-z_][a-z0-9_]*/i.exec(r.string.substr(r.offset))) {  // variable/constant name
				// sorry for the regular expression, but I'm too lazy to manually build a varname lexer
				var name = m[0];  // matched string
				r.offset += name.length;
				if(name in vars) return vars[name];  // I know that thing!
				r.error = "Semantic error: unknown variable '" + name + "'";
				throw 'unknownVar';        
			} else {
				if(r.string.length == r.offset) {
					r.error = 'Parsing error at end of string: value expected';
					throw 'valueMissing';
				} else  {
					r.error = "Parsing error: unrecognized value";
					throw 'valueNotParsed';
				}
			}
		};
		
		var negate = function(value) {
			return -value;
		};

		var parseOp = function(r) {
			if(r.string.substr(r.offset,2) == '**') {
				r.offset += 2;
				return ops['**'];
			}
			if('+-*/'.indexOf(r.string.substr(r.offset,1)) >= 0)
				return ops[r.string.substr(r.offset++, 1)];
			return null;
		};
		
		var parseExpr = function(r) {
			var stack = [{precedence: 0, assoc: 'L'}];
			var op;
			var value = parseVal(r);  // first value on the left
			for(;;){
				op = parseOp(r) || {precedence: 0, assoc: 'L'};
				while(op.precedence < stack[stack.length-1].precedence ||
					  (op.precedence == stack[stack.length-1].precedence && op.assoc == 'L')) {
					// precedence op is too low, calculate with what we've got on the left, first
					var tos = stack.pop();
					if(!tos.exec) return value;  // end  reached
					// do the calculation ("reduce"), producing a new value
					value = tos.exec(tos.value, value);
				}
				// store on stack and continue parsing ("shift")
				stack.push({op: op.op, precedence: op.precedence, assoc: op.assoc, exec: op.exec, value: value});
				value = parseVal(r);  // value on the right
			}
		};
		
		var parse = function(string) {
			var r = {string: string, offset: 0};
			try {
				var value = parseExpr(r);
				if(r.offset < r.string.length){
				  r.error = 'Syntax error: junk found at offset ' + r.offset;
					throw 'trailingJunk';
				}
				return value;
			} catch(e) {
				if (opts.showParseError)
					alert(r.error + ' (' + e + '):\n' + r.string.substr(0, r.offset) + '<*>' + r.string.substr(r.offset));
				return;
			}
		};
		/*
			End parse functions
		*/
		
		/*
			Handle potentially passed in options.  Done as a separate function to handle for both "public" functions of plugins
		*/
		var setup = function(vals) {
			opts = $.extend({}, $.fn.jAutoCalc.defaults);
			
			for(i = 0; i < vals.length; i++) {
				if (typeof vals[i] === 'object')
					opts = $.extend(opts, vals[i]);
			}
		}
		
		/*
			init: 		Sets up the plugin and events on the equation value fields and result fields as necessary.  Result fields are flagged so they are only configured once.
			destroy:	If, for some reason, you want to remove the equation calculation on a live page.
		*/
		var methods  = {
			init: function() {
				return this.each(function() {
					$ctx = $(this);
					$('[' + opts.attribute + ']:not([_jac])', $ctx).each(function() {
						$this = $(this);
						eq = $this.attr(opts.attribute);
						fields = findFields(eq);
						if (fields.length == 0) return;
						for(i = 0; i < fields.length; i++)
							if ($(':input[name="' + fields[i] + '"]', $ctx).length == 0)
								return;
						field = '';
						name = $this.attr('name');
						fireEvents = 'focus.jautocalc change.jautocalc blur.jautocalc';
						if (opts.keyEventsFire) fireEvents += ' keyup.jautocalc keydown.jautocalc keypress.jautocalc';
						for(i = 0; i < fields.length; i++) {
							field = fields[i];
							$(':input[name="' + field + '"]', $ctx).bind(fireEvents, { equation: eq, equationFields: fields, result: $this, context: $ctx }, function(e) {
								doCalc(e.data.equation, e.data.equationFields, e.data.result, e.data.context);
							});
						}
						if (opts.readOnlyResults) $this.attr('readonly', true);
						$this.attr('_jac', '_jac');
						if (opts.initFire) $(':input[name="' + fields[0] + '"]', $ctx).change();
					});
				});
			},
			destroy: function() {
				return this.each(function() {
					$ctx = $(this);
					$('[' + opts.attribute + '][_jac]', $ctx).each(function() {
						$this = $(this);
						eq = $this.attr(opts.attribute);
						fields = findFields(eq);
						if (fields.length == 0) return;
						field = '';
						for(i = 0; i < fields.length; i++) {
							field = fields[i];
							$(':input[name="' + field + '"]', $ctx).unbind('.jautocalc');
						}
						if (opts.readOnlyResults) $this.removeAttr('readonly');
						$this.removeAttr('_jac');
					});
				});
			}
		};
		
		/*
			Main code when plugin is called.
		*/
		setup(arguments);
		if (methods[method])
			return methods[method].apply(this);
		else
			return methods.init.apply(this);
	};
	$.fn.jAutoCalc.defaults = { 
		attribute: 'jAutoCalc', 		// name of the attribute on the result field
		thousandOpts: [',', '.', ' '],	// possible options for thousand separator.  if you know it's always going to be the same, change to a single item array
		decimalOpts: ['.', ','],		// possible options for decimal separator.  if you know it's always going to be the same, change to a single item array
		decimalPlaces: -1,				// by default the plugin follows the rules of signigicant digits.  you may want to override with a fixed number, e.g. shopping cart where item quantity will be whole numbers
		initFire: true, 				// should the plugin fire during the setup phase?  useful if the values of the equation are pre-filled from another source
		chainFire: true, 				// should the plugin fire on the result field when a result is calculated?  useful if the result field is a value in another equation
		keyEventsFire: false,			// should the plugin show "insta-calculations" everytime keys are pressed in a value field?  by default, equation is only run on focus/blur
		readOnlyResults: true,			// should the plugin mark the result field(s) as read-only and un-editable by the user?
		showParseError: true			// should the parser show the error as an alert box?  useful for debugging/testing
	};
})(jQuery);