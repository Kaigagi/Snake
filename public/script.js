
let screen = visualViewport;
let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let canvasWidth;
let canvasHeight;
//  set canvas height and width theo vmin
if (screen.height<screen.width) {
    canvasHeight = screen.height;
    canvasWidth = screen.height;
}
else
{
    canvasWidth = screen.width;
    canvasHeight = screen.width;
}
canvas.height = canvasHeight;
canvas.width = canvasWidth;
let square = canvasWidth/22;
let direction;
let snake = [];
let spot = false;
let timeForAFrame = 150;
let snakeLength = 1;
let pause = false;
let mousedownX;
let mousedownY;
let mouseupX;
let mouseupY;
let snakeHead ;

function resize() {
    if (screen.height<screen.width) {
        canvasHeight = screen.height;
        canvasWidth = screen.height;
    }
    else
    {
        canvasWidth = screen.width;
        canvasHeight = screen.width;
    }
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    let square = canvasWidth/22;
}
let NoMoreInput = false;
function gameInput(event) {
    let keypress = event.key;
    if(NoMoreInput){
        return;
    }
    NoMoreInput = true;
    setTimeout(() => {
        NoMoreInput = false;
    }, timeForAFrame);
    switch (keypress) {
        case "w":
            if (direction == "down") {
                break;
            }
            // snakeHead.pastDirection = direction;
            direction = "up";
            break;
        case "s":
            if (direction == "up") {
                break;
            }
            // snakeHead.pastDirection = direction;
            direction = "down";
            break;
        case "a":
            if (direction == "right") {
                break;
            }
            // snakeHead.pastDirection = direction;
            direction = "left";
            break;
        case "d":
            if (direction == "left") {
                break;
            }
            // snakeHead.pastDirection = direction;
            direction = "right";
            break;
        default:
            direction = "none";
            break;
    }
}

function mobileInput(distanceX,distanceY) {
    // console.log(distanceX);
    // console.log(distanceY);
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (distanceX>0) {
            direction = "right";
        }
        else if (distanceX<0) {
            direction = "left";
        }
    }
    else if (Math.abs(distanceX) < Math.abs(distanceY)) {
        if (distanceY>0) {
            direction = "down";
        }
        else if (distanceY<0) {
            direction = "up";
        }
    }
}

function handleTouchEnd(event) {
    let touchObj = event.changedTouches[0];
    mouseupX = touchObj.clientX;
    mouseupY = touchObj.clientY;
    let distanceX = mouseupX - mousedownX;
    let distanceY = mouseupY - mousedownY;
    event.preventDefault();
    mobileInput(distanceX,distanceY);
    // console.log(mouseupY);
}

// canvas.addEventListener('touchmove', function(e){
//     e.preventDefault() // prevent scrolling when inside DIV
// }, false)

function handleTouchStart(event) {
    let touchObj = event.changedTouches[0];
    mousedownX = touchObj.clientX;
    mousedownY = touchObj.clientY;
    event.preventDefault()
    // console.log(mousedownY);
}
let wallSrc = "./Assets/green-tile.png"
const wallTile = new Image();
wallTile.src = wallSrc;
function drawSquare(x,y) {
    ctx.drawImage(wallTile,x,y,square,square);
}

function createWall() {
    for (let i = 0; i < 22; i++) {
        if(i==0 || i==21)
        {
            for (let j = 0; j < 22; j++) {
                drawSquare(i*square,j*square);
            }
        }
        else
        {
            drawSquare(i*square,0);
            drawSquare(i*square,canvasHeight-square);
        }
    }
}
createWall();

class Vector2{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}
class Snake{
    constructor(x,y,next,previous,pastPosition)
    {
        this.x = x;
        this.y = y;
        this.next = next;
        this.previous = previous;
        this.pastPosition = pastPosition;
        this.pastDirection;
        this.direction;
    }
}

