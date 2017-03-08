var main = $("#main");
var colInput = $("#col");
var gapInput = $("#gap");
var addBtn = $("#add"); 
var maskLayer = $("#maskLayer");


window.onload = function(){
	var waterFall = new WaterFall({col:5,gap:18,containerId:"#main",boxClsName:".box",colInput:colInput,gapInput:gapInput,addBtn:addBtn});
}