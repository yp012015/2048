//棋盘
var board = new Array();
//标记单元格是否合并过
var hasConficted = new Array();
//分数
var score = 0;
//记录手指滑动的起始横纵坐标
var startX=0,startY=0,endX=0,endY=0;
$(document).keydown(function (event) {
	switch (event.keyCode){
		case 37://left
			//阻止键盘原有的功能
			event.preventDefault();
			if(moveLeft()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
			break;
		case 38://up
			//阻止键盘原有的功能
			event.preventDefault();
			if(moveUp()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
			break;
		case 39://right
			//阻止键盘原有的功能
			event.preventDefault();
			if(moveRight()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
			break;
		case 40://down
			//阻止键盘原有的功能
			event.preventDefault();
			if(moveDown()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
			break;
		default:
			break;
	}
})
/*手指开始触摸屏幕*/
document.addEventListener("touchstart",function (event) {
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});
/*手指离开屏幕*/
document.addEventListener("touchend",function (event) {
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;
	//计划手指滑动的X轴、Y轴距离
	var deltaX = endX - startX;
	var deltaY = endY - startY;
	//如果用户只是点击屏幕，那么不再往下执行代码
	if(Math.abs(deltaX)<screenWidth*0.2 && Math.abs(deltaY)<screenWidth*0.2)
		return;
	//X轴移动
	if(Math.abs(deltaX) > Math.abs(deltaY)){
		//right
		if(deltaX > 0){
			if(moveRight()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
		}
		//left
		else{
			if(moveLeft()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
		}
	}
	//Y轴移动
	else{
		//down
		if (deltaY > 0) {
			if(moveDown()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
		} 
		//up
		else{
			if(moveUp()){
				setTimeout("randomOneNum()",50);
				setTimeout("isGameOver()",70);
			}
		}
	}
});
/*判断游戏是否已经结束了*/
function isGameOver () {
	if(hasSpace(board) || canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board))
		return false;
	$('h1').text("游戏结束");
	$('h1').attr('font-size','50px');
	$('.div-game-over').show();
	showGameOver();
	return true;
}
function showGameOver () {
	if($('.div-game-over').is(':visible'))
		$('h1').fadeToggle(500,function () {
			showGameOver();
		})
	else {
		$('h1').show();
		return;
	}
}
/*格子向左移动*/
function moveLeft () {
	if(!canMoveLeft(board)) return false;
	//moveLeft
	for(var i=0; i<4; i++)
		for (var j=1; j<4; j++) {
			if(board[i][j] != 0 ){
				for (var k = 0; k < j; k++) {
					//1.如果左侧有空格子，且水平方向上没有障碍物
					if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j]=0;
						continue;
					}
					//2.如果左侧有格子和自己的数值相等，且水平方向没有障碍物
					else if (board[i][k]== board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConficted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add将两个格子的数字相加
						board[i][k] += board[i][j];
						board[i][j]=0;
						score += board[i][k];
						updateScore(score);
						hasConficted[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",50);
	return true;
}
/*格子向上移动*/
function moveUp () {
	if(!canMoveUp(board)) return false;
	//moveUp
	for(var col=0; col<4; col++)
		for(var row=1; row<4; row++){
			if(board[row][col] !=0){//格子不为空
				//垂直方向上进行遍历
				for(var rowsub=0; rowsub<row; rowsub++){
					//1.如果上方有空格子，且垂直方向上没有障碍物
					if(board[rowsub][col] == 0 && noBlockVertical(col,row,rowsub,board)){
						//move
						showMoveAnimation(row,col,rowsub,col);
						board[rowsub][col] = board[row][col];
						board[row][col] = 0;
						continue;
					}
					//2.如果上方有格子和自己的数值相等，且垂直方向上没有障碍物
					else if(board[rowsub][col]==board[row][col] && noBlockVertical(col,row,rowsub,board) && !hasConficted[rowsub][col]){
						//move
						showMoveAnimation(row,col,rowsub,col);
						board[rowsub][col] += board[row][col];
						board[row][col] = 0;
						score += board[rowsub][col];
						updateScore(score);
						hasConficted[rowsub][col] = true;
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",50);
	return true;
}
/*格子向右移动*/
function moveRight () {
	if(!canMoveRight(board)) return false;
	for (var row=0; row<4; row++) {
		for (var col=2; col>=0; col--) {
			for (var colsub=3; colsub>col; colsub--) {
				//1.如果右侧有空格子，且水平方向上没有障碍物
				if (board[row][colsub]==0 && noBlockHorizontal(row,colsub,col,board)) {
					//move
					showMoveAnimation(row,col,row,colsub);
					board[row][colsub] = board[row][col];
					board[row][col] = 0;
					continue;
				} 
				//2.如果右侧格子的数字和自己相等，且水平方向上没有障碍物
				else if(board[row][colsub]==board[row][col] &&  noBlockHorizontal(row,colsub,col,board) && !hasConficted[row][colsub]){
					//move
					showMoveAnimation(row,col,row,colsub);
					board[row][colsub] += board[row][col];
					board[row][col] = 0;
					score += board[row][colsub];
					updateScore(score);
					hasConficted[row][colsub] = true;
					continue;
				}
			}
		}
	}
	setTimeout("updateBoardView()",50);
	return true;
}
/*格子向下移动*/
function moveDown () {
	if(!canMoveDown(board)) return false;
	for(var col=0; col<4; col++)
		for (var row=2; row>=0; row--) {
			for (var rowsub=3; rowsub>row; rowsub--) {
				//1.如果下方格子为空，且垂直方向上没有障碍物
				if(board[rowsub][col]==0 && noBlockVertical(col,rowsub,row,board)){
					showMoveAnimation(row,col,rowsub,col);
					board[rowsub][col] = board[row][col];
					board[row][col] = 0;
					continue;
				}
				//2.如果下方格子的数字和自身相等，且垂直方向上没有障碍物
				else if (board[rowsub][col]==board[row][col] && noBlockVertical(col,rowsub,row,board) && !hasConficted[rowsub][col]) {
					showMoveAnimation(row,col,rowsub,col);
					board[rowsub][col] += board[row][col];
					board[row][col] = 0;
					score += board[rowsub][col];
					updateScore(score);
					hasConficted[rowsub][col] = true;
					continue;
				}
			}
		}
	setTimeout("updateBoardView()",50);
	return true;
}