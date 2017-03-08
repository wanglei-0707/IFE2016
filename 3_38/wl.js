var data = [
	["小明",80,90,70,0],
	["小红",90,60,90,0],
	["小亮",60,100,70,0],
	["小黑",80,70,60,0]
];

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

function createTable(){
	var table = $("tableData");
	for(var i=0;i<data.length;i++){
		var tr = document.createElement("tr");
		var html="";
		var sum = 0;
		for(var j=0;j<data[i].length-1;j++){
			html += "<td>" + data[i][j] + "</td>";
			if(typeof data[i][j] == "number")
				sum += data[i][j];
		}
		data[i][data[i].length-1] = sum;
		html += "<td>" + sum + "</td>";
		tr.innerHTML = html;
		table.appendChild(tr);
	}
}

function updateTable(){
	var trs = document.getElementsByTagName("tr");
	for(var i=0;i<data.length;i++){
		for(var j=0;j<data[i].length;j++){
			trs[i+1].cells[j].innerHTML = data[i][j];
		}
	} 
}

function sortData(dataArry,col,increase){
	if(increase)
		dataArry.sort(function(a,b){
			return a[col] - b[col];
		});
	else
		dataArry.sort(function(a,b){
			return b[col] - a[col];
		});
	updateTable();
}

function init(){
	createTable();
	for(var i=1;i<data[0].length;i++){
		addEvent($("up"+i),"click",function(){
			sortData(data,parseInt(this.id[2]),true);
		});
		addEvent($("down"+i),"click",function(){
			sortData(data,parseInt(this.id[4]),false);
		});
	}
}

init();

