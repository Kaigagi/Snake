
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
let pause = null;

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


function gameInput(event) {
    let keypress = event.key;
    switch (keypress) {
        case "w":
            if (direction == "down") {
                break;
            }
            direction = "up";
            break;
        case "s":
            if (direction == "up") {
                break;
            }
            direction = "down";
            break;
        case "a":
            if (direction == "right") {
                break;
            }
            direction = "left";
            break;
        case "d":
            if (direction == "left") {
                break;
            }
            direction = "right";
            break;
        default:
            direction = "none";
            break;
    }
}

function drawSquare(x,y) {
    ctx.beginPath();
    ctx.rect(x,y,square,square);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
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
    constructor(x,y,next,pastPosition)
    {
        this.x = x;
        this.y = y;
        this.next = next;
        this.pastPosition = pastPosition;
    }
}

let spawnHeadX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let spawnHeadY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let snakeHead = new Snake(spawnHeadX,spawnHeadY,null);
let spawnSpotX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
let spawnSpotY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;


function drawSnake(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,square/2,0,Math.PI*2,false);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
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
    if (pause == null) {
        pause = true;
    }
    else{
        pause = false;
    }
}

function moveSnake() {
    switch (direction) {
        case "up":
            // console.log("up");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.y = snakeHead.y - square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                }
                drawSnake(p.x,p.y);
            }
            // console.log(snakeHead.y);
            break;
        case "down":
            // console.log("down");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.y = snakeHead.y + square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                }
                drawSnake(p.x,p.y);
            }
            break;
        case "left":
            // console.log("left");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.x = snakeHead.x - square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                }
                drawSnake(p.x,p.y);
            }
            break;
        case "right":
            // console.log("right");
            ctx.clearRect(square,square,square*22-square*2,canvasHeight-square*2);
            snakeHead.pastPosition = new Vector2(snakeHead.x,snakeHead.y);
            snakeHead.x = snakeHead.x + square;
            for (let p = snakeHead; p !=null ; p = p.next) {
                if (p.next!=null) {
                    p.next.pastPosition = new Vector2(p.next.x,p.next.y);
                    p.next.x = p.pastPosition.x;
                    p.next.y = p.pastPosition.y;
                }
                drawSnake(p.x,p.y);
            }
            break;
        default:
            break;
    };
}

function newSnake() {
    if (snakeHead.x.toFixed(0)==spawnSpotX.toFixed(0)&&snakeHead.y.toFixed(0)==spawnSpotY.toFixed(0)) {
        for (let p = snakeHead; p !=null ; p = p.next) {
            // console.log(p.pastPosition.x)
            if (p.next==null) {
                const nextX = p.pastPosition.x;
                const nextY = p.pastPosition.y;
                p.next = new Snake(nextX,nextY,null);
                snakeLength++;
                spawnSpotX = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
                spawnSpotY = Math.floor(((square*22-square*3)*Math.random())/square)*square+square*1.5;
                break;
            }
        }
    }
}

function spawnSpotFunc(params) {
    if (spot == false) {
        drawSpot(spawnSpotX,spawnSpotY);
    }
}

function checkGameOverFunc(params) {
    if ((snakeHead.x<square*1||snakeHead.x>square*22-square*1)||(snakeHead.y<square*1||snakeHead.y>square*22-square*1)) {
        gameOver(move,spawnSpot,newSnakeNode,checkGameOver,snakeHead);
    }
    for (let p = snakeHead.next;p!=null ; p = p.next) {
        if (snakeHead.x==p.x&&snakeHead.y==p.y) {
            gameOver(move,spawnSpot,newSnakeNode,checkGameOver,snakeHead);
        }
    }
    if (pause==true) {
        gamePause(move,spawnSpot,newSnakeNode,checkGameOver);
    }
    else if (pause == false) {
        gameContinue();
        pause = null;
    }
}

function gamePause(move,spawnSpot,newSnakeNode,checkGameOver) {
    clearInterval(move);
    clearInterval(spawnSpot);
    clearInterval(newSnakeNode);
    clearInterval(checkGameOver);
}

function gameContinue() {
    setInterval(moveSnake,timeForAFrame);
}

function gameOver(move,spawnSpot,newSnakeNode,checkGameOver,snakeHead) {
    let gameOverScreen = document.getElementById("gameOver");
    clearInterval(move);
    clearInterval(spawnSpot);
    clearInterval(newSnakeNode);
    clearInterval(checkGameOver);
    gameOverScreen.classList.remove("disable");
    deleteSnake(snakeHead);
}


function gameStart() {
    drawSnake(spawnHeadX,spawnHeadY);
    var move = setInterval(moveSnake, timeForAFrame);
    var spawnSpot = setInterval(spawnSpotFunc, timeForAFrame*2);

    var newSnakeNode = setInterval(newSnake, timeForAFrame);
    var checkGameOver = setInterval(checkGameOverFunc,timeForAFrame);
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