let spawnHeadX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let spawnHeadY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let spawnSpotX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let spawnSpotY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let move;
let spawnSpot;
let newSnakeNode;
let checkGameOver;
let checkGamePause;

const spriteWidth = 50;
const snakeSize = square*1;
let snakeBody = new Image();
snakeBody.src = "./Assets/snakeBody.png"
let snakeHeadImg = new Image();
snakeHeadImg.src = "./Assets/snakeHead.png"
let snakeBody2 = new Image()
snakeBody2.src = "./Assets/snakeBody2.png"
function drawSnakeBody(p,x,y) {
    let frame;
    if (p.direction == "up" || p.direction=="down") {
        frame = 1;
    }
    else{
        frame = 0;
    }
    ctx.drawImage(snakeBody,frame*spriteWidth,0,spriteWidth,spriteWidth,x-snakeSize*0.5,y-snakeSize*0.5,snakeSize,snakeSize);
}

function drawSnakeBody2(p,x,y) {
    let frame;
    if (p.direction == "up" && p.previous.direction=="left") {
        frame = 1;
    }else if (p.direction == "down" && p.previous.direction=="left") {
        frame = 2;
    }else if (p.direction == "up" && p.previous.direction=="right") {
        frame = 4;
    }else if (p.direction == "down" && p.previous.direction=="right") {
        frame = 3;
    }
    else if (p.direction == "right" && p.previous.direction=="down") {
        frame = 1;
    }
    else if (p.direction == "right" && p.previous.direction=="up") {
        frame = 2;
    }
    else if (p.direction == "left" && p.previous.direction=="up") {
        frame = 3;
    }
    else if (p.direction == "left" && p.previous.direction=="down") {
        frame = 4;
    }
    ctx.drawImage(snakeBody2,(frame-1)*spriteWidth,0,spriteWidth,spriteWidth,x-snakeSize*0.5,y-snakeSize*0.5,snakeSize,snakeSize);
}


function drawSnakeHead(x,y) {
    let frame;
    switch (direction) {
        case "up":
            frame = 1;
            break;
        case "left":
            frame = 2;
            break;
        case "down":
            frame = 3;
            break;
        case "right":
            frame = 0;
            break;
        default:
            break;
    }
    ctx.drawImage(snakeHeadImg,frame*spriteWidth,0,spriteWidth,spriteWidth,x-snakeSize*0.5,y-snakeSize*0.5,snakeSize,snakeSize);
}


function drawSnake(p,x,y) {
    if (p.previous!=null) {
        if (p.previous.direction != p.direction) {
            drawSnakeBody2(p,x,y);
            console.log(1);
            return;
        }
    }
    if (p==snakeHead) {
        drawSnakeHead(x,y);
    }
    else{
        console.log(2);
        drawSnakeBody(p,x,y);
    }
}

function drawSpot(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,square/2.5,Math.PI*2,false);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function deleteSnake(node) {
    if (node == null) {
        return;
    }
    deleteSnake(node.next);
    delete node;
}


function Pause() {
    if (pause == false) {
        gamePause();
        pause = true;
        return;
    }
    if (pause == true) {
        gameContinue();
        pause = false;
        return;
    }
}

function moveSnake() {
    switch (direction) {
        case "up":
            // console.log("up");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.direction = "up";
            snakeHead.y = snakeHead.y - square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                    p.next.pastDirection = p.next.direction;
                    p.next.direction = p.pastDirection;
                }
                drawSnake(p,p.x,p.y);
            }
            snakeHead.pastDirection = snakeHead.direction;
            // console.log(snakeHead.y);
            break;
        case "down":
            // console.log("down");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.direction = "down";
            snakeHead.y = snakeHead.y + square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                    p.next.pastDirection = p.next.direction;
                    p.next.direction = p.pastDirection;
                }
                drawSnake(p,p.x,p.y);
            }
            snakeHead.pastDirection = snakeHead.direction;
            break;
        case "left":
            // console.log("left");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.direction = "left";
            snakeHead.x = snakeHead.x - square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                    p.next.pastDirection = p.next.direction;
                    p.next.direction = p.pastDirection;
                }
                drawSnake(p,p.x,p.y);
            }
            snakeHead.pastDirection = snakeHead.direction;
            break;
        case "right":
            // console.log("right");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.direction = "right";
            snakeHead.x = snakeHead.x + square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                    p.next.pastDirection = p.next.direction;
                    p.next.direction = p.pastDirection;
                }
                drawSnake(p,p.x,p.y);
            }
            snakeHead.pastDirection = snakeHead.direction;
            break;
        default:
            break;
    };
}

