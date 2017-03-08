var nameArry = ["小明","小红","小花","小亮","小华","小草","小新"];
var data = [];

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

function createData(){
	var per = [],name,score,sum;
	var count = Math.floor(Math.random()*50+20);
	for(var i=0;i<count;i++){
		per = [];
		sum = 0;
		name = nameArry[Math.floor(Math.random()*nameArry.length)];
		per.push(name);
		for(var j=0;j<3;j++){
			score = Math.floor(Math.random()*40+60);
			per.push(score);
			sum += score;
		}
		per.push(sum);
		data.push(per);
	}
}

function createTable(){
	var tableBody = document.getElementById("tableBody");
	for(var i=0;i<data.length;i++){
		var tr = document.createElement("tr");
		var html = "";
		for(var j=0;j<data[i].length;j++){
			html += "<td>" + data[i][j] + "</td>";
		}
		tr.innerHTML = html;
		tableBody.appendChild(tr);
	}
}

var table = document.getElementsByTagName("table")[0];
var thead = table.getElementsByTagName("thead")[0];

function fixedThead(event){
	if(window.scrollY-table.offsetTop < 0){
		thead.style.position = "static";
	}else if(window.scrollY-table.offsetTop < table.offsetHeight){
		thead.style.position = "fixed";
		thead.style.top = "0px";
	}else{
		thead.style.position = "static";
	}
}

function init(){
	createData();
	createTable();
	console.log(table.offsetHeight);
	document.body.style.height = table.offsetHeight + 800 + "px";
	console.log(document.body.offsetHeight);
	addEvent(window,"scroll",fixedThead);
}

init();