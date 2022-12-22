// declaring global variables
let resourceUrl = "http://194.233.80.156:9091/Dummy/quotes?";
let marketIds = "023";
let listBody = $("#list-top-volume");

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
	listBody.html("");
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
    } );
}

function updateTable(data) {
	let existing = $('body').find('#list-top-volume').children();
	let rows = "";

	for (let i = 0; i < data.length; i++) {
		item = data[i];
		let change = item.last - item.previous;
		let changePct = change/item.previous*100;
		let changeSign = change > 0 ? "+" : "";
		let divClass = change > 0 ? "nu_positive_txt" : "nu_negative_txt";

		let vol = `${item.last.toFixed(2)}<br>${intToString(item.volume)}`;
		let changeText = `${changeSign}${change.toFixed(3)}<br>${changeSign}${changePct.toFixed(1)}%`;
		let buy = `${item.buy_price.toFixed(3)}<br>${intToString(item.buy_volume)}`;
		let sell = `${item.sell_price.toFixed(3)}<br>${intToString(item.sell_volume)}`;

		let updatedStock = "";
		let updatedVol = "";
		let updatedChange = "";
		let updatedBuy = "";
		let updatedSell = "";

		if(existing[i].id != item.stockcode){
			updatedStock = "yellow";
		}

		if( $(`.${i}_1`).html().trim() != vol){
			updatedVol = "yellow";
		}

		if( $(`.${i}_2`).html().trim() != changeText){
			updatedChange = "yellow";
		}

		if( $(`.${i}_3`).html().trim() != buy){
			updatedBuy = "yellow";
		}

		if( $(`.${i}_4`).html().trim() != sell){
			updatedSell = "yellow";
		}

		let row = `
		<tr id="${item.stockcode}">
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
					<div class="quotes-col-last-vol ${i}_1 ${divClass} ${updatedVol}">
						${vol}
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-chng-pect ${i}_2 ${divClass} ${updatedChange}">
						${changeText}
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-buy-vol ${i}_3 ${updatedBuy}">
						${buy}
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-sell-vol ${i}_4 ${updatedSell}">
						${sell}
					</div>
				</div>
			</td>
			<td></td>
		</tr>
		`;
		
		rows += row;
	};
	clearData();
	listBody.append($(rows));
}

function populateTable(data) {
	for (let i = 0; i < data.length; i++) {
		let item = data[i];
		let change = item.last - item.previous;
		let changePct = change/item.previous*100;
		let changeSign = change > 0 ? "+" : "";
		let divClass = change > 0 ? "nu_positive_txt" : "nu_negative_txt";
		let row = `
		<tr id="${item.stockcode}">
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
					<div class="quotes-col-last-vol ${i}_1 ${divClass}">
						${item.last.toFixed(2)}<br>${intToString(item.volume)}
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-chng-pect ${i}_2 ${divClass}">
						${changeSign}${change.toFixed(3)}<br>${changeSign}${changePct.toFixed(1)}%
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-buy-vol ${i}_3">
						${item.buy_price.toFixed(3)}<br>${intToString(item.buy_volume)}
					</div>
				</div>
			</td>
			<td>
				<div style="outline-style:none;">
					<div class="quotes-col-sell-vol ${i}_4">
						${item.sell_price.toFixed(3)}<br>${intToString(item.sell_volume)}
					</div>
				</div>
			</td>
			<td></td>
		</tr>
		`;

		listBody.append($(row));
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
}, 5 * 1000);

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

$('input[type="checkbox"][name="darkmode"]').change(function() {
	if(this.checked) {
		$('body').addClass('dark-mode');
	}else{
		$('body').removeClass('dark-mode');
	}
});