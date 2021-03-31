const express = require("express");
const { readFileSync } = require("fs");
const path = require("path");

const app = express();
const port = 8000;

const mix = (filename) => {
	const mixPath = path.resolve(__dirname, "./dist/mix-manifest.json");

    const entries = JSON.parse(readFileSync(mixPath, "utf-8"));
	const entry = entries[filename];
	if (!entry) {
		throw new Error(`${filename} not found in mix manifest.`);
	}

	const hotPath = path.resolve(__dirname, "./dist/hot");
	try {
		const hotUrl = readFileSync(hotPath, "utf-8");
		return `${hotUrl.trim()}${entry}`;
	} catch(err) {
		return entry;
	}
};

app
	.get('/', (req, res) => {
		res.send(`
<html>
    <head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script type="text/javascript" src="${mix('/jautocalc.js')}"></script>
        <script type="text/javascript">
        <!--
            $(function() {

                function autoCalcSetup() {
                    $('form#cart').jAutoCalc('destroy');
                    $('form#cart tr.line_items').jAutoCalc({keyEventsFire: true, decimalPlaces: 2, emptyAsZero: true});
                    $('form#cart').jAutoCalc({decimalPlaces: 2});
                }
                autoCalcSetup();


                $('button.row-remove').on("click", function(e) {
                    e.preventDefault();

                    var form = $(this).parents('form')
                    $(this).parents('tr').remove();
                    autoCalcSetup();

                });

                $('button.row-add').on("click", function(e) {
                    e.preventDefault();

                    var $table = $(this).parents('table');
                    var $top = $table.find('tr.line_items').first();
                    var $new = $top.clone(true);

                    $new.jAutoCalc('destroy');
                    $new.insertBefore($top);
                    $new.find('input[type=text]').val('');
                    autoCalcSetup();

                });
                
                $('table#nonreactive tbody tr').jAutoCalc({
					initFire: false,
					readOnlyResults: false,
					chainFire: true,
					decimalPlaces: 2
                });

            });
        //-->
        </script>
    </head>
    <body>
        <form id="cart">
            <table name="cart">
                <tr>
                    <th></th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>&nbsp;</th>
                    <th>Item Total</th>
                </tr>
                <tr class="line_items">
                    <td><button class="row-remove">Remove</button></td>
                    <td>Stuff</td>
                    <td><input type="text" name="qty" value="1"></td>
                    <td><input type="text" name="price" value="9.99"></td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
                </tr>
                <tr class="line_items">
                    <td><button class="remove">Remove</button></td>
                    <td>More Stuff</td>
                    <td><input type="text" name="qty" value="2"></td>
                    <td><input type="text" name="price" value="12.50"></td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
                </tr>
                <tr class="line_items">
                    <td><button class="remove">Remove</button></td>
                    <td>And More Stuff</td>
                    <td><input type="text" name="qty" value="3"></td>
                    <td><input type="text" name="price" value="99.99"></td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="item_total" value="" jAutoCalc="{qty} * {price}"></td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td>Subtotal</td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="sub_total" value="" jAutoCalc="SUM({item_total})"></td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td>
                        Tax:
                        <select name="tax">
                            <option value=".06">CT Tax</option>
                            <option selected value=".00">Tax Free</option>
                        </select>
                    </td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="tax_total" value="" jAutoCalc="{sub_total} * {tax}"></td>
                </tr>
                <tr>
                    <td colspan="3">&nbsp;</td>
                    <td>Total</td>
                    <td>&nbsp;</td>
                    <td><input type="text" name="grand_total" value="" jAutoCalc="{sub_total} + {tax_total}"></td>
                </tr>
                <tr>
                    <td colspan="99"><button class="row-add">Add Row</button></td>
                </tr>
            </table>
        </form>
        <hr>
		<table id="nonreactive">
			<thead>
				<th>Quantity</th>
				<th>Price</th>
				<th>Total</th>
			</thead>
			<tbody>
				  <tr>
					<td><input name="qty" value="2" /></td>
					<td><input name="price" value="3" jAutoCalc="{total} / {!qty}" /></td>
					<td><input name="total" value="6" jAutoCalc="{qty} * {price}" /></td>
				  </tr>
			</tbody>
		</table>
    </body>
</html>

	`);
	})
	.use(express.static('dist'))
	;

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
