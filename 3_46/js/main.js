var canvas;
var cxt;
// var SCREEN_WIDTH = 320;
// var SCREEN_HEIGHT = 480;
// var lastTime;
// var deltaTime;
// var WALL_WIDTH = 40;
var wallArr = [];


var documentWidth = window.screen.availWidth;
var SCREEN_WIDTH = documentWidth;
var SCREEN_HEIGHT = window.screen.availHeight;
var WALL_WIDTH = documentWidth/8;
var wallArr = [];

function prepareForMobile(){
	if(documentWidth > 500){
		SCREEN_WIDTH = 320;
		SCREEN_HEIGHT = 480;
		WALL_WIDTH = 40;
		col = SCREEN_WIDTH/WALL_WIDTH;
		row = SCREEN_HEIGHT/WALL_WIDTH;
		spy.x = WALL_WIDTH/2;
		spy.y = WALL_WIDTH/2;
		spy.radius = WALL_WIDTH/4;
		file.centerX = SCREEN_WIDTH-WALL_WIDTH/2;
		file.centerY = SCREEN_HEIGHT-WALL_WIDTH/2;
		file.sideLen = WALL_WIDTH*3/4;
		file.height = WALL_WIDTH*3/4;
	}
}

//特工对象
var spy = {
	x: WALL_WIDTH/2,
	y: WALL_WIDTH/2,
	radius: WALL_WIDTH/4,
}

//机密文件对象
var file = {
	centerX: SCREEN_WIDTH-WALL_WIDTH/2,
	centerY: SCREEN_HEIGHT-WALL_WIDTH/2,
	sideLen: WALL_WIDTH*3/4,
	height: WALL_WIDTH*3/4
}

//解决requestAnimationFrame函数的浏览器兼容问题
// window.requestAnimFrame = (function(){
// 	return window.requestAnimationFrame || 
// 			window.webkitRequestAnimationFrame || 
// 			window.mozRequestAnimationFrame || 
// 			window.oRequestAnimationFrame || 
// 			window.msRequestAnimationFrame;
// })

//将屏幕划分为方格
var col = Math.floor(SCREEN_WIDTH/WALL_WIDTH)+1;
var row = Math.floor(SCREEN_HEIGHT/WALL_WIDTH)+1;
var node;

//初始化背景墙数组
function initWallArr(){
	for(var i=0;i<row;i++){
		wallArr[i] = [];
		for(var j=0;j<col;j++){
			node = new Node(j*WALL_WIDTH,i*WALL_WIDTH,null);
			wallArr[i].push(node);
		}
	}
}

//寻路一次后，将所有节点的父节点置为null，游戏通关重置时将所有节点的父节点置为null，isWall置为false
function clearWallArr(parNode,isWall){
	for(var i=0;i<row;i++){
		for(var j=0;j<col;j++){
			if(parNode){
				wallArr[i][j].parNode = null;
			}
			if(isWall){
				wallArr[i][j].isWall = false;
			}
		}
	}
}

//渲染画布，包括背景颜色和墙
function drawBackGround(){
	for(var i=0,rowLen=wallArr.length;i<rowLen;i++){
		for(var j=0,colLen=wallArr[i].length;j<colLen;j++){
			cxt.beginPath();
			if(wallArr[i][j].isWall){
				cxt.fillStyle = "#8b4513";
			}else{
				cxt.fillStyle = "#ffddaa";
			}
			cxt.fillRect(wallArr[i][j].x,wallArr[i][j].y,SCREEN_WIDTH,SCREEN_HEIGHT);
			cxt.closePath();
		}
	}
}

//渲染特工
function drawSpy(){
	cxt.beginPath();
	cxt.fillStyle = "#00dd00"
	cxt.arc(spy.x,spy.y,spy.radius,0,2*Math.PI,false);
	cxt.fill();
	cxt.closePath();
}

//渲染机密文件
function drawFile(){
	cxt.beginPath();
	cxt.fillStyle = "#ffbb00";
	cxt.moveTo(file.centerX-file.sideLen/2,file.centerY-file.height/2);
	cxt.lineTo(file.centerX+file.sideLen/2,file.centerY-file.height/2);
	cxt.lineTo(file.centerX,file.centerY+file.height/2);
	cxt.closePath();
	cxt.fill();
}

//随机生成墙
function createWall(){
	var wallNum = Math.floor(Math.random() * 5 + 10);
	var i,j;
	for(var k=0;k<wallNum;k++){
		i = Math.floor(Math.random() * row);
		j = Math.floor(Math.random() * col);
		while(true){
			if((Math.abs(spy.y-i*WALL_WIDTH) == WALL_WIDTH/2 && Math.abs(spy.x-j*WALL_WIDTH) == WALL_WIDTH/2)
			|| (Math.abs(file.centerY-i*WALL_WIDTH) == WALL_WIDTH/2 && Math.abs(file.centerX-j*WALL_WIDTH) == WALL_WIDTH/2)){
				i = Math.floor(Math.random() * row);
				j = Math.floor(Math.random() * col);
			}else{
				break;
			}
		}
		wallArr[i][j].isWall = true;
	}
	//如果机密文件的上面和左面同时有墙，将左面的墙去掉，保证特工能够到达终点，以保证关卡可通
	if(wallArr[row-1][col-2].isWall && wallArr[row-2][col-1].isWall){
		wallArr[row-1][col-2].isWall = false;
	}
}

function gameReset(){
	clearWallArr(true,true);
	spy.x = WALL_WIDTH/2;
	spy.y = WALL_WIDTH/2;
	createWall();
	render();
}

function render(){
	drawBackGround();
	drawFile();
	drawSpy();
}

// function gameloop(){
// 	window.requestAnimFrame(gameloop);
// 	var now = Date.now();
// 	deltaTime = now - lastTime;
// 	lastTime = now;
// 	render();
// }

function init(){
	prepareForMobile();
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext("2d");
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	canvas.style.left = (window.screen.width - SCREEN_WIDTH) / 2 + "px";
	lastTime = Date.now();
	initWallArr();
	createWall();
	render();
}

init();

canvas.onclick = function(event){
	event = event || window.event;
	var x = Math.floor((event.clientX - canvas.offsetLeft)/WALL_WIDTH)*WALL_WIDTH;
	var y = Math.floor((event.clientY - canvas.offsetTop)/WALL_WIDTH)*WALL_WIDTH;
	var astar = new Astar(row,col);
	var resultList = astar.searchPos(spy.x-WALL_WIDTH/2,spy.y-WALL_WIDTH/2,x,y);
	if(resultList == -1){
		alert("终点是墙无法移动");
	}else if(resultList == 0){
		alert("路径不存在");
	}else{
		var k = 0, len = resultList.length, timer;
		timer = setInterval(function(){
			if(k==len){
				clearInterval(timer);
				k = 0;
				console.log(spy.x + " " + spy.y);
				console.log(file.centerX + " " + file.centerY);
				if(spy.x == file.centerX && spy.y == file.centerY){
					alert("恭喜过关！");
					gameReset();
				}
				return;
			}else{
				cxt.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
				spy.x = resultList[k].x+WALL_WIDTH/2;
				spy.y = resultList[k].y+WALL_WIDTH/2;
				render();
				k++;
			}
		}, 200);
		clearWallArr(true,false);
	}
	
}