window.onload = function(){
	updateTree();
}

/*存放遍历的节点*/
var nodes = [];

/*公用方法*/
function $(id){
	return document.querySelector(id);
}


function addEventHandler(ele,event,handler){
	if(window.addEventListener){
		ele.addEventListener(event,handler,false);
	}else if (window.attachEvent) {
		ele.attachEvent("on"+event,handler);
	}else{
		ele["on"+event] = handler;
	}
}




function updateTree(){
	/*给每个有子元素的li添加类名openul*/
	var tree = new Tree($("#root"));
	nodes = [];
	tree.depTraverse(storeNode);
	for (let i = 1,len = nodes.length; i < len; i++) {
		for (let j = 0; j < nodes[i].childNodes.length; j++) {
			if(nodes[i].childNodes[j].nodeName == "UL"){
				nodes[i].className = "openul";
				break;
			}
			
		}
	}

	/*将每个a添加子元素<span id="add-a"><sapn id="del-a">*/
	var a = $("#root").getElementsByTagName("a");
	for (let i = 0; i < a.length; i++) {
		a[i].innerHTML +="<span id='add-a'>+</span><span id='del-a'>-</span>"
	}

}

/*构造树*/
function Tree(n){
	var root = n;

	/*深度遍历*/
	this.depTraverse = function(callback){
		depTraverseNode(root,callback);
	}
	var depTraverseNode = function(node,callback){

		if (node!=null) {
			callback(node);
			for (var i = 0 , len = node.childNodes.length; i < len; i++) {
				depTraverseNode(node.childNodes[i],callback);
			}
			
		}
	}
}

/*将遍历的节点存入nodes*/
function storeNode(node){	
	if (node.nodeType === 1) {
		nodes.push(node);
	}
}



addEventHandler($("#root"),"click",function(e){
	/*点击a相应展开和闭合相应子元素*/
	if(e.target && e.target.nodeName == "A" ){
		var a = e.target.parentNode.childNodes;
		for (var i = 0; i < a.length; i++) {

			if (a[i].nodeName == "UL") {
				if (a[i].style.display == "none") {
					a[i].style.display = "block";
					e.target.parentNode.className = "openul";
				}else{
					a[i].style.display = "none";
					e.target.parentNode.className = "closeul";
				}
			}

		}
	}

	/*点击span#add-a*/
	if (e.target.nodeName == "SPAN" && e.target.id =="add-a" ) {
		var content = prompt("请输入节点内容").replace(/\s+/,"");
		if(content != ""){
			var getUl = e.target.parentNode.parentNode.getElementsByTagName("ul");
			if(getUl.length != 0){
				var li = document.createElement("li");
				li.innerHTML = "<a>"+content+"<span id='add-a'>+</span><span id='del-a'>-</span></a>";
				getUl[0].appendChild(li);
			}else{
				var getLi = e.target.parentNode.parentNode;
				var ul = document.createElement("ul");
				ul.innerHTML = "<li><a>"+content+"<span id='add-a'>+</span><span id='del-a'>-</span></a></li>";
				getLi.appendChild(ul);
				getLi.className = "openul";
			}
		}
	}
	/*点击span#del-a*/
	if (e.target.nodeName == "SPAN" && e.target.id =="del-a" ) {
		e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
	}
});


/*搜索*/
addEventHandler($("#search-btn"),"click",function(){
	/*清除上次元素影响*/
	if ($(".red-color")) {
		var redNodes = document.getElementsByClassName("red-color");
		for (let i = 0; i < redNodes.length; i++) {
			redNodes[i].className = "";
		}
		
	}

	/*获取查询元素*/
	var searchText = $("#search-text").value.replace(/\s+/,"");
	if (searchText == "") {
		return;
	}
	$("#search-text").value = "";

	/*将ul节点收起*/
	var ul = $("#root").getElementsByTagName("ul");
	for (let i = 0, len = ul.length; i < len; i++) {
		ul[i].style.display = "none";
	}
	for (let i = 1,len = nodes.length; i < len; i++) {
		for (let j = 0; j < nodes[i].childNodes.length; j++) {
			if(nodes[i].childNodes[j].nodeName == "UL"){
				nodes[i].className = "closeul";
				break;
			}
			
		}
	}
	
	/*遍历#root 将符合搜索的节点存入findNodes，并将符合元素颜色设为红色*/
	nodes = [];
	var findNodes = [];
	var tree = new Tree($("#root"));
	tree.depTraverse(storeNode);
	for (let i = 1,len = nodes.length; i < len; i++) {
		if (nodes[i].nodeName == "LI" ) {		
			if ( RegExp(searchText).test(nodes[i].firstChild.textContent)) {
				nodes[i].firstChild.className = "red-color";
				findNodes.push(nodes[i]) 
			}
			
		}
	}
	/*将findNodes中节点的父元素展开*/
	for (let i = 0; i < findNodes.length; i++) {
		var node = findNodes[i];
		while (node.parentNode) {

			if (node.parentNode.nodeName == "UL") {
				node.parentNode.style.display = "block";
				if (node.parentNode.parentNode.nodeName == "LI") {
					node = node.parentNode;
				}else{break;}
				
			}else if(node.parentNode.nodeName == "LI"){
				node.parentNode.className = "openul";
				if (node.parentNode.parentNode.nodeName == "UL") {
					node = node.parentNode;	
				}else{break;}

			}
		}
	}

})











