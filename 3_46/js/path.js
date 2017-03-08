var COST_STRAIGHT = 10;  //垂直方向或水平方向移动的路径评分
var COST_DIAGONAL = 14;  //斜方向移动的路径评分


function Node(x,y,parNode){
	this.x = x;
	this.y = y;
	this.parNode = parNode;
	this.isWall = false;
	this.g;   //当前节点到起点的移动耗费
	this.h;   //当前节点到终点的移动耗费，即曼哈顿距离|x1-x2|+|y1-y2|(忽略障碍物)
	this.f;   //f = g + h
}


function Astar(row,col){
	this.row = row;
	this.col = col;
	this.openList = [];
	this.closeList = [];
}

//查找坐标，终点是墙返回-1  没找到返回0   找到了返回路径
Astar.prototype.searchPos = function(x1,y1,x2,y2){
	if(wallArr[y2/WALL_WIDTH][x2/WALL_WIDTH].isWall)
		return -1;
	var sNode = wallArr[y1/WALL_WIDTH][x1/WALL_WIDTH];
	sNode.g = 0;
	var eNode = wallArr[y2/WALL_WIDTH][x2/WALL_WIDTH];
	this.openList.push(sNode); //将起点压入开始列表
	var resultList = this.searchPath(sNode,eNode);
	if(resultList.length == 0)
		return 0;
	return resultList;
}

Astar.prototype.searchPath = function(sNode,eNode){
	var resultList = [];
	var isFind = false;
	var node = null;
	while(this.openList.length > 0){
		//取出开启列表中最低F值，即第一个存储的值的F为最低的
		node = this.openList.shift();  
		//判断是否找到目标点
		if(node.x == eNode.x && node.y == eNode.y){
			isFind = true;
			break;
		}
		var topWall = false,rigWall = false,botWall = false,lefWall = false;
		//上
		if(node.y-WALL_WIDTH >= 0)
			topWall = this.checkPath(node.x,node.y-WALL_WIDTH,node,eNode,COST_STRAIGHT);
		//下
		if(node.y+WALL_WIDTH <= WALL_WIDTH*(this.row-1))
			botWall = this.checkPath(node.x,node.y+WALL_WIDTH,node,eNode,COST_STRAIGHT);
		//左
		if(node.x-WALL_WIDTH >= 0)
			lefWall = this.checkPath(node.x-WALL_WIDTH,node.y,node,eNode,COST_STRAIGHT);
		//右
		if(node.x+WALL_WIDTH <= WALL_WIDTH*(this.col-1))
			rigWall = this.checkPath(node.x+WALL_WIDTH,node.y,node,eNode,COST_STRAIGHT);
		//左上
		if(topWall!=-1 && lefWall!=-1)
			if(node.x-WALL_WIDTH >= 0 && node.y-WALL_WIDTH >= 0)
				this.checkPath(node.x-WALL_WIDTH,node.y-WALL_WIDTH,node,eNode,COST_DIAGONAL);
		//左下
		if(botWall!=-1 && lefWall!=-1)
			if(node.x-WALL_WIDTH >= 0 && node.y+WALL_WIDTH <= WALL_WIDTH*(this.row-1))
				this.checkPath(node.x-WALL_WIDTH,node.y+WALL_WIDTH,node,eNode,COST_DIAGONAL);
		//右上
		if(topWall!=-1 && rigWall!=-1)
			if(node.x+WALL_WIDTH <= WALL_WIDTH*(this.col-1) && node.y-WALL_WIDTH >= 0)
				this.checkPath(node.x+WALL_WIDTH,node.y-WALL_WIDTH,node,eNode,COST_DIAGONAL);
		//右下
		if(botWall!=-1 && lefWall!=-1)
			if(node.x+WALL_WIDTH <= WALL_WIDTH*(this.col-1) && node.y+WALL_WIDTH <= WALL_WIDTH*(this.row-1))
				this.checkPath(node.x+WALL_WIDTH,node.y+WALL_WIDTH,node,eNode,COST_DIAGONAL);
		//添加到关闭列表中
		this.closeList.push(node);
		//开始列表中排序，把F值最低的放到最低端
		this.openList.sort(function(a,b){
			return a.f - b.f;
		});
	}
	if(isFind)
		this.getPath(resultList,node);
	return resultList;
}

Astar.prototype.checkPath = function(x,y,parNode,eNode,cost){
	var node = wallArr[y/WALL_WIDTH][x/WALL_WIDTH];
	//查找地图中是否能通过
	if(node.isWall){
		this.closeList.push(node);
		return -1;
	}
	//查找关闭列表中是否存在
	if(this.isListContains(this.closeList,node.x,node.y) != -1){
		return false;
	}
	//查找开启列表中是否存在
	var index = this.isListContains(this.openList,node.x,node.y);
	if(index != -1){
		//G值是否更小，即是否更新G,F值
		if(parNode.g+cost < this.openList[index].g){
			node.parNode = parNode;
			this.countG(node,eNode,cost);
			this.countF(node);
			this.openList[index] = node;
		}
	}else{
		//添加到开启列表中
		node.parNode = parNode;
		this.count(node,eNode,cost);
		this.openList.push(node);
	}
	return true;
}

//集合中是否包含元素（-1：没有找到，否则返回所在的索引）
Astar.prototype.isListContains = function(list,x,y){
	for(var i=0,len=list.length;i<len;i++){
		if(list[i].x == x && list[i].y == y)
			return i;
	}
	return -1;
}

//从终点往返回到起点
Astar.prototype.getPath = function(resultList,node){
	if(node.parNode != null){
		this.getPath(resultList,node.parNode);
	}
	resultList.push(node);
}

//计算G，H，F值
Astar.prototype.count = function(node,eNode,cost){
	this.countG(node,eNode,cost);
	this.countH(node,eNode);
	this.countF(node);
}

//计算G值
Astar.prototype.countG = function(node,eNode,cost){
	if(node.parNode == null)
		node.g = cost;
	else
		node.g = node.parNode.g + cost;
}

//计算H值
Astar.prototype.countH = function(node,eNode){
	node.h = (Math.abs(node.x - eNode.x)/WALL_WIDTH + Math.abs(node.y - eNode.y)/WALL_WIDTH) * 10;
}

//计算F值
Astar.prototype.countF = function(node){
	node.f = node.g + node.h;
}

