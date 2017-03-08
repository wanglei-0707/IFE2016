var canvas = document.getElementById("canvas");
var cxt = canvas.getContext("2d");
var UNIVERSE_WIDTH = 600;
var UNIVERSE_HEIGHT = 600;
var TRACK_NUM = 3;

function renderUniverse(){
	canvas.width = UNIVERSE_WIDTH;
	canvas.height = UNIVERSE_HEIGHT;
	cxt.fillStyle = "black";
	cxt.rect(0,0,UNIVERSE_WIDTH,UNIVERSE_HEIGHT);
	cxt.fill();
	cxt.beginPath();
	cxt.arc(UNIVERSE_WIDTH/2,UNIVERSE_HEIGHT/2,80,0,2*Math.PI,false);
	cxt.fillStyle = "blue";
	cxt.fill();
	cxt.closePath();
	for(var i=0;i<TRACK_NUM;i++){
		cxt.beginPath();
		cxt.arc(UNIVERSE_WIDTH/2,UNIVERSE_HEIGHT/2,150+i*50,0,2*Math.PI,false);
		cxt.strokeStyle = "#d3d3d3";
		cxt.stroke();
		cxt.closePath();
	}
}

renderUniverse();