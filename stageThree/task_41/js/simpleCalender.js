function SimpleCalender(opts){
	//构造函数需要的参数
	this.wrapDom = opts.wrapDom;
	this.clickCallBack = opts.clickCallBack;

	this.init();

	
}
var $Id = function(id){
	return document.getElementById(id);
}
var $Class = function(dom,cls){
	return dom.getElementsByClassName(cls);
}
var $TagName = function(dom,tag){
	return dom.getElementsByTagName(tag);
}

SimpleCalender.prototype.init = function(){
	this.renderDom();
}



//初始化时间
SimpleCalender.prototype.renderDom = function(){

	var table = document.createElement('table');
	var caption = document.createElement('caption');
	var thead = document.createElement('thead');
	var tbody = document.createElement('tbody');
	table.class = table.className = 'c-mytable';

	table.appendChild(caption);
	table.appendChild(thead);
	table.appendChild(tbody);		

	//将节点暴露给SimpleCalender
	this.table = table;
	this.caption = caption;
	this.thead = thead;
	this.tbody = tbody;

	this.wrapDom.appendChild(table);

	var today = new Date();
	var tYear = today.getFullYear();
	var tMonth = today.getMonth();

	this.renderDayDom(tYear,tMonth);

}


SimpleCalender.prototype.renderDayDom = function(tYear,tMonth){
	var caption = this.caption;
	var thead = this.thead;	
	var tbody = this.tbody;
	thead.innerHTML = '';
	tbody.innerHTML = '';
	var frag = document.createDocumentFragment();

	/*--------------绘制caption---------------*/
	caption.innerHTML = '<div class="c-caption"><p><span id="c_show_year">'+tYear+'</span>年<span id="c_show_month">'+(tMonth+1)+'</span>月</p><i class="c-ctrol c-left-ctrol"></i><i class="c-ctrol c-right-ctrol"></i><div>';

	/*----------------绘制thead---------------*/
	var tr = document.createElement('tr');
	var trHTML = '';
	var weekData = ['日','一','二','三','四','五','六'];
	for (var i = 0; i < 7; i++) {
		trHTML += '<th>'+weekData[i]+'</th>';
	}
	tr.innerHTML = trHTML;
	thead.appendChild(tr);

	/*----------------绘制tbody-------------*/
	var tFirstDay = new Date(tYear,tMonth,1).getDay();//此月第一天为星期几
	var tManyDate = new Date(tYear,tMonth+1,0).getDate();//此月有多少天
	var fManyDate = new Date(tYear,tMonth,0).getDate();//前一个月有多少天

	//计算tbody一共有几行
	var rowMix = Math.floor((tFirstDay+tManyDate)/7);
	var rowMax = Math.ceil((tFirstDay+tManyDate)/7);
	if (rowMax>rowMix) {rowMix = rowMax}

	//生成日期
	var lAddDate = fManyDate - tFirstDay + 1;
	var tAddDate = 1;
	var nAddDate = 1;
	for (var i = 0; i < rowMix; i++) {
		var tr = document.createElement('tr');
		var trHTML = '';
		for (var j = 0; j < 7; j++) {
			if (i==0&&tFirstDay!=0&&j<tFirstDay) {
				trHTML += '<td class="c-last-month">'+lAddDate+'</td>';
				lAddDate++;
			}else if (i==(rowMix-1)&&tAddDate>tManyDate) {
				trHTML += '<td class="c-next-month">'+nAddDate+'</td>';
				nAddDate++;
			}else{
				trHTML += '<td class="c-this-month">'+tAddDate+'</td>';
				tAddDate++;
			}
		}
		tr.innerHTML = trHTML;
		frag.appendChild(tr);
	}
	tbody.appendChild(frag);

	//将今天的日期特殊显示
	var today = new Date();
	var thisYear = today.getFullYear();
	var thisMonth = today.getMonth();
	var thisDate = today.getDate();
	if (thisYear==tYear&&thisMonth==tMonth) {
		var tds = tbody.getElementsByTagName('td');
		for (var i = 0; i < tds.length; i++) {
			if (tds[i].className == 'c-this-month'&&tds[i].innerHTML == thisDate) {
				tds[i].className += ' c-show-day-bgc';
				break;
			}			
		}
	}

	this.bindDayDom();

}

//对日历的选择日绑定事件
SimpleCalender.prototype.bindDayDom = function(){
	var caption = this.caption;
	var thead = this.thead;
	var tbody = this.tbody;
	var self = this;

	var lastMonthDay = tbody.getElementsByClassName('c-last-month');
	var thisMonthDay = tbody.getElementsByClassName('c-this-month');
	var nextMonthDay = tbody.getElementsByClassName('c-next-month');

	//判断条件重新绘制日历
	var changeMonth = function (val){
		var year = parseInt($Id('c_show_year').innerHTML);
		var month = parseInt($Id('c_show_month').innerHTML)+parseInt(val);
		if (val == '-2') {
			if (month < 0) {year--;month=11}
		}else if(val == '0'){
			if (month >= 12) {year++;month=0}
		}
		
		self.renderDayDom(year,month);
	}


	$Class(caption,'c-left-ctrol')[0].addEventListener('click',function(){
		changeMonth('-2');
	});
	$Class(caption,'c-right-ctrol')[0].addEventListener('click',function(){
		changeMonth('0');
	});

	for (var i = 0; i < lastMonthDay.length; i++) {
		(function(){
			lastMonthDay[i].addEventListener('click',function(){
				changeMonth('-2');
			});
		})(i);		
	}

	for (var i = 0; i < nextMonthDay.length; i++) {
		(function(){
			nextMonthDay[i].addEventListener('click',function(){
				changeMonth('0');
			});
		})(i);		
	}

	$TagName(caption,'p')[0].addEventListener('click',function(){
		var year = parseInt($Id('c_show_year').innerHTML);
		self.renderMonth(year);
	},true);


	//如果传入的有点击的回调函数
	var cbyear = $Id('c_show_year').innerHTML;
	var cbmonth = $Id('c_show_month').innerHTML;
	if(this.clickCallBack){
		for (var i = 0; i < thisMonthDay.length; i++) {
			(function(){
				thisMonthDay[i].addEventListener('click',function(e){
					var cbdate = e.target.innerHTML;
					self.clickCallBack(cbyear,cbmonth,cbdate);
				});
			})(i);		
		}
	};


}

