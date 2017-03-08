;(function(){
	var options = {
		albumSelector: ".album",
		imageSelector: ".image"
	}

	function handleSquare(boxes,container){
		if(boxes.length === 3){
			var sideLength = parseFloat(container.clientHeight) / 2;
			boxes[0].style.width = (container.clientWidth - sideLength) + "px";
			boxes[1].style.width = sideLength + "px";
			boxes[1].style.height = sideLength + "px";
			boxes[2].style.width = sideLength + "px";
			boxes[2].style.height = sideLength + "px";
		}else if(boxes.length === 5){
			var sideLength = parseFloat(container.clientWidth) / 3;
			boxes[0].style.width = parseFloat(container.clientWidth - sideLength) + "px";
			boxes[1].style.width = sideLength + "px";
			boxes[1].style.height = sideLength + "px";
			boxes[4].style.width = sideLength + "px";
			boxes[4].style.height = parseFloat(container.clientHeight - sideLength) + "px";
		}
	}

	//API
	var api = {
		config:function(opts){
			if(!opts) {
				return {};
			}
			for(var key in opts){
				options[key] = opts[key];
			}
			return this;
		},
		listen:function listen(){
			containers = document.querySelectorAll(options.albumSelector);
			for(var i=0,len=containers.length;i<len;i++){
				boxes = containers[i].querySelectorAll(options.imageSelector);
				handleSquare(boxes,containers[i]);
			}
		}
	}
	this.RenderSquare = api;
})();