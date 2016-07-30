/*
	new MySortTable({
		wrapDom : //表格添加到的DOM
		theadData : 表格头信息
		tbodyData : 表格body信息，是一个二维数组
	});

	//样式
.my-table {border-collapse:collapse;}
.my-table,th,td,tr {border:1px solid #222;}
.my-table thead{background: #dfdfdf}
.my-table th ,.my-table td{padding: 10px 20px;text-align: center;}

.t-icon{cursor: pointer;display: inline-block;width: 0;height: 0;border-right:5px solid transparent;border-left:5px solid transparent;  }
.t-icon-up{border-top: 8px solid #888;  margin: 0 1px 0 5px; }
.t-icon-down{border-bottom: 8px solid #888;}


*/


function MySortTable(opts){
	this.wrapDom = opts.wrapDom;
	this.theadData = opts.theadData;
	this.tbodyData = opts.tbodyData;

	this.init();
	this.bindDom();
}


//生成表格
MySortTable.prototype.init = function(){
	var theadData = this.theadData;
	var tbodyData = this.tbodyData;

	var tb = document.createElement('table');
	var thead = document.createElement('thead');
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	var trHTML = '';

	tb.class = tb.className = 'my-table';

	for (var i = 0; i < theadData.length; i++) {
		
		if (i > 0) {
			trHTML+= '<th>'+ theadData[i] +'<i class="t-icon t-icon-up" data-id="'+i+'"></i><i class="t-icon t-icon-down" data-id="'+i+'"></i></th>'
		}else{
			trHTML += '<th>'+ theadData[i] + '</th>';
		}
	}
	tr.innerHTML = trHTML;
	thead.appendChild(tr);
	tb.appendChild(thead);


	for (var i = 0; i < tbodyData.length; i++) {
		var tr = document.createElement('tr');
		trHTML = '';
		for (var j = 0; j < tbodyData[i].length; j++) {			
			trHTML += '<td>'+tbodyData[i][j]+'</td>';
		}
		tr.innerHTML = trHTML;
		tbody.appendChild(tr);
	}
	tb.appendChild(tbody);

	this.wrapDom.appendChild(tb);
	this.tbody = tbody;
}


//排序函数
MySortTable.prototype.sortData = function(id , d){

	var tbodyData = this.tbodyData;
	var newSortDate;		

	if (d === 'up') {
		newSortDate = tbodyData.sort(function(a,b){return b[id] - a[id]});

	}else{
		newSortDate = tbodyData.sort(function(a,b){return a[id] - b[id]});
	}

	this.renderTable( newSortDate );

}


//点击事件
MySortTable.prototype.bindDom = function(){

	var iconUpDom = document.getElementsByClassName('t-icon-up'),
	  iconDownDom = document.getElementsByClassName('t-icon-down');
	var self = this;

	for (var i = 0; i < iconUpDom.length; i++) {

		(function(){
			iconUpDom[i].onclick = function(e){
				var id = e.target.getAttribute('data-id');
				self.sortData(id , 'up' );
			}
			iconDownDom[i].onclick = function(e){
				var id = e.target.getAttribute('data-id');
				self.sortData(id , 'down');
			}
		})(i);
		
	}
}



//重新排序
MySortTable.prototype.renderTable = function(data){
	var tbodyData = data;
	var tbody = this.tbody;
	tbody.innerHTML = '';

	for (var i = 0; i < tbodyData.length; i++) {
		var tr = document.createElement('tr');
		trHTML = '';
		for (var j = 0; j < tbodyData[i].length; j++) {			
			trHTML += '<td>'+tbodyData[i][j]+'</td>';
		}
		tr.innerHTML = trHTML;
		tbody.appendChild(tr);
	}

}


