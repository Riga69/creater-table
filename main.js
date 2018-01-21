// 'use strict';

var cols,rows,isDraggedBetweenCells=!1,isMouseDown=!1,mouseDownCell,selectedRowspan,selectedColspan;

function isInt(a){
	return/^\d+$/.test(a)
};

Array.indexOf||(Array.prototype.indexOf = function(a){
	for(var e=0;e<this.length;e++)if(this[e]==a)
		return e;
	return-1
});

function RemoveSelection(){
	window.getSelection?window.getSelection().removeAllRanges():document.selection.createRange&&(document.selection.createRange(),document.selection.empty()
)}

function getCellRows(a){
	return getCellValue(a,"r")
}

function getCellOffset(a){
	return getCellValue(a,"o")
}

function getCellCols(a){
	return getCellValue(a,"c")
}

function getCellValue(a,e){
	var b=$(a).attr("class"),b=b.split(" ");
	allClassesLength=b.length;
	for(var c=0;c<allClassesLength;c++){
		b[c].charAt(0)===e?b[c]=parseInt(b[c].substr(1,b[c].length-1),10):(b.splice(c,1),allClassesLength--,c--);
	}
	return b;
}

function reindexTable(){
	for(var a=[],e=[],b=0;b<cols + 1;b++) {
		a[b]="c"+b;
	}
	for(b=0;b<rows;b++) {
		e[b]=a.slice();
	}
	for(var a=$("tbody tr"),c,g,f,i,b=0;b<rows;b++) {
		c=a.eq(b).children();
		// console.log('a', a[b]);
		g=c.size();
		for(var j=0,colOffset=0;j<g;j++) {
			var cell = c.eq(j);
			console.log('c', cell);
			if (cell.prop('tagName') !== 'TD') continue;
			cell.removeClass();

			f=parseInt(cell.attr("colspan"),10);
			i=parseInt(c.eq(j).attr("rowspan"),10);

			void 0==c.eq(j).attr("colspan")&&(f=1);
			void 0==c.eq(j).attr("rowspan")&&(i=1);

			for(var h=0;h<i;h++) {
				for (var o = 0; o < f; o++) {
					for (var k = 0; "" === e[b + h][o + colOffset + k];) k++;
					c.eq(j).addClass(e[b + h][o + colOffset + k + 1] + " r" + (b + h + 1));
					e[b + h].splice(o + k + colOffset, 1, "")
				}
			}
			colOffset+=f
		}
	}
}

$(function(){
	$("#generate").on("click",function(){
		cols=parseInt($("#cols").val(),10);
		rows=parseInt($("#rows").val(),10);
		if(isInt(cols))if(isInt(rows)){
			$("#tableWrap").empty().append("<table><thead></thead><tbody></tbody>");
			for(var a=1;a<=rows;a++){
				$("tbody").append("<tr><th class='cells-count' id='y"+ a +"'>" + a + "</th></tr>");
				$generatedRow=$("tr").eq(a-1);
				for(var e=1;e<=cols;e++) {
					//console.log('e', cols);
					$generatedRow.append("<td class='c" + (e) + " r" + (a) + "' style='text-align: left; background-color: white; color: black;' colspan='1' rowspan='1'><div contenteditable='true'>&nbsp;</div>")
				}
			}
			addTheadInTable();
		}
		else
			alert("Invalid row input");
		else alert("Invalid column input")
	});
	$("#generate").trigger("click")
});

function addTheadInTable() {
	$('thead').append('<tr id="rowsCount"><th id="control"><input id="checkAllTable" onchange="checkAllTable(this);" type="checkbox"></th></tr>');
	var tr = $('tr')[1];
	var tds = $(tr).find('td');
	//console.log('tds', tds);
	for(var i=0; i<tds.length; i++){
		$('#rowsCount').append('<th class="rows-count"  id="x'+ (i+1) + '" >' + (i+1) +'</th>');
	}
}

