/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input").value.trim();
	var aqi = document.getElementById("aqi-value-input").value.trim();
	document.getElementById("aqi-city-input").value = null;
	document.getElementById("aqi-value-input").value = null;
	if(!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
        alert("城市名必须为中英文字符！")
        return;
    }
    if(!aqi.match(/^\d+$/)) {
        alert("空气质量指数必须为整数！")
        return;
    }
	aqiData[city] = aqi;
}

/**
 * 渲染aqi-table表格
 */

function renderAqiList() {
	var table = document.getElementById("aqi-table");
	var fr = document.createDocumentFragment();
	table.innerHTML = "";

		var tr = document.createElement("tr");
		var th1 = document.createElement("th");
		var th2 = document.createElement("th");
		var th3 = document.createElement("th");
		th1.innerHTML = "城市";
		th2.innerHTML = "空气指数";
		th3.innerHTML = "操作";
		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		fr.appendChild(tr);

	for (var i in aqiData) {
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var td3 = document.createElement("td");
		td1.innerHTML = i;
		td2.innerHTML = aqiData[i];
		td3.innerHTML = '<button>删除</button>';
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		fr.appendChild(tr);
	}
	table.appendChild(fr);
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(target) {
	// do sth.
	var tr = target.parentElement.parentElement;
	var strCity = tr.children[0].innerHTML;
	delete aqiData[strCity];
	renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

    document.getElementById("add-btn").onclick = function(){
	    addBtnHandle();
  	};
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

     document.getElementById("aqi-table").addEventListener("click", function(event){
        if(event.target.nodeName.toLowerCase() === 'button'){
        	delBtnHandle.call(null,event.target);
        } 
    });

}

init();
