let resourceUrl = "http://194.233.80.156:9091/Dummy/quotes?";
let marketIds = "023";
let body = $("#list-top-volume");

function getMarketId() {
	let value = $('select[name="market"]').val();
	if( value == undefined || !marketIds.includes(value) ){
		return 0
	}
	return value;
}

function getListId() {
	let value = $( ".quotes-btn-submenu.active" ).data("value"); 
	if( value == undefined || parseInt(value, 10) < 0 || parseInt(value, 10) > 2 ){
		return 0
	}
	return value;
}

function clearData() {
	body.html("");
}

function getData( appendData ) {
	let marketId = getMarketId();
	let listId = getListId();
	let url = resourceUrl + "market_id=" + marketId + "&list=" + listId;

    $.ajax( {
		url     : url
        , success : function( results ){
			results = JSON.parse(results);
			if( appendData ){
				populateTable(results)
			}else{
				updateTable(results)
			}
        }
        , error   : function(){
            alert( 'Failed to fetch result, please try again.' );
        }
    } ).done( );
}

function updateTable(data) {
	let existing = $('body').find('#list-top-volume').children('tr');

	for (let i = 0; i < data.length; i++) {
		item = data[i];
		let change = item.last - item.previous;
		let changePct = change/item.previous*100;
		let changeSign = change > 0 ? "+" : "";
		let divClass = change > 0 ? "nu_positive_txt" : "nu_negative_txt";
		let buy = `${item.buy_price.toFixed(3)}<br>${intToString(item.buy_volume)}`;
		let sell = `${item.sell_price.toFixed(3)}<br>${intToString(item.sell_volume)}`;

		let updatedStock = "";
		let updatedBuy = "";
		let updatedSell = "";

		if(existing[i].id != item.stockcode){
			updatedStock = "yellow";
		}

		if(existing[i].attributes['data-buy']  != buy){
			updatedBuy = "yellow";
		}

		if(existing[i].attributes['data-sell']  != sell){
			updatedSell = "yellow";
		}

		let row = `
		<tr id="${item.stockcode}" data-buy="${buy}" data-sell="${sell}">
			<td>
				<div style="outline-style:none;" tabindex="0">
					<div class="quotes-col-stock-code ${i}_0 ${updatedStock}">
						<div class="quotes-col-stock-name nu_bold" title="${item.name}">${item.name}</div>
						<div title="${item.stockcode}">${item.stockcode}</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-last-vol ${i}_1">
						<div class="${divClass}">${item.last.toFixed(2)}<br>${intToString(item.volume)}</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-chng-pect ${i}_2">
						<div class="nu_positive_txt">
							<div class="${divClass}">${changeSign}${change.toFixed(3)}<br>${changeSign}${changePct.toFixed(1)}%</div>
						</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;" class="${updatedBuy}">
					<div class="quotes-col-buy-vol ${i}_3">${item.buy_price.toFixed(3)}<br>${intToString(item.buy_volume)}</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;" class="${updatedSell}">
					<div class="quotes-col-sell-vol ${i}_4">${item.sell_price.toFixed(3)}<br>${intToString(item.sell_volume)}</div>
				</div>
			</td>
			<td></td>
		</tr>
		`

		// i need a way to update the children
	};
}

function populateTable(data) {
	for (let i = 0; i < data.length; i++) {
		let item = data[i];
		let change = item.last - item.previous;
		let changePct = change/item.previous*100;
		let changeSign = change > 0 ? "+" : "";
		let divClass = change > 0 ? "nu_positive_txt" : "nu_negative_txt";
		let buy = `${item.buy_price.toFixed(3)}<br>${intToString(item.buy_volume)}`;
		let sell = `${item.sell_price.toFixed(3)}<br>${intToString(item.sell_volume)}`;
		let row = `
		<tr id="${item.stockcode}" data-buy="${buy}" data-sell="${sell}">
			<td>
				<div style="outline-style:none;" tabindex="0">
					<div class="quotes-col-stock-code ${i}_0">
						<div class="quotes-col-stock-name nu_bold" title="${item.name}">${item.name}</div>
						<div title="${item.stockcode}">${item.stockcode}</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-last-vol ${i}_1">
						<div class="${divClass}">${item.last.toFixed(2)}<br>${intToString(item.volume)}</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-chng-pect ${i}_2">
						<div class="nu_positive_txt">
							<div class="${divClass}">${changeSign}${change.toFixed(3)}<br>${changeSign}${changePct.toFixed(1)}%</div>
						</div>
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-buy-vol ${i}_3">${buy}</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-sell-vol ${i}_4">${sell}</div>
				</div>
			</td>
			<td></td>
		</tr>
		`

		body.append($(row));
	};
}

$(".quotes-btn-submenu").click(function(){
	$(".quotes-btn-submenu.active").removeClass("active");
	if($(this).hasClass("active")) {
		$(this).removeClass("active");
	}else{
		$(this).addClass("active");
	}
	clearData();
	getData(true);
});

$('select[name="market"]').on('change', function (e) {
	clearData();
	getData(true);
});

setInterval(function() {
    getData(false);
}, 1 * 1000);

window.onload = function () {
	getData(true);
};

function intToString(num) {
	num = num.toString().replace(/[^0-9.]/g, '');
	if (num < 1000) {
		return num;
	}
	let si = [
	  {v: 1E3, s: "K"},
	  {v: 1E6, s: "M"},
	  {v: 1E9, s: "B"}
	  ];
	let index;
	for (index = si.length - 1; index > 0; index--) {
		if (num >= si[index].v) {
			break;
		}
	}
	return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}