function selectCells(a,e){
	for(var b=getCellCols(a),c=getCellRows(a),g=getCellCols(e),f=getCellRows(e),i=b.length,j=c.length,h=g.length,o=f.length,k=100,l=0,m=100,n=0,d=0;d<i;d++)b[d]<k&&(k=b[d]),b[d]>l&&(l=b[d]);
	for(d=0;d<h;d++)g[d]<k&&(k=g[d]),g[d]>l&&(l=g[d]);for(d=0;d<j;d++)c[d]<m&&(m=c[d]),c[d]>n&&(n=c[d]);
	for(d=0;d<o;d++)f[d]<m&&(m=f[d]),f[d]>n&&(n=f[d]);for(d=m;d<=n;d++)for(c=k;c<=l;c++)$(".c"+c)
		.filter(".r"+d).addClass("s");do{b=!1;f=$(".s");
		i=f.size();g=[];c=[];for(d=0;d<i;d++)g=g.concat(getCellCols(f.eq(d))),
	c=c.concat(getCellRows(f.eq(d)));
		d=Math.max.apply(Math,g);
		g=Math.min.apply(Math,g);
		f=Math.max.apply(Math,c);
		c=Math.min.apply(Math,c);
		d>l&&(l=d,b=!0);
		g<k&&(k=g,b=!0);
		f>n&&(n=f,b=!0);
		c<m&&(m=c,b=!0);
		if(b)for(d=m;d<=n;d++)for(c=k;c<=l;c++)$(".c"+c).filter(".r"+d).addClass("s");
		else selectedColspan=l-k+1,selectedRowspan=n-m+1}while(b)
}

$(function(){
	$("td").live("mousedown",function(a){
		1===a.which&&(RemoveSelection(),isMouseDown=!0,mouseDownCell=this)
		$('.type-td').css({'display': 'block', 'transition-duration':'1s'});

	});

	$("td").live("mousemove",function(){
		isMouseDown&&mouseDownCell!=this&&(isDraggedBetweenCells=!0,RemoveSelection(),$(".s").removeClass("s"),selectCells(mouseDownCell,this));
	});

	$("#tableWrap table").on("mouseup",function(){
		//console.log('click table');
		isMouseDown&&(isMouseDown=!1,mouseDownCell=void 0,isDraggedBetweenCells=!1)
		checkDisable();
	});
	$("td").live('click', function () {
		//console.log('click on td');
		$(this).addClass('s');
		$('#checkAllTable').prop('checked', false);
		checkDisable();
	});

	$('tr .cells-count').live('click', function () {
		var tr = $(this).parent();
		for(var i=0; i<tr.length; i++){
			$(tr[i].cells).addClass('s');
			if($('th').hasClass('s')){
				$(this).removeClass('s');
			}
		}
		checkOut();
	});

	$('.rows-count').live('click', function () {
		var th = $(this), x;
		for (var k = 0; k<th.length; k++){
			x = th[k].cellIndex;
		}
		//console.log('num_rows', x);
		var td = $('td');
		 $('.c' + x).addClass('s');
		checkOut();
	});

	$("#tableWrap").on("mousedown",function(a){
		//console.log('click on table')
		1===a.which&&$(".s").removeClass("s");
		$('.left-fixed-panel').css('display', 'none');
		$('.type-td').css('display', 'none');
		$('button').prop('disabled', true);
		checkedNull();
	});

});

function checkAllTable(elem) {
	var checkboxes = document.getElementsByTagName('input');
	if (elem.checked){
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].type == 'checkbox') {
				checkboxes[i].checked = true;
				$('td').addClass('s');
				$('.type-td').css('display', 'block');
			}
		}
	}
	else{
		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].type == 'checkbox') {
				checkboxes[i].checked = false;
				$('td').removeClass('s');
				$('.type-td').css('display', 'none');
				$('button').prop('disabled', true);
			}
		}
	}
}

function checkOut() {
	$('.type-td').css('display', 'block');
	$('#checkAllTable').prop('checked', false);
}

function checkedNull() {
	if($('.type-td').css('display','none')){
		$('input[type="radio"]').prop('checked', false);
	}
};

function checkDisable(){
	$('button').prop('disabled', false);
}

function getLowestCol(a){
	a=getCellCols(a);
	return Math.min.apply(Math,a)
}

