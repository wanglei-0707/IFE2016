;(function(){
	var LightBox = function(infoObj){
		this.infoObj = {
			speed : 500,
			maxWidth : 0.9,
			maxHeight :0.9
		};
		$.extend(this.infoObj,infoObj || {});
		this.popupMask = $('<div id="G-lightbox-mask">');
		this.popupWin = $('<div id="G-lightbox-popup">');
		this.bodyNode = $(document.body);

		this.createMaskAndPopup();

		this.picViewArea = this.popupWin.find("div.lightbox-pic-view"); //图片预览区域
		this.popupPic = this.popupWin.find("img.lightbox-image"); //图片
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption"); //图片描述区域
		this.prevBtn = this.popupWin.find("span.light-prev-btn");
		this.nextBtn = this.popupWin.find("span.light-next-btn");
		this.captionText = this.popupWin.find("p.lightbox-pic-desc"); //图片描述
		this.imageTime = this.popupWin.find("span.lightbox-pic-time"); //图片当前索引
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn"); //关闭按钮

		this.showMaskAndPopup();
		this.clickEvent();
	}

	LightBox.prototype = {
		createMaskAndPopup:function(){
			var html = '<div class="lightbox-pic-view">' +
							    '<span class="lightbox-btn light-prev-btn"></span>' +
							    '<img class="lightbox-image" src="" alt="">' +
							    '<span class="lightbox-btn light-next-btn"></span>' +
						     '</div>' +
						     '<div class="lightbox-pic-caption">' +
							    '<div class="lightbox-caption-area">' +
								   '<p class="lightbox-pic-desc"></p>' +
								   '<span class="lightbox-pic-time"></span>' +
							    '</div>' +
							    '<span class="lightbox-close-btn"></span>' +
						     '</div>';
			this.popupWin.html(html);
			this.bodyNode.append(this.popupMask,this.popupWin);
		},
		showMaskAndPopup:function(){
			var self = this;
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});
			var viewWidth = winWidth/2+10;
			var viewHeight = winHeight/2+10;
			this.popupWin.fadeIn();
			this.popupWin.css({
				width:viewWidth,
				height:viewHeight,
				marginLeft:-viewWidth/2,
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
			},self.infoObj.speed,function(){
				self.loadPic(self.infoObj.src);
			});
			var imagesLength = this.infoObj.totalImage.length;
			var index = this.infoObj.index;
			if(imagesLength > 1){
				if(index == 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(index == imagesLength-1){
					this.prevBtn.removeClass("disabled");
					this.nextBtn.addClass("disabled");
				}else{
					this.prevBtn.removeClass("disabled");
					this.nextBtn.removeClass("disabled");
				}
			}
		},
		loadPic:function(src){
			var self = this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			self.picCaptionArea.hide();
			this.preLoadImg(src,function(){
				self.popupPic.attr("src",src);
				var picWidth = self.popupPic.width();
				var picHeight = self.popupPic.height();
				self.changePic(picWidth,picHeight);
			});
		},
		preLoadImg:function(src,callBack){
			var img = new Image();
			if(!!window.ActiveXObject){  //判断是否是IE浏览器
				img.onreadystatechange = function(){
					if(this.readyState == "complete"){
						callBack();
					}
				};
			}else{
				img.onload = function(){
					callBack();
				};
			}
			img.src = src;
		},
		changePic:function(width,height){
			var self = this;
			var winWidth = $(window).width() * this.infoObj.maxWidth;
			var winHeight = $(window).height() * this.infoObj.maxHeight;
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width *= scale;
			height *= scale;
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			},self.infoObj.speed);
			this.popupWin.animate({
				width:width,
				height:height,
				marginLeft:-(width/2),
				top:(winHeight/self.infoObj.maxHeight - height)/2
			},self.infoObj.speed,function(){
				self.popupPic.css({
					width:width-10,
					height:height-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
			});
			this.captionText.text(this.infoObj.caption);
			this.imageTime.text(this.infoObj.time);
		},
		clickEvent:function(){
			var self = this;
			this.popupMask.click(function(){
				self.removeMaskAndPopup();
			});
			this.closeBtn.click(function(){
				self.removeMaskAndPopup();
			});

			this.flag = true;//给按钮加锁，防止连续点击
			var len = self.infoObj.totalImage.length;
			this.prevBtn.hover(function(){
				if(!$(this).hasClass("disabled") && len>1){
					$(this).addClass("light-prev-btn-show");
				}
			},function(){
				if(!$(this).hasClass("disabled") && len>1){
					$(this).removeClass("light-prev-btn-show");
				}
			}).click(function(e){
				self.btnClick(e,$(this),"prev");
			});
			this.nextBtn.hover(function(){
				if(!$(this).hasClass("disabled") && len>1){
					$(this).addClass("light-next-btn-show");
				}
			},function(){
				if(!$(this).hasClass("disabled") && len>1){
					$(this).removeClass("light-next-btn-show");
				}
			}).click(function(e){
				self.btnClick(e,$(this),"next");
			});
		},
		removeMaskAndPopup:function(){
			this.popupMask.fadeOut();
			this.popupWin.fadeOut();
			this.popupMask.remove();
			this.popupWin.remove();
		},
		btnClick:function(e,btn,dir){
			if(!btn.hasClass("disabled") && this.infoObj.totalImage.length>1 && this.flag){
				this.flag = false;
				e.stopPropagation();
				this.goTo(dir);
			}
		},
		goTo:function(dir){
			var len = this.infoObj.totalImage.length;
			if(dir === "prev"){
				this.infoObj.index--;
				if(this.infoObj.index <= 0){
					this.prevBtn.addClass("disabled").removeClass("light-prev-btn-show");
				}
				if(this.infoObj.index != len-1){
					this.nextBtn.removeClass("disabled");
				}
			}else if(dir === "next"){
				this.infoObj.index++;
				if(this.infoObj.index >= len-1){
					this.nextBtn.addClass("disabled").removeClass("light-next-btn-show");
				}
				if(this.infoObj.index != 0){
					this.prevBtn.removeClass("disabled");
				}
			}
			var src = this.infoObj.totalImage[this.infoObj.index].src;
			this.loadPic(src);
		},
	};
	window["LightBox"] = LightBox;
})();