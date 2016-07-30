
/*

var dialog = new Dialog({
	clickDom :  
	showDom : //showDom 为将要显示的弹框，弹框中的内容样式需要提前写好，css记得写（position:fixed;z-index:999）	
	mask ：//maskDom 为遮罩层，css需要自己写，其中需要写（z-index:998;background-color:rgba(0,0,0,0.1)）		

})

	dialog.close().move().resize(minWidth,minHeight);

	resize : //调用函数后，可以改变浮出层宽高，
			第一个参数为可改变的最小宽度，第二个参数为可改变的最小高度
	 		注意最小宽高理应小于浮出层的本身宽高值，参数可不填
	move : //调用函数后，可以改变浮出层位置，
			传入所需控制浮出层的节点
	close ： //传入关闭按钮节点，可多次调用
*/



//构造函数
function Dialog(opts){
	//构造函数必需要的参数
	this.clickDom = opts.clickDom; 
	this.showDom = opts.showDom; 
	this.maskDom = opts.maskDom;


	this.init();
}

Dialog.prototype.init = function(){
	var self = this;
	var clickDom = this.clickDom;
	var showDom = this.showDom;
	var maskDom = this.maskDom;

	
	clickDom.onclick = function (){
		showDom.style.display = 'block';
		maskDom.style.display = 'block';

		self.setPosition();		
	}

	maskDom.onclick = function(){
		showDom.style.display = 'none';
		maskDom.style.display = 'none';
	}

	window.onresize = function () {
		if (showDom.style.display == 'block') {
			self.setPosition();
		}		
	}


}

Dialog.prototype.close = function(ele){
	var showDom = this.showDom;
	var maskDom = this.maskDom;

	ele.onclick = function(){
		showDom.style.display = 'none';
		maskDom.style.display = 'none';
	}

	return this;
}

//设置浮出层的元素居中
Dialog.prototype.setPosition = function(){
	var showDom = this.showDom;
	var domWidth = showDom.offsetWidth;
	var domHeight = showDom.offsetHeight;
	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;

	if (winWidth < domWidth) {
		showDom.style.left = 0 + 'px';
	}else{
		showDom.style.left = winWidth/2 - domWidth/2 + 'px';
	}

	if (winHeight < domHeight) {
		showDom.style.top = 0 + 'px';
	}else{
		showDom.style.top = winHeight/2 - domHeight/2 + 'px';
	}

}


Dialog.prototype.resize = function(minWidth,minHeigth){
	var showDom = this.showDom;

	var rightBox = document.createElement("div");
	var bottomBox = document.createElement("div");
	var rightBottomBox = document.createElement("div");

	rightBox.class = rightBox.className = 'ui-resizable-r ui-Resizable-ctrl';
	bottomBox.class = bottomBox.className = 'ui-resizable-b ui-Resizable-ctrl';
	rightBottomBox.class = rightBottomBox.className = 'ui-resizable-rb ui-Resizable-ctrl';

	showDom.appendChild(rightBox);
	showDom.appendChild(bottomBox);
	showDom.appendChild(rightBottomBox);


		//	ctrl ：控制元素 ， type 类型
		var  m_ctrl , m_type ;
		
		//	moving：		是否侦听鼠标移动， 
		//	m_start_x：	鼠标相对ctrl元素的left、right 
		//	m_to_x：	鼠标的新位置
		var moving = 0 ,m_start_x = 0 , m_start_y = 0 , m_to_x = 0 , m_to_y = 0  ;
		
		//	面板最小尺寸
		var m_min_w ,m_min_h ;
		if (minWidth) {m_min_w = minWidth}else{ m_min_w = 100}
		if (minHeigth) {m_min_h = minHeigth}else{m_min_h = 40}
		

		//	在控制元素中按下
		function on_mousedown( e , ctrl , type ){
			var e = e || window.event;
			
			//	计算出鼠标页面位置 和 当前元素位置的差 = 鼠标相对元素的位置
			m_start_x =  e.pageX - ctrl.offsetLeft;
			m_start_y =  e.pageY - ctrl.offsetTop;
						
			m_ctrl  = ctrl;
			m_type  = type;
			
			//	开始处理移动事件
			moving = setInterval(on_move,10);

		}
		//	页面鼠标移动侦听处理
		var mousemove = function( e ){
			var e = window.event || e;
			m_to_x = e.pageX;
			m_to_y = e.pageY;
		}
		//	鼠标移动处理
		function on_move(){

			if(moving){
				var to_x = m_to_x - m_start_x;
				var to_y = m_to_y - m_start_y;
	            to_x = Math.max(to_x,m_min_w);
	        	to_y = Math.max(to_y,m_min_h);
				switch(  m_type ){
					case 'r' :
						m_ctrl.style.left =  to_x + "px";
						showDom.style.width=to_x+5+'px';
					break;
					case 'b' :
						m_ctrl.style.top  = to_y+ "px";
						showDom.style.height=to_y+5+'px';
					break;
					case 'rb' :
						m_ctrl.style.left =to_x + "px";
						m_ctrl.style.top  =to_y+ "px";

	                    showDom.style.width=to_x+10+'px';
	                    showDom.style.height=to_y+10+'px';
						
					break;
				}
			}
			
		}
		
		//	鼠标弹起处理
		var stop = function(e){
			clearInterval(moving);
			var cls = document.getElementsByClassName('ui-Resizable-ctrl');
			for(var i=0;i<cls.length;i++){
				/*在鼠标弹起之后清除控制元素的left和top　*/
			cls[i].style.left = '';
	        cls[i].style.top = '';
			}
		}

		
	//	为调整控制元素设置拖拽处理
	rightBox.addEventListener('mousedown',function(e){
		on_mousedown(e,rightBox,'r');
	})
	bottomBox.addEventListener('mousedown',function(e){
		on_mousedown(e,bottomBox,'b');
	})
	rightBottomBox.addEventListener('mousedown',function(e){
		on_mousedown(e,rightBottomBox,'rb');
	})

	document.addEventListener('mousemove',mousemove);
	document.addEventListener('keyup',stop);
	document.addEventListener('mouseup',stop);

	return this;
}


Dialog.prototype.move = function(dom){
	var moveDom = dom;
	var showDom = this.showDom;
	var startX,startY,toX,toY,endX,endY,moving;

	moveDom.style.cursor = 'move';

	var mousedown = function(e){
		var e = e ||window.event;
		startX = e.pageX - showDom.offsetLeft;
		startY = e.pageY - showDom.offsetTop;

		moving = setInterval(onMove,10);
	}

	var mousemove = function(e){
		var e = e ||window.event;
		endX = e.pageX;
		endY = e.pageY;
	}

	function onMove(){
		if (moving) {
			toX = endX - startX;
			toY = endY - startY;
			showDom.style.left = toX + 'px';
			showDom.style.top = toY + 'px';
		}
	}

	var stop = function(e){
		clearInterval(moving);
	}

	moveDom.addEventListener('mousedown',mousedown);
	document.addEventListener('mousemove',mousemove);
	document.addEventListener('keyup',stop);
	document.addEventListener('mouseup',stop);

	return this;
}