function optimiseColspan(){
	var a,e,b=$("tr"),c=b.size(),g,f,i,j,h=[];
	for(a=0;a<cols;a++)h[a]=a+1;
	for(e=0;e<c;e++){g=b.eq(e).children();
		f=g.size();for(a=0;a<f;a++)i=getLowestCol(g.eq(a)),j=void 0==g.eq(a).attr("colspan")?1:parseInt(g.eq(a).attr("colspan"),10)
			,-1!==h.indexOf(i+j)&&h.splice(h.indexOf(i+j),1);
		if(1>h.length)
			break
	}
	cols-=h.length;for(a=0;a<h.length;a++){b=".c"+(h[a]-1);
	$classArray=$(b);$classArrayL=$classArray.size();
	for(c=0;c<$classArrayL;c++)b=parseInt($classArray.eq(c).attr("colspan"),10),$classArray.eq(c).attr("colspan",b-1)
	}
}

function optimiseRowspan(){
	for(var a=$("tr:empty"),e=a.length,b,c,g,f,i=0;i<e;i++){
		b=$("tr").index(a.eq(i));b=$(".r"+b);c=b.length;
		for(f=0;f<c;f++)g=b.eq(f).attr("rowspan")-1,b.eq(f).attr("rowspan",g)}rows-=$("tr:empty").size();
	$("tr:empty").remove()
}

function mergeCells(){
	for(var a=$(".s"),e=a.length,b="",c=0;c<e;c++)b+=" "+a.eq(c).attr("class");
	//console.log(c)
	b=b.replace(/s/gi,"");
	selectedColspan===cols&&(rows=rows-selectedRowspan+1,selectedRowspan=1);
	//console.log(selectedColspan)
	a.eq(0).before("<td class='"+b+"' style='text-align: left; background-color: white; color: black;' colspan='"+selectedColspan+"' rowspan='"+selectedRowspan+"'><div contenteditable='true'>&nbsp;</div>");
	a.remove();
	selectedColspan===cols&&$("tr:empty").remove();
	//console.log(selectedColspan)
	reindexTable();
	optimiseRowspan();
	optimiseColspan();
	reindexTable();
}

// function splitCells() {
// 	for(var a=$(".s"),e=a.length,b="",c=0;c<e;c++)b+=" "+a.eq(c).attr("class");
// 	// b=b.replace(/s/gi,"");
// 	// console.log('what b', b);
// 	selectedColspan===cols&&(rows=rows-selectedRowspan+1,selectedRowspan=1);
// 	console.log('Выделено colspane:', selectedColspan);
// 	a.eq(0).before("<td class='"+b+"' colspan='"+selectedColspan+"' rowspan='"+selectedRowspan+"'><div contenteditable='true'>&nbsp;</div>");
// 	a.append();
// 	//selectedColspan===cols&&$("tr:empty").append();
// 	reindexTable();
// 	// optimiseRowspan();
// 	// optimiseColspan();
// 	reindexTable();
// }

$(function(){
	$("#merge").on("click",function(){
	mergeCells()
	})
});

// $(function(){
// 	$("#split").on("click",function(){
// 		splitCells()
// 	})
// });

$(function(){
	$("td").live("click",function(){
		$(this).children("div").focus()
	})
});

$(function() {
	$('#deleteGenerate').on('click', function () {
		$('#tableWrap table').remove()
	});
});

function deleteStringTable(str) {
	var string; for(var i=0; i<$('#tableWrap table tbody tr').length; i++) string = $('#tableWrap table tbody tr')[i];
	if(string){
		if($('#tableWrap table tbody tr')[0] === string){
			var question = confirm('Вы действительно хотите удалить всю таблицу?');
			if(question == true){
				$('#tableWrap table').remove();
			}
		}
		else{
			if(str == '0'){
				$('#tableWrap table tbody tr')[0].remove();
			}
			else{
				string.remove();
			}
		}
	}
	else{
		alert('Вся таблица была ранее удалена');
	}
	updateClass();
};