let score = 1;
function scoreIncrease() {
    let scoreBoard = document.getElementById("Score");
    scoreBoard.innerHTML = ++score;
}

function newSnake() {
    if (snakeHead.x.toFixed(0)==spawnSpotX.toFixed(0)&&snakeHead.y.toFixed(0)==spawnSpotY.toFixed(0)) {
        for (let p = snakeHead; p !=null ; p = p.next) {
            // console.log(p.pastPosition.x)
            if (p.next==null) {
                const nextX = p.pastPosition.x;
                const nextY = p.pastPosition.y;
                p.next = new Snake(nextX,nextY,null,p);
                scoreIncrease();
                snakeLength++;
                spawnSpotX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
                spawnSpotY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
                break;
            }
        }
    }
}

function spawnSpotFunc() {
    if (spot == false) {
        drawSpot(spawnSpotX,spawnSpotY);
    }
}

function checkGameOverFunc() {
    if ((snakeHead.x<square*1||snakeHead.x>square*22-square*1)||(snakeHead.y<square*1||snakeHead.y>square*22-square*1)) {
        gameOver();
    }
    for (let p = snakeHead.next;p!=null ; p = p.next) {
        if (snakeHead.x==p.x&&snakeHead.y==p.y) {
            gameOver();
        }
    }
}

function gamePause() {
    clearInterval(move);
    clearInterval(spawnSpot);
    clearInterval(newSnakeNode);
    clearInterval(checkGameOver);
}

function gameContinue() {
    move = setInterval(moveSnake,timeForAFrame);
    let spawnSpotTime;
    if (screen.width <500) {
        spawnSpotTime = timeForAFrame;
    }
    spawnSpot = setInterval(spawnSpotFunc,spawnSpotTime);
    newSnakeNode = setInterval(newSnake,timeForAFrame);
    checkGameOver = setInterval(checkGameOverFunc,timeForAFrame);
}

function checkGamePauseFunc() {
    if (pause==true) {
        gamePause();
        return;
    }
    if(pause == false) {
        gameContinue();
        pause = null;
        return;
    }
}

function gameOver() {
    let gameOverScreen = document.getElementById("gameOver");
    clearInterval(move);
    clearInterval(spawnSpot);
    clearInterval(newSnakeNode);
    clearInterval(checkGameOver);
    gameOverScreen.classList.remove("disable");
    deleteSnake(snakeHead);
}


function gameStart() {
    snakeHead = new Snake(spawnHeadX,spawnHeadY,null,null);
    drawSnake(snakeHead,spawnHeadX,spawnHeadY);
    move = setInterval(moveSnake, timeForAFrame);
    let spawnSpotTime;
    if (screen.width <500) {
        spawnSpotTime = timeForAFrame;
    }
    spawnSpot = setInterval(spawnSpotFunc, spawnSpotTime);
    newSnakeNode = setInterval(newSnake, timeForAFrame);
    checkGameOver = setInterval(checkGameOverFunc,timeForAFrame);
}

function gameRestart() {
    let gameOverScreen = document.getElementById("gameOver");
    gameOverScreen.classList.add("disable");
    direction = "none";
    spawnHeadX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
    spawnHeadY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    createWall();
    gameStart();
}

gameStart();
