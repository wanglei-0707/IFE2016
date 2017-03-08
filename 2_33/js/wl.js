var table = document.getElementById("chessboard");
var action = document.getElementById("action");

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

function chessBoard(table,col,row){
	this.table = table;
	this.col = Math.floor(col);
	this.row = Math.floor(row);
	this.chess;
	this.chessTop;
	this.chessLeft;
	this.direction = 0;  //0：上  1：右  2： 下   3：左
	this.moveDirection = 0;
}

chessBoard.prototype.init = function(){
	this.chessTop = 40 * this.row / 2;
	this.chessLeft = 40 * this.col / 2;
	this.createChessBoard();
	this.createChess();
}

chessBoard.prototype.createChessBoard = function(){
	var html = "";
	//thead部分
	html += "<thead><tr><th></th>";    
	for(var i=1;i<=this.col;i++)
		html += "<th>" + i + "</th>";
	html += "</tr></thead><tbody>";
	//tbody部分
	for(var i=1;i<=this.row;i++){            
		html += "<tr><td>" + i + "</td>";
		for(var j=1;j<=this.col;j++){
			html += "<td></td>";
		}
		html += "</tr>";
	}
	html += "</tbody>"
	this.table.innerHTML = html;
}

chessBoard.prototype.createChess = function(){
	this.chess = document.createElement("div"); 
	this.chess.className = "chess";
	this.updateChess();
	this.table.parentNode.insertBefore(this.chess,this.table);
}

chessBoard.prototype.updateChess = function(){
	this.chess.style.top = this.chessTop + "px";
	this.chess.style.left = this.chessLeft + "px";
}

chessBoard.prototype.executeFun = function(val){
	var rotate,move;
	switch(val){
		case "go":
			move = true;
			rotate = false;
			break;
		case "traTop":
			this.moveDirection = 0;
			move = true;
			rotate = false;
			break;
		case "movTop":
			this.direction = 0;
			this.moveDirection = 0;
			move = true;
			rotate = true;
			break;
		case "tunRig": 
			this.direction = (this.direction + 1) % 4;
			this.moveDirection = this.direction;
			move = false;
			rotate = true;
			break;
		case "traRig":
			this.direction = (this.direction + 1) % 4;
			this.moveDirection = 1;
			move = true;
			rotate = false;
			break;
		case "movRig":
			this.direction = 1;
			this.moveDirection = 1;
			move = true;
			rotate = true;
			break;
		case "tunBac": 
			this.direction = (this.direction + 2) % 4;
			this.moveDirection = this.direction;
			move = false;
			rotate = true;
			break;
		case "traBot":
			this.direction = (this.direction + 2) % 4;
			this.moveDirection = 2;
			move = true;
			rotate = false;
			break;
		case "movBot":
			this.direction = 2;
			this.moveDirection = 2;
			move = true;
			rotate = true;
			break;
		case "tunLef": 
			this.direction = (this.direction + 3) % 4;
			this.moveDirection = this.direction;
			move = false;
			rotate = true;
			break;
		case "traLef":
			this.direction = (this.direction + 3) % 4;
			this.moveDirection = 3;
			move = true;
			rotate = false;
			break;
		case "movLef":
			this.direction = 3;
			this.moveDirection = 3;
			move = true;
			rotate = true;
			break;
	}
	if(this.moveDirection == 0)
		this.goUp(move,rotate);
	else if(this.moveDirection == 1)
		this.goRight(move,rotate);
	else if(this.moveDirection == 2)
		this.goDown(move,rotate);
	else
		this.goLeft(move,rotate);
}

chessBoard.prototype.goUp = function(move,rotate){
	if(move)
		this.chessTop = this.chessTop - 40 < 40 ? 40 : this.chessTop - 40
	if(rotate)
		this.chess.style.transform = "rotate(0deg)"
	this.updateChess();
}

chessBoard.prototype.goDown = function(move,rotate){
	if(move)
		this.chessTop = this.chessTop + 40 > 40 * this.row ? 40 * this.row : this.chessTop + 40
	if(rotate)
		this.chess.style.transform = "rotate(-180deg)";
	this.updateChess();
}

chessBoard.prototype.goLeft = function(move,rotate){
	if(move)
		this.chessLeft = this.chessLeft - 40 < 40 ? 40 : this.chessLeft - 40
	if(rotate)
		this.chess.style.transform = "rotate(-90deg)";
	this.updateChess();
}

chessBoard.prototype.goRight = function(move,rotate){
	if(move)
		this.chessLeft = this.chessLeft + 40 > 40 * this.col ? 40 * this.col : this.chessLeft + 40
	if(rotate)
		this.chess.style.transform = "rotate(90deg)";
	this.updateChess();
}

function init(){
	var chessBoardObj = new chessBoard(table,10,10);
	chessBoardObj.init();
	addEvent(execute,"click",function(){
		chessBoardObj.executeFun(action.value);
	});
}

init();