function deleteColumnTable(col){
	var allStr = $('#tableWrap table tr'), f ,l;
	for(var i=0; i<allStr.length; i++){
		f = allStr[1].cells[1];
		l = allStr[1].lastChild;
	}
	//console.log(f, l);
	if(!allStr[0]){
		alert('Вся таблица была ранее удалена');
	}
	else{
		if(f === l){
			var question = confirm('Вы действительно хотите удалить всю таблицу?');
			if (question == true) {
				$('#tableWrap table').remove();
			}
		}
		else{
			for(var i=0; i<allStr.length; i++) {
				var firstCol = allStr[i].cells[1], lastCol = allStr[i].lastChild;
				//console.log('fe', $(allStr[i]).find('td'));
				if (col == '0') {
					$(firstCol).remove();
				}
				else {
					lastCol.remove();
				}
			}
		}
	}
	updateClass();
};

function checkAndAddStringTable(str) {
	var table = $('#tableWrap table tbody tr')[0];
	var count_cells = 0, count;
	$(table).each(function () {
		count = $(this).find('td');
		for(var q=0; q<count.length; q++){
			count_cells += parseInt(count[q].attributes.colspan.value);
		}
	});
	if(table){
		$generatedRow = $("<tr><th class='cells-count'></th></tr>");
		for (var e = 1; e <= count_cells; e++) {
			$generatedRow.append("<td class='' colspan='1' rowspan='1'><div contenteditable='true'>&nbsp;</div></td>")
		}
			if(str == '0') {
				$("#tableWrap table tbody").append($generatedRow);
			}
			else{
				$("#tableWrap table tbody").prepend($generatedRow);
			}
		updateClass();
	}
	else{
		alert('Сначала создайте таблицу');
	}
};

function checkAndAddColumnTable(col) {
	var column = $('#tableWrap table tbody tr').length;
	if(column){
		if(col=='0'){
			$('thead #control').after('<th class="rows-count">');
			$('tbody tr').find('th').after("<td class='' style='text-align: left; background-color: white; color: black;' colspan='1' rowspan='1'><div contenteditable='true'>&nbsp;</div>");
		}
		else
		{
			$('thead tr').append('<th class="rows-count">');
			for(var a=0;a<=column;a++){
				$generatedRow=$("tbody tr").eq(a);
				$generatedRow.append("<td class='' style='text-align: left; background-color: white; color: black;' colspan='1' rowspan='1'><div contenteditable='true'>&nbsp;</div>");
			}
		}
		updateClass();
	}
	else{
		alert('Сначала создайте таблицу');
	}
}

function updateClass() {
	var string = $('#tableWrap tbody tr');
	var rowsCount = $('#rowsCount').find('.rows-count');
	for(var z=0; z <rowsCount.length; z++){
		$(rowsCount[z]).empty();
		$(rowsCount[z]).removeAttr('id');
		$(rowsCount[z]).attr('id', 'x' + (z+1));
		$(rowsCount[z]).text(z+1);
	}
	var tr = $('tr')[1];
	var tds = $(tr).find('td');
	for(var i=0; i<string.length; i++){
		var cells = $(string[i]).find('td');
		var th = $(string[i]).find('th');
		//console.log('rc', rowsCount);
		for(var k=0; k<th.length; k++){
			$(th[k]).empty();
			$(th[k]).removeAttr('id');
			$(th[k]).attr('id', 'y' + (i+1));
			$(th[k]).text(i+1);
		}
		for(var j=0; j<cells.length; j++){
			$(cells[j]).removeClass();
			$(cells[j]).addClass('c'+ (j+1) + ' r' + (i+1));
		}
	}
}

$(function(){
	$('.btn-align').on('click', function () {
		if($('td').hasClass('s')) {
			var id = $(this).attr('id');
			console.log('elems', id);
			switch (id) {
				case 'text-align-left':
					$('td.s').css('text-align', 'left');
					break;
				case  'text-align-center':
					$('td.s').css('text-align', 'center');
					break;
				case 'text-align-right':
					$('td.s').css('text-align', 'right');
					break;
			}
		}
		else{
			alert('Выделите необходимые ячейки для смены цвета текста');
		}
	})
});

