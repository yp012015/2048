//获取屏幕高度
screenWidth = window.screen.availWidth;
//棋盘宽度
containerWidth = 0.92*screenWidth;
//每个格子的边长
cellSideLength = 0.18*screenWidth;
//单元格间距
cellSpace = 0.04*screenWidth;

$(document).ready(function () {
	prepareForMobile();
	newGame();
})
function prepareForMobile () {
	if(!browser.versions.mobile && containerWidth>500){
		containerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}
	$('.gird-container').css({
		'width':containerWidth-2*cellSpace,
		'height':containerWidth - 2*cellSpace,
		'padding': cellSpace,
		'border-radius':0.02*containerWidth
	});
	$(".gird-cell").css({
		'width' : cellSideLength,
		'height' : cellSideLength,
		'border-radius' : 0.02*cellSideLength
	});
}
/*开始新游戏*/
function newGame() {
	//1.初始化棋盘
	initBoard();
	//2.随机在两个格子中生成数字
	randomOneNum();
	randomOneNum();
}
/*初始化棋盘*/
function initBoard() {
	$('.div-game-over').hide();
	$('h1').stop(true,true);//停止动画
	$('h1').attr('font-size','40px');
	$('h1').text("2048");
	for(var i=0; i<4; i++){
		board[i] = new Array();
		hasConficted[i] = new Array();
		var count=0;
		for (var j=0; j<4; j++) {
			board[i][j] = 0;
			hasConficted[i][j] = false;
			//获取棋盘的每个格子
			var girdCell = $("#gird-cell-" + i + "-" + j);
			//设置顶部位置、左边位置
			girdCell.css({'top':getTopPosition(i),'left':getLeftPosition(j)});
		}
	}
	updateBoardView();
	//分数清零
	score = 0;
}
/*更新棋盘数据*/
function updateBoardView () {
	$(".number-cell").remove();
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			var innerHtml = "<div class='number-cell' id='number-cell-"+i+'-'+j +"'></div>";
			$('.gird-container').append(innerHtml);
			var numberCell = $('#number-cell-' + i + '-' +j);
			if (board[i][j] == 0) {
				numberCell.css({
					'width':'0' ,'height':'0',
					'top':getTopPosition(i)+0.5*cellSideLength,'left':getLeftPosition(j)+0.5*cellSideLength
				});
			} else{
				numberCell.css({
					'width':cellSideLength ,'height':cellSideLength,
					'top':getTopPosition(i),'left':getLeftPosition(j),
					'background-color':getNumBackgroundColor(board[i][j]),
					'color':getNumColor(board[i][j])
				});
				numberCell.text(board[i][j]);
			}
			hasConficted[i][j] = false;
		}
	}
	$('.number-cell').css({
		'line-height':cellSideLength + 'px',
		'font-size' : 0.6*cellSideLength + 'px',
		'border-radius' : 0.02*cellSideLength
	})
}
/*随机在两个格子中生成数字*/
function randomOneNum () {
	if(hasSpace(board)) {
		//随机生成一个坐标(横纵坐标值0~3)
		var x = parseInt(Math.floor(Math.random()*4));
		var y = parseInt(Math.floor(Math.random()*4));
		//随机生成一个数（2，4）
		var randNum = Math.random() <0.5? 2 : 4;
		//在格子中显示随机数
		var times = 0;
		while (times++ <50){
			//如果该格子是空的
			if(board[x][y] == 0){
				board[x][y] = randNum;
				showNumWithAnimation(x,y,randNum);
				break;
			}
			//否则继续生成随机坐标
			x = parseInt(Math.floor(Math.random()*4));
			y = parseInt(Math.floor(Math.random()*4));
		}
		if(times >= 50){
			for(var i=0; i<4; i++)
				for(var j=0; j<4; j++)
					if(board[i][j] == 0){
						board[i][j] = randNum;
						showNumWithAnimation(i,j,randNum);
					}
		}
		return true;
	}else return false;
}
/*判断格子能否向左移动*/
function canMoveLeft (board) {
	for (var i=0; i<4; i++) {
		for(var j=1; j<4; j++)
			//1.左侧格子为空，2.左侧格子的数字等于自己。两种情况都可以移动
			if(board[i][j-1]==0 || board[i][j]==board[i][j-1])
				return true;
	}
	return false;
}
/*判断格子能否向上移动*/
function canMoveUp (board) {
	for(var i=0; i<4; i++)
		for(var j=1; j<4; j++)
			//1.上方格子为空，2.上方格子的数字等于自己。两种情况都可以移动
			if(board[j-1][i]==0 || board[j][i]==board[j-1][i])
				return true;
	return false;
}
/*判断格子能否向右移动*/
function canMoveRight (board) {
	for(var row=0; row<4; row++)
		for(var col=2; col>=0; col--)
			//1.右侧格子为空，2.右侧格子的数字等于自己。两种情况都可以移动
			if(board[row][col+1]==0 || board[row][col+1]==board[row][col])
				return true;
	return false;
}
/*判断格子能否向下移动*/
function canMoveDown (board) {
	for(var col=0; col<4; col++)
		for(var row=2; row>=0; row--)
			//1.下方格子为空，2.下方格子的数字等于自己。两种情况都可以移动
			if(board[row+1][col]==0 || board[row+1][col]==board[row][col])
				return true;
	return false;
}
/**
 * 判断两个格子的水平方向上中间是否有障碍物
 * @param {Object} row		行号
 * @param {Object} endCol	终止列号
 * @param {Object} startCol	起始列号
 * @param {Object} board	棋盘
 */
function noBlockHorizontal (row,endCol,startCol,board) {
	for(var col=startCol+1; col<endCol; col++){
		//如果水平方向上中间的任意一个格子不为空，都不能移动
		if(board[row][col] !=0 ) return false;
	}
	return true;
}
/**
 * 判断两个格子在垂直方向上是否有障碍物
 * @param {Object} col		列号
 * @param {Object} endRow 	终止行号
 * @param {Object} startRow	起始行号
 * @param {Object} board	棋盘
 */
function noBlockVertical (col,endRow,startRow,board) {
	for(var row=startRow+1; row<endRow; row++)
		//如果垂直方向上中间的任意一个格子不为空，都不能移动
		if(board[row][col] !=0 ) return false;
	return true;
}