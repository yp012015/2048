function getTopPosition(i) {
	return cellSpace*(i+1) + cellSideLength*i;
}
function getLeftPosition(j) {
	return cellSpace*(j+1) + cellSideLength*j;
}
function getNumBackgroundColor (num) {
	switch (num){
		case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
		default:
			return 'black'; break;
	}
}
function getNumColor (num) {
	if (num<=4) {
		return '#776e65';
	} else {
		return 'white';
	}
}

/*判断棋盘里面是否还有空的格子*/
function hasSpace (board) {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if(board[i][j] == 0) return true;
		}
	}
	return false;
}
/*棋盘上显示随机生成的数字*/
function showNumWithAnimation(x,y,randNum){
	var numberCell = $('#number-cell-' + x + '-' + y);
	numberCell.css({
		'background-color':getNumBackgroundColor(randNum),
		'color':getNumColor(randNum)
	});
	numberCell.text(randNum);
	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getTopPosition(x),
		left:getLeftPosition(y)
	},50);
}
/*格子移动的动画*/
function showMoveAnimation (startX,startY,endX,endY) {
	var girdCell = $('#number-cell-' + startX + '-' + startY);
	girdCell.animate(
		{top:getTopPosition(endX),
		left:getLeftPosition(endY)},
	50);
}

/*更新游戏得分*/
function updateScore (score) {
	$('#score').text(score);
}