$(function(){
	$('.color-text').on('click', function () {
		if($('td').hasClass('s')) {
			var className = $(this).attr('class');
			console.log('ss', className);
			switch (className) {
				case 'color-text black':
					$('td.s').css('color', 'black');
					break;
				case  'color-text brown':
					$('td.s').css('color', 'brown');
					break;
				case 'color-text grey':
					$('td.s').css('color', 'grey');
					break;
				case  'color-text purple':
					$('td.s').css('color', 'purple');
					break;
				case 'color-text blue':
					$('td.s').css('color', 'blue');
					break;
				case  'color-text lightblue':
					$('td.s').css('color', 'lightblue');
					break;
				case 'color-text green':
					$('td.s').css('color', 'green');
					break;
				case  'color-text lime':
					$('td.s').css('color', 'lime');
					break;
				case 'color-text red':
					$('td.s').css('color', 'red');
					break;
				case  'color-text pink':
					$('td.s').css('color', 'pink');
					break;
				case  'color-text orange':
					$('td.s').css('color', 'orange');
					break;
				case 'color-text yellow':
					$('td.s').css('color', 'yellow');
					break;
				case  'color-text white':
					$('td.s').css('color', 'white');
					break;
			}
		}
		else{
			alert('Выделите необходимые ячейки для смены цвета текста');
		}
	})
});

$(function(){
	$('.color-bg').on('click', function () {
		if($('td').hasClass('s')) {
			var className = $(this).attr('class');
			console.log('xx', className);
			switch (className) {
				case 'color-bg black':
					$('td.s').css('background-color', 'black');
					break;
				case  'color-bg brown':
					$('td.s').css('background-color', 'brown');
					break;
				case 'color-bg grey':
					$('td.s').css('background-color', 'grey');
					break;
				case  'color-bg purple':
					$('td.s').css('background-color', 'purple');
					break;
				case 'color-bg blue':
					$('td.s').css('background-color', 'blue');
					break;
				case  'color-bg lightblue':
					$('td.s').css('background-color', 'lightblue');
					break;
				case 'color-bg green':
					$('td.s').css('background-color', 'green');
					break;
				case  'color-bg lime':
					$('td.s').css('background-color', 'lime');
					break;
				case 'color-bg red':
					$('td.s').css('background-color', 'red');
					break;
				case  'color-bg pink':
					$('td.s').css('background-color', 'pink');
					break;
				case  'color-bg orange':
					$('td.s').css('background-color', 'orange');
					break;
				case 'color-bg yellow':
					$('td.s').css('background-color', 'yellow');
					break;
				case  'color-bg white':
					$('td.s').css('background-color', 'white');
					break;
			}
		}
		else{
			alert('Выделите необходимые ячейки для смены цвета поля ячейки');
		}
	})
});

$(function () {
	$('#text-decor').toggle(function () {
		$("td.s").css('text-decoration', 'underline')
	}, function () {
		$("td.s").css('text-decoration', 'none');
	});
});

$(function () {
	$('#bolder').toggle(function () {
		$("td.s").css('font-weight', 'bold')
	}, function () {
		$("td.s").css('font-weight', 'normal');
	});
});

$(function () {
	$('#italic').toggle(function () {
		$("td.s").css('font-style', 'italic')
	}, function () {
		$("td.s").css('font-style', 'normal');
	});
});

$(function () {
	$('input[name="type-td"]').on('change', function () {
		if($('td').hasClass('s')) {
			var id = $(this).attr('id');
			var td = $('td.s');
			switch (id){
				case 'text-field':
					for(var i=0; i<td.length; i++){
						var str = td[i].firstChild;
						str.remove();
					}
					td.append("<div contenteditable='true'>&nbsp;</div>");
					break;
				case 'number-field':
					for(var i=0; i<td.length; i++){
						var str = td[i].firstChild;
						str.remove();
					}
					td.append("<input type='number' class='inp-num' value=''>");
					break;
				case 'fractional-field':
					for(var i=0; i<td.length; i++){
						var str = td[i].firstChild;
						str.remove();
					}
					td.append("<input type='text' class='inp-num' value=''>");
					break;
				case 'date-field':
					for(var i=0; i<td.length; i++){
						var str = td[i].firstChild;
						str.remove();
					}
					td.append("<input type='date' class='inp-date' value=''>");
					break;
				case 'select-field':
					var obj = {arr:[]};
					for(var i=0; i<td.length; i++){
						var str = td[i].firstChild;
						str.remove();
					}
					// if(selItems.length == 0){
					// 	obj.id = 0;
					// }else{
					// 	obj.id = selItems[selItems.length-1].id+1;
					// }
					// console.log('o', obj);
					// selItems.push(obj);
					//td.append("<select data-sel-id=" +obj.id+ " class='select-data-control'><option>Не выбрано</option></select> <a class='fa fa-plus add-options' aria-hidden='true'></a>");
					td.append("<select class='select-data-control'><option value='0'>Не выбрано</option></select>");
					break;

			}
		}
		else{
			alert('Выделите необходимые ячейки для смены типа ячейки');
		}
	})
});