//对日历的选择月份绑定事件
SimpleCalender.prototype.bindMonthDom = function(){
	var caption = this.caption;
	var thead = this.thead;
	var tbody = this.tbody;
	var self = this;

	//判断条件重新绘制日历
	var changeYear = function (val){
		var tYear = parseInt($Id('c_show_year').innerHTML)+parseInt(val);
		$Id('c_show_year').innerHTML = tYear;		
	}


	$Class(caption,'c-left-ctrol')[0].addEventListener('click',function(){
		changeYear('-1');
	});
	$Class(caption,'c-right-ctrol')[0].addEventListener('click',function(){
		changeYear('1');
	});


	var tds = tbody.getElementsByTagName('td');
	for (var i = 0; i < tds.length; i++) {
		(function(){
			var j = i;
			tds[i].addEventListener('click',function(){
				var year = parseInt($Id('c_show_year').innerHTML);
				self.renderDayDom(year,j);
			});
		})(i);		
	}

//绑定caption
	$TagName(caption,'p')[0].addEventListener('click',function(){
		var year = parseInt($Id('c_show_year').innerHTML);
		self.renderYear(year);
	});


}

//对日历的选择年绑定事件
SimpleCalender.prototype.bindYearDom = function(){
	var caption = this.caption;
	var thead = this.thead;
	var tbody = this.tbody;
	var self = this;

	//判断条件重新绘制日历
	var changeYear = function (val){
		var tYear = parseInt($Id('c_show_ten_year').innerHTML.slice(0,4))+parseInt(val);
		self.renderYear(tYear);	

	}


	$Class(caption,'c-left-ctrol')[0].addEventListener('click',function(){
		changeYear('-1');
	});
	$Class(caption,'c-right-ctrol')[0].addEventListener('click',function(){
		changeYear('11');
	});


	var tds = tbody.getElementsByTagName('td');
	for (var i = 0; i < tds.length; i++) {
		(function(){
			tds[i].addEventListener('click',function(e){
				var year = e.target.innerHTML;
				self.renderMonth(year);
			});
		})(i);		
	}


}


//缩放到月份日历
SimpleCalender.prototype.renderMonth = function(tYear){
	var caption = this.caption;
	var thead = this.thead;	
	var tbody = this.tbody;
	thead.innerHTML = '';
	tbody.innerHTML = '';

	caption.innerHTML = '<div class="c-caption"><p><span id="c_show_year">'+tYear+'</span>年</p><i class="c-ctrol c-left-ctrol"></i><i class="c-ctrol c-right-ctrol"></i><div>';


	var monthData = [
						['一月','二月','三月','四月'],
						['五月','六月','七月','八月'],
						['九月','十月','十一月','十二月']
					];
	//生成tbody
	var frag =document.createDocumentFragment();
	for (var i = 0; i < 3; i++) {
		var tr = document.createElement('tr');
		var trHTML = '';
		for (var j = 0; j < 4; j++) {
			trHTML += '<td class="c-chose-month">'+monthData[i][j]+'</td>';
			
		}
		tr.innerHTML = trHTML;
		frag.appendChild(tr);
	}
	tbody.appendChild(frag);


	//将当月特殊显示
	var today = new Date();
	var thisYear = today.getFullYear();
	var thisMonth = today.getMonth();
	if (thisYear==tYear) {
		var tds = tbody.getElementsByTagName('td');

		tds[thisMonth].className += ' c-show-month-bgc';

	}

	this.bindMonthDom();
}

//缩放到年日历
SimpleCalender.prototype.renderYear = function(tYear){
	var caption = this.caption;
	var tbody = this.tbody;

	var startYear = Math.floor(tYear/10)*10;
	var toYear = startYear-1;

	tbody.innerHTML = '';
	caption.innerHTML = '<div class="c-caption"><p><span id="c_show_ten_year">'+startYear+'-'+(startYear+9)+'</span></p><i class="c-ctrol c-left-ctrol"></i><i class="c-ctrol c-right-ctrol"></i><div>';



	var frag = document.createDocumentFragment();
	for (var i = 0; i < 3; i++) {
		var tr = document.createElement('tr');
		var trHTML = '';
		for (var j = 0; j < 4; j++) {
			if (i==0&&j==0) {
				trHTML += '<td class="c-last-ten-year">'+toYear+'</td>';
			}else if(i==2&&j==3){
				trHTML += '<td class="c-next-ten-year">'+toYear+'</td>';
			}else{
				trHTML += '<td class="c-chose-year">'+toYear+'</td>';
			}
			toYear++;			
		}
		tr.innerHTML = trHTML;
		frag.appendChild(tr);
	}
	tbody.appendChild(frag);


	//将当年特殊显示
	var today = new Date();
	var thisYear = today.getFullYear();

	if (Math.floor(tYear/10)*10==Math.floor(thisYear/10)*10) {
		var tds = tbody.getElementsByTagName('td');

		for (var i = 0; i < tds.length; i++) {
			if(tds[i].innerHTML == thisYear){
				tds[i].className += ' c-show-year-bgc';
			}
		}
	}

	this.bindYearDom();

}





