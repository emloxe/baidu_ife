var $ = function(id){
	return document.getElementById(id);
}
function addEventHandler(ele,event,handler){
	if (window.addEventListener) {
		ele.addEventListener(event,handler,false);
	}else if(window.attachEvent){
		ele.attachEvent("on"+event,handler);
	}else{
		ele["on"+event] = handler;
	}

}

var validateRule = {
	name : {
		hint : "长度为4~16个字符",
		empty : "名称不能为空",
		success : "名称可用",
		error : "格式错误",
		reg : function(value){
			return /^\S{4,16}/.test(value.replace(/[\u0391-\uFFE5]/g,"nn"));
		}
	},
	password : {
		hint : "长度为6~18的非空字符",
		empty : "密码不能为空",
		success : "密码可用",
		error : "格式错误",
		reg : function(value){
			return /^[\S\w\d]{6,18}$/.test(value)
		}
	},
	confirmPwd : {
		hint : "",
		empty : "确认密码不能为空",
		success : "密码输入一致",
		error : "密码不输入一致",
		reg : function(value){
			return $("password").value == value;
		}
	},
	email : {
		hint : "",
		empty : "邮箱不能为空",
		success : "邮箱可用",
		error : "格式错误",
		reg : function(value){
			return /^\w[\w\d_]{3,18}@\w{1,10}.\w{2,8}$/.test(value);
		}
	},
	phoneNum :{
		hint : "",
		empty : "手机号码不能为空",
		success : "手机号码可用",
		error : "格式错误",
		reg : function(value){
			return /^1\d{10}$/.test(value);
		}
	}
}


var event = {

	/*获得焦点*/
	onfocus : function (ele){
		var eleId = ele.id;
		var elehint;

		$(eleId+"Hint").className = "hint";
		$(eleId+"Hint").innerHTML = validateRule[eleId].hint;		
	},
	/*失去焦点*/
	onblur : function(ele){
		var eleId = ele.id;
		var eleValue = ele.value;

		if(eleValue.replace(/\s+/,"") == ""){
			ele.className = "danger"
			$(eleId+"Hint").className = "danger";
			$(eleId+"Hint").innerHTML = validateRule[eleId].empty;	
		}else if(validateRule[eleId].reg(eleValue)){
			ele.className = "success"
			$(eleId+"Hint").className = "success";
			$(eleId+"Hint").innerHTML = validateRule[eleId].success;	
		}else{
			ele.className = "danger"
			$(eleId+"Hint").className = "danger";
			$(eleId+"Hint").innerHTML = validateRule[eleId].error;
		}
	},
	init : function(){
		var input = document.getElementsByTagName("input");
		for (var i = 0; i < input.length; i++) {
			input[i].onfocus = function(e){
				event.onfocus(e.target);
			}
			input[i].onblur = function(e){
				event.onblur(e.target);
			}
		}
		$("submitBtn").onclick = function(){
			var allTrue = true;
			for (var j = 0; j < input.length; j++) {
				if(!validateRule[input[j].id].reg(input[j].value)) allTrue = false;
			}
			if (allTrue) {
				alert("提交成功");
			}else{
				alert("输入有误");
			}
		}
	}
}



event.init();