function loadDataSelect() {
	if ($('td.s select').hasClass('select-data-control')) {
		$('#fieldlistItems').html('');
		var sel = $('td.s select.select-data-control');
		//console.log('select', sel);
		var listItem = [];
		if (sel.length >= 2) {
			var selNull = sel[0], val, txt;
			for (var i = 0; i < selNull.childNodes.length; i++) {
				var optionNull = selNull.childNodes[i];
				for (var a = 1; a < sel.length; a++) {
					var flag = false;

					for (var k = 0; k < sel[a].childNodes.length; k++) {
						var optionOther = sel[a].childNodes[k];
						if ((optionNull.value == optionOther.value) && (optionNull.text == optionOther.text)) {
							//	console.log('полностью совпадает', optionNull);
							flag = true;
							break;
						}
					}
					if ((flag == true) && ((a + 1) == sel.length)) {
						listItem.push({id: optionOther.value, name: optionOther.text});
						//console.log('Элемент добавлен', listItem, optionNull);
					}
				}
			}
			for (var p = 0; p < listItem.length; p++) {
				$('#fieldlistItems').append(
					'<div data-sel-text-id="' + listItem[p].id + '"><span>' + '<b>' + "Ключ: " + '</b>' + listItem[p].id + '<b>' + " Название: " + '</b>' + listItem[p].name + '</span> <button data-minus-id="' + listItem[p].id + '" class="fa fa-minus minus-options" aria-hidden="true"></button></div>'
				);
			}
		}
		else {
			for (var i = 0; i < sel.length; i++) {
				for (var j = 0; j < sel[i].childNodes.length; j++) {
					var option = sel[0].childNodes[j];
					var c = $('#fieldlistItems').append(
						'<div data-sel-text-id="' + option.value + '"><span>' + '<b>' + "Ключ: " + '</b>' + option.value + '<b>' + " Название: " + '</b>' + option.text + '</span> <button data-minus-id="' + option.value + '" class="fa fa-minus minus-options" aria-hidden="true"></button></div>'
					);
				}
			}
		}

		$('.left-fixed-panel').css('display', 'block');
	}
	else {
		alert('Выбирите ячейку с select');
	}
}

$(function () {
	$('#addTextSelect').on('click', function () {
		var keyObj = $('#insertKeySelect').val();
		var item = $('#insertTextSelect').val();
		if (keyObj && item != '') {
			$('#fieldlistItems').html('');
			const listItem = [];
			listItem.push({id: keyObj, name: item});
			$('td.s .select-data-control').append('<option value="' + keyObj + '">' + item + '</option>');
			loadDataSelect();
			$('#insertKeySelect').val('') && $('#insertTextSelect').val('');
		}
	})
});

$(function () {
	$('.close').on('click', function () {
		$('.left-fixed-panel').css('display', 'none');
	});
});

$(function () {
	$('.minus-options').live('click', function () {
		var btn = $(this).attr('data-minus-id');
		var span = $('#fieldlistItems').children('[data-sel-text-id = "'+btn+'"]');
		$(span).remove();
		$("td.s .select-data-control option[value='"+btn+"']").remove();
	})
});

$(function () {
	$('#insertNameTable').keyup(function () {
		$('h2.table-name').text($('#insertNameTable').val());
	})
});

$(function () {
	$('#rows').keypress(function(e) {
		if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});
	$('#cols').keypress(function(e) {
		if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});
});



//re = new RegExp(/\d+/);
//console.log(re1.test($("#6456").val()));

