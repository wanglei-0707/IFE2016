//瀑布流相册
function WaterFall(opts){
	this.col = opts.col || 4;
	this.gap = opts.gap || 16;
	this.container = $(opts.containerId);
	this.boxClsName = opts.boxClsName;
	this.boxes = $(this.boxClsName);
	this.boxWidth;
	this.imgWidth;
	this.heightArr = [];
	this.colContral = opts.colInput;
	this.gapContral = opts.gapInput;
	this.addContral = opts.addBtn;
	this.setImgWidth();
	this.render();
	this.clickEvent();
}

WaterFall.prototype = {
	//设置图片宽度
	setImgWidth: function(){
		var screenWidth = $(window).width();
		this.boxWidth = Math.floor(0.9 * screenWidth / this.col);
		this.imgWidth = this.boxWidth - this.gap - 2;
		this.container.css({
			width:this.col * this.boxWidth,
			margin: "0 auto"
		});
	},
	//渲染瀑布流图片
	render: function(){
		this.boxes = $(this.boxClsName);
		for(var i=0,len=this.boxes.size();i<len;i++){
			var $currentBox = $(this.boxes[i]);
			var img = $currentBox.find("img");
			img.css("width",this.imgWidth);
			$currentBox.find("div.imageInfo").css("width",this.imgWidth);
			$currentBox.css("padding","0 0 "+this.gap+"px "+this.gap+"px");
			var boxHeight = $currentBox.innerHeight();
			if(i<this.col){
				$currentBox.css("position","static");
				this.heightArr[i] = boxHeight;
			}else{
				var min = this.getMin();
				$currentBox.css({
					position:"absolute",
					left:min.index * this.boxWidth,
					top:min.height
				});
				this.heightArr[min.index] += $currentBox.innerHeight();
			}
		}
	},
	//获取高度数组中最小的高度和索引
	getMin:function(){
		var minH = this.heightArr[0];
		var index = 0;
		for(var i=1,len=this.heightArr.length;i<len;i++){
			if(this.heightArr[i] < minH){
				minH = this.heightArr[i];
				index = i;
			}
		}
		return {height:minH,index:index};
	},
	//添加点击事件
	clickEvent:function(){
		var self = this;
		//添加图片点击事件
		$(self.container).delegate("img","click",function(e){
			//阻止事件冒泡
			e.stopPropagation();
			var infoObj = {
					src:$(this).attr("data-source"),
					index:$(this).attr("data-index"),
					caption:$(this).attr("data-caption"),
					time:$(this).attr("data-time"),
					totalImage:self.container.find("img")
			};
			self.imgFullScreen(infoObj);
		});
		//添加列数输入框失去焦点事件，修改列数
		self.colContral.blur(function(){
			var col = this.value.trim();
			var reg = /^[3-8]{1}$/;
			if(reg.test(col)){
				self.changeAttr(true,col);
			}else{
				alert("请输入适当的数字");
			}
		});
		//添加列间隙输入框失去焦点事件，修改列间隙
		self.gapContral.blur(function(){
			var gap = this.value.trim();
			if(gap>=10 && gap<=100){
				self.changeAttr(false,gap);
			}else{
				alert("请输入适当的数字");
			}
		});
		//添加屏幕滚动条滚动事件，加载新图片
		$(window).scroll(function(){
			if(checkScrollSlide()){
				for(var i=1;i<=25;i++){
					var box = $('<div class="box">');
					box.css("padding","0 0 "+self.gap+"px "+self.gap+"px");
					$(self.container).append(box);
					var pic = $('<div class="pic">');
					box.append(pic);

					img = $('<img alt="image" src="image/wn'+i+'.jpg" data-source="image/wn'+i+'.jpg" data-index="'+(i-1)+'" data-caption="khuntoria" data-time="2010.6.1">');

					img.css({
						width:self.imgWidth
					});

					var imgContent = $('<div class="imageInfo">');
					imgContent.html("<h4>khuntoria</h4><time>2010.6.1</time>");
					pic.append(img,imgContent);

					var min = self.getMin();
					box.css({
						position:"absolute",
						left:min.index * self.boxWidth,
						top:min.height
					});
					self.heightArr[min.index] += box.innerHeight();
				}
			}
		});
		//当最后一张照片露出一半时放回true，否则放回false
		function checkScrollSlide(){
			self.boxes = $(self.boxClsName);
			var lastBox = self.boxes[self.boxes.length-1];
			var lastBoxHeight = $(lastBox).offset().top + Math.floor(lastBox.offsetHeight/2);
			var scrollTop = $(window).scrollTop();
			var screenHeight = $(window).height();
			return lastBoxHeight < (scrollTop + screenHeight);
		}
	},
	//改变列数或列间隙
	changeAttr:function(isCol,val){
		if(isCol){
			this.col = val;
		}else{
			this.gap = val;
		}
		this.heightArr = [];
		this.setImgWidth();
		this.render();
	},
	imgFullScreen:function(infoObj){
		var lightbox = new LightBox(infoObj);
	}
};
