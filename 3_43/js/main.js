function renderImage(){
	var html = "";
	var body = document.getElementsByTagName("body")[0];
	for(var i=1;i<=6;i++){
		html += '<div class="album album-' + i + '">';
		for(var j=1;j<=i;j++){
			html += '<div class="image"><img src="image/wn' + j 
			+ '.jpg"><div class="titleDiv"><h3>pictrue</h3><time>2010-6-1</time></div></div>'; 
		}
		html += '</div>';
	}
	body.innerHTML = html;
}

renderImage();
RenderSquare.listen();