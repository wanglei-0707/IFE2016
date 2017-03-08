var modal = $("modal"),
	container = $("container"),
	shadow = $("shadow"),
	confirm = $("confirm"),
	cancel = $("cancel");

function $(id){
	return document.getElementById(id);
}

function addEvent(ele,type,handler){
	if(ele.addEventListener){
		ele.addEventListener(type,handler,false);
	}else if(ele.attachEvent){
		ele.attachEvent("on"+type,handler);
	}
	else{
		ele["on"+type] = handler;
	}
}

//事件委托
function imgAddEvent(ele,type,tag,handler){
	addEvent(ele,type,function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		if(target && target.tagName === tag.toUpperCase()){
			handler.call(this);
		}
		stopPropa(event);
	});
}

//点击图片，弹出层和遮罩层显示
function showModal(){
	shadow.style.display = "block";
	shadow.style.width = document.documentElement.clientWidth + "px";
	shadow.style.height = document.body.clientHeight + 100 + "px";
	modal.style.display = "block";
	modal.style.top = (document.documentElement.clientHeight - modal.offsetHeight)/2 + "px";
	modal.style.left = (document.documentElement.clientWidth - modal.offsetWidth)/2 + "px";
}

//点击遮罩层或者取消按钮，遮罩层和弹出层消失
function hideModal(){
	shadow.style.display = "none";
	modal.style.display = "none";
}

//点击确定按钮，隐藏弹出层，弹出alert
function confirmFun(){
	hideModal();
	alert("保存成功");
}

//鼠标点击弹出层内部，移动弹出层
function moveModal(event){
	event = event || window.event;
	var disX = event.clientX - modal.offsetLeft;
	var disY = event.clientY - modal.offsetTop;
	var flag = true;
	addEvent(document,"mousemove",function(event){
		event = event || window.event;
		if(flag){
			moveFun(event,disX,disY);
		}
	});
	addEvent(document,"mouseup",function(){
		flag = false;
	});
}

//使弹出层在屏幕可见区域内移动
function moveFun(event,posX,posY){
	var l = event.clientX - posX,
		t = event.clientY - posY,
		winW = document.documentElement.clientWidth || document.body.clientWidth,
		winH = document.documentElement.clientHeight || document.body.clientHeight,
		maxW = winW - modal.offsetWidth,
		maxH = winH - modal.offsetHeight;
	if(l < 0){
		l = 0;
	}else if(l > maxW){
		l = maxW;
	}
	if(t < 0){
		t = 0;
	}else if(t > maxH){
		t = maxH;
	}
	modal.style.left = l + "px";
	modal.style.top = t + "px";
}

//阻止事件冒泡
function stopPropa(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}

//初始化
function init(){
	imgAddEvent(container,"click","img",showModal);
	addEvent(shadow,"click",hideModal);
	addEvent(cancel,"click",hideModal);
	addEvent(confirm,"click",confirmFun);
	addEvent(modal,"mousedown",moveModal);
}

init();