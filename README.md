# jQuery AutoCalc

Plugin to automate and simplify "on-the-fly" calculations.  The simplest use is to set the jsAutoCalc="" attribute on a input text tag and call `$("*").jAutoCalc();`

## Installation

`npm i -P jautocalc`

Includes:

- Development version with sourcemaps: 
	- `dist/jautocalc.js` - 24KB
	- `dist/jautocalc.js.map`
- Minimized production version: 
	- `dist/jautocalc.min.js` - 8KB

## Features

* The calculation is ran when one of the value fields gains or loses focus or when the result field is changed.  Each calculation is also ran once when the page is first loaded in case all the value fields come from the database.
* Field names are defined with braces, i.e. "{tax_amount}".
* Field names can be jquery selectors.
* Whitespace in the calculation is ignored.
* When multiple fields have the same name aggregate functions may be used.  The plugin supports:
	* SUM
	* AVG
	* MIN
	* MAX
	* COUNT - counts all fields
	* COUNTNOTEMPTY - counts all non-empty fields
* It can handle add, subtract, multiply, divide, and power (as **) in the proper order of operations.  It will respect parentheses.
* It can handle negative numbers and decimal numbers.
* If a calculation value field has no value yet, the result field is set to blank.
* when the result is calculated, the result field's change event is fired.  This is so calculations can be chained together.  In a shopping cart example, the grand total calculation relies on the subtotal calculation which relies on the sum of the line totals which rely on the quantity and amount fields.
* It will try to figure out what the currency symbol, thousand separator, and decimal separator are and, if found, reuse them in the result field.  By default, if it can't figure out the symbols it will use comma for thousands, period for decimal, and no currency symbol.

## Options

* attribute (string; default is `'jAutoCalc'`): The name of the attribute to look for to setup the auto calculation.
* thousandOpts (string array; default is `[',', '.', ' ']`): Possible options to use as the thousand separator.  Will use the first one it finds in the value fields to format the result field.  If you know this will always be the same, set the option to a single element array.
* decimalOpts (string array: default is `['.', ',']`): Possible options to use as the decimal separator.  Will use the first one it finds in the value fields to format the result field.  If you know this will always be the same, set the option to a single element array.
* decimalPlaces (number; default is `-1`): By default the plugin follows the rules for significant digits (the result is as significant as the least significant value).  There are cases when you might want to override this behavior, i.e. shopping cart where the item quantity will be whole numbers but the item total should contain decimals.
* initFire (boolean; default is `true`): After configuring the value and results fields involved in a calculation, should the calculation be fired right away?  Useful if the value fields are pre-filled from some other source, e.g. database.
* chainFire (boolean: default is `true`): After calculating the result field value should the the field be flagged as changed to potentially fire other calculations?
* keyEventsFire (boolean: default is `false`): Should the plugin do "instant-calculations" everytime keys are pressed in a value field?  By default, calculations are fired when focus is entered or lost on a value field.
* readOnlyResults (boolean: default is `true`): Should the plugin mark the result field(s) as read-only and be un-editable by the user?
* showParseError (boolean: default is `true`): Should the plugin show the parser errors as an alert box?  Useful for debugging/testing.
* emptyAsZero (boolean: default is `false`): empty values are treated as zero.
* smartIntegers (boolean: default is `false`): numbers like 123.000 treated as 123.
* onShowResult (function(el, value): default is `null`): called just before updating element with result.
* funcs (dictionary<string, IFunction>: default is `null`): user-defined functions.
* vars (dictionary<string, number>: default is `null`): user-defined constants.

## Working Example

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="http://github.com/sauerc/jAutoCalc/raw/master/jAutoCalc.js"></script>
    <script type="text/javascript">
    <!--
    	$(document).ready(function() {
    		$('form[name=cart] tr[name=line_items]').jAutoCalc({keyEventsFire: true, decimalPlaces: 2});
    		$('form[name=cart]').jAutoCalc({decimalPlaces: 2});

    	});
    //-->
    </script>
    <form name="cart">
	<table name="cart">
		<tr name="line_items">
			<th>Item</th>
			<th>Qty</th>
			<th>Price</th>
			<th>&nbsp;</th>
			<th>Item Total</th>
		</tr>
		<tr name="line_items">
			<td>Stuff</td>
			<td><input type="text" name="qty" value="1"></td>
			<td><input type="text" name="price" value="9.99"></td>
			<td>&nbsp;</td>
			<td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
		</tr>
		<tr name="line_items">
			<td>More Stuff</td>
			<td><input type="text" name="qty" value="2"></td>
			<td><input type="text" name="price" value="12.50"></td>
			<td>&nbsp;</td>
			<td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
		</tr>
		<tr name="line_items">
			<td>And More Stuff</td>
			<td><input type="text" name="qty" value="3"></td>
			<td><input type="text" name="price" value="99.99"></td>
			<td>&nbsp;</td>
			<td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
			<td>Subtotal</td>
			<td>&nbsp;</td>
			<td><input type="text" name="sub_total" value="" jAutoCalc="SUM({item_total})"></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
			<td>
				Tax:
				<select name="tax">
					<option value=".06">CT Tax</option>
					<option value=".00">Tax Free</option>
				</select>
			</td>
			<td>&nbsp;</td>
			<td><input type="text" name="tax_total" value="" jAutoCalc="{sub_total} * {tax}"></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
			<td>Total</td>
			<td>&nbsp;</td>
			<td><input type="text" name="grand_total" value="" jAutoCalc="{sub_total} + {tax_total}"></td>
		</tr>
	</table>
</form>

See the working example at http://c17r.github.io/jAutoCalc/sample.html
