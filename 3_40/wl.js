var monthArry = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

function addTdClickEvent(ele,type,tag,handler){
    addEvent(ele,type,function(event){
        evevt = event || window.event;
        var target = event.target || event.srcElement;
        if(target && target.tagName == tag.toUpperCase())
            handler.call(target,calendarObj);
    });
}

function calendar(modal,beginYear,endYear,year,month,day){
    this.modal = modal;
    this.beginYear = beginYear;
    this.endYear = endYear;
    this.year = year;
    this.month = month-1;
    this.day = day;
    this.isShow = false;
    this.isSpecificDay = true;
    this.showDate(this.formatDate(year,month,day));
}

calendar.prototype.isSpecificDayFun = function(){
    this.isSpecificDay = $("specificDay").checked ? true : false;
}

calendar.prototype.hide = function(){
    this.modal.style.display = "none";
    this.isShow = false;
}

calendar.prototype.show = function(){
    this.modal.style.display = "block";
    this.isShow = true;
}

calendar.prototype.render = function(){
    $("year").value = this.year;
    $("month").value = monthArry[this.month]; 
    var firstDay = new Date(this.formatDate(this.year,this.month+1,1));
    var trs = document.getElementsByTagName("tr");
    var j = 1;  //记录日期
    firstDay.setMonth(firstDay.getMonth(), 0);  //设置成上个月最后一天
    var lmld = firstDay.getDate();  //获取上个月最后一天
    firstDay.setMonth(firstDay.getMonth()+1, 1);  //设置成本月第一天
    for(var i=firstDay.getDay()-1;i>=0;i--,lmld--){  //渲染1号之前的几天
        trs[1].cells[i].innerHTML = lmld;
        trs[1].cells[i].style.color = "#dcdcdc";
        trs[1].cells[i].style.background = "#fff";
    }
    for(var i=firstDay.getDay();i<7;i++,j++){  //渲染本月第一周
        trs[1].cells[i].innerHTML = j;
        if(j==this.day){
            trs[1].cells[i].style.color = "#fff";
            trs[1].cells[i].style.background = "red";
        }else{
            trs[1].cells[i].style.color = "#000";
            trs[1].cells[i].style.background = "#fff";
        }
    }
    firstDay.setMonth(firstDay.getMonth()+1,0);  //设置成本月最后一天
    var sumDays = firstDay.getDate();     //获取本月的天数
    var k,p;  //k记录周数，p记录下个月的日期
    for(k=2;j<=sumDays;k++){     //渲染本月剩余的天数
        var i;
        for(i=0;i<7 && j<=sumDays;i++,j++){
            trs[k].cells[i].innerHTML = j;
            if(j==this.day){
                trs[k].cells[i].style.color = "#fff";
                trs[k].cells[i].style.background = "red";
            }else{
                trs[k].cells[i].style.color = "#000";
                trs[k].cells[i].style.background = "#fff";
            }
        }
        if(j>sumDays){    //渲染本月最后一周不足的几天
            for(p=1;i<7;i++,p++){
                trs[k].cells[i].innerHTML = p;
                trs[k].cells[i].style.color = "#dcdcdc";
                trs[k].cells[i].style.background = "#fff";
            }
        }
    }
    if(k == 6){   //渲染本月不足的一周
        for(var i=0;i<7;i++,p++){
            trs[k].cells[i].innerHTML = p;
            trs[k].cells[i].style.color = "#dcdcdc";
            trs[k].cells[i].style.background = "#fff";
        }
    }
}

calendar.prototype.formatDate = function(year,month,day){
    month = month < 10 ? "0" + month : month;
    day = day <10 ? "0" + day : day;
    return year + "/" + month + "/" + day;
}

calendar.prototype.monthUp = function(){
    if(this.month==11 && this.isYearInScope(this.year+1)){
        this.month = 0;
        this.year += 1;
        this.render(this.year,this.month);
    }else if(this.month<11){
        this.month += 1;
        this.render(this.year,this.month);
    }else{
        alert("已达到年份上限！");
    }
}

calendar.prototype.monthDown = function(){
    if(this.month==0 && this.isYearInScope(this.year-1)){
        this.month = 11;
        this.year -= 1;
        this.render(this.year,this.month);
    }else if(this.month>0){
        this.month -= 1;
        this.render(this.year,this.month);
    }else{
        alert("已达到年份下限！");
    }
}

calendar.prototype.yearUp = function(){
    if(this.isYearInScope(this.year+1)){
        this.year += 1;
        this.render(this.year,this.month);
    }
    else{
        alert("已达到年份上限！");
    }
}

calendar.prototype.yearDown = function(){
    if(this.isYearInScope(this.year-1)){
        this.year -= 1;
        this.render(this.year,this.month);
    }
    else{
        alert("已达到年份下限！");
    }
}

calendar.prototype.isYearInScope = function(year){
    if(year >= this.beginYear && year <= this.endYear)
        return true;
    return false;
}

calendar.prototype.getChoicePeriod = function(){
    
}

calendar.prototype.getChoiceDate = function(calendar){
    if($("selected")){
        $("selected").style.background = "#fff";
        $("selected").removeAttribute("id");
    }
    if(this.style.color == "rgb(220, 220, 220)")
        return false;
    this.setAttribute("id","selected");
    this.style.background = "#dcdcdc";
    month += 1;
    var choiceDate = calendar.formatDate(calendar.year,calendar.month+1,this.innerHTML);
    calendar.showDate(choiceDate);
}

calendar.prototype.showDate = function(choiceDate){
    $("showDate").value = choiceDate;
    this.hide();
}

function createTbody(tbody){
    for(var i=0;i<6;i++){
        var tr = document.createElement("tr");
        var html = "";
        for(var j=0;j<7;j++){
            html += "<td></td>";
        }
        tr.innerHTML = html;
        tbody.appendChild(tr);
    }
}

var calendarObj = new calendar($("calendar"),2014,2017,2016,5,7);

function init(){
    var tbody = $("tbody");
    createTbody(tbody);
    calendarObj.render();
    addEvent($("plus"),"click",function(){
        calendarObj.monthUp();
    });
    addEvent($("minus"),"click",function(){
        calendarObj.monthDown();
    });
    addEvent($("monthUp"),"click",function(){
        calendarObj.monthUp();
    });
    addEvent($("monthDown"),"click",function(){
        calendarObj.monthDown();
    });
    addEvent($("yearUp"),"click",function(){
        calendarObj.yearUp()
    });
    addEvent($("yearDown"),"click",function(){
        calendarObj.yearDown();
    });
    addTdClickEvent(tbody,"click","td",calendarObj.getChoiceDate);
    addEvent($("showDate"),"click",function(){
        if(calendarObj.isShow)
            calendarObj.hide();
        else
            calendarObj.show();
    });
    addEvent($("calendarIcon"),"click",function(){
        if(calendarObj.isShow)
            calendarObj.hide();
        else
            calendarObj.show();
    });
    var radios = document.getElementsByName("choiceMethod");
    for(var i=0;i<radios.length;i++){
        addEvent(radios[i],"change",function(){
            calendarObj.isSpecificDayFun();
        });
    }
}

init();