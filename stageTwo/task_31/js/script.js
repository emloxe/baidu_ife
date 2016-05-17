var schoolData = {
	"湖北" : ["武汉大学","华中科技大学","华中师范大学","中国地质大学","武汉纺织大学"],
	"北京" : ["北京大学","清华大学","北京外国语大学"],
	"上海" : ["上海交通大学","复旦大学","上海外国语大学","上海大学"]
};


var $ = function(id){
	return  document.getElementById(id);
} 

function radioCheck(){
	if ($("inSchool").checked) {
		$("optInWork").className = "optInWork hidden";
		$("optInSchool").className = "optInSchool";
	}else if($("inWork").checked){
		$("optInSchool").className = "optInSchool hidden";
		$("optInWork").className = "optInWork";
	}
};

/*加载页面时初始化*/
function initialContent(){
	var placeName,schoolName;
	for (var i in schoolData) {		
		placeName += "<option>"+i+"</option>";
	}
	$("place").innerHTML = placeName;
	var nowPlace = $("place").value;
	for (var i = 0; i < schoolData[nowPlace].length; i++) {
		schoolName += "<option>"+schoolData[nowPlace][i]+"</option>";
	}
	$("school").innerHTML = schoolName;
	
}


function generateText(){
	var schoolName;
	var nowPlace = $("place").value;
	for (var i = 0; i < schoolData[nowPlace].length; i++) {
		schoolName += "<option>"+schoolData[nowPlace][i]+"</option>";
	}
	$("school").innerHTML = schoolName;
}


$("content").onchange = function(){
	radioCheck();
	generateText();
}

window.onload = function(){
	$("inSchool").checked = "checked";
	initialContent();
}








