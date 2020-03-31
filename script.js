const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

//creating the user
const user = {
	x : 0,
	y : canvas.height/2 - 50,
	width : 10,
	height : 100,
	color : "WHITE", 
	score : 0
};

//creating the computer
const com = {
	x : canvas.width - 10, 
	y : canvas.height/2 - 50,
	width : 10,
	height : 100, 
	color : "WHITE", 
	score : 0
};

//creating the ball

const ball = {
	x : canvas.width / 2, 
	y : canvas.height / 2,
	radius : 10, 
	speed : 5, 
	velocityX : 5, 
	velocityY : 5, 
	color : "WHITE"
};

//draw rect function 
function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}


// create the net
const net = {
	x : canvas.width / 2 - 1,
	y : 0,
	width : 2,
	height : 10, 
	color : "WHITE"
};

//draw net
function drawNet() {
	for(let i = 0; i <= canvas.height; i += 15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

function drawCircle(x, y, r, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
}

function drawText(text, x, y, color) {
	ctx.fillStyle = color;
	ctx.font = "45px fantasy";
	ctx.fillText(text, x, y);
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

//render the game
function render() {
	// clear the canvas
	drawRect(0, 0, canvas.width, canvas.height, "#0077be");

	//draw the net
	drawNet();

	// draw the score
	drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
	drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");

	// draw the user and computer paddle
	drawRect(user.x, user.y, user.width, user.height, "WHITE");
	drawRect(com.x, com.y, com.width, user.height, "WHITE");

	// draw the ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control the user paddle
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(evt) {
	let rect = canvas.getBoundingClientRect();
	user.y = evt.clientY - rect.top - user.height / 2;
}

// collision detection
function collision(b, p) {
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//update: pos, mov, score...
function update() {
	if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
    }

	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	//simple AI to control com's paddle
	let computerLevel = 0.1;
	com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

	if(ball.y + ball.radius > canvas.height || ball.y + ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
	}
	let player = (ball.x < canvas.width/2) ? user : com;

	if(collision(ball, player)) {
		// ball.velocityX = -ball.velocityX;
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        let angleRad = (Math.PI/4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;

	}
}


// game init
function game() {
	update();
	render();
}

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);