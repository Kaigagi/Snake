let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = 660;
let canvasHeight = 540;
let square = 30;
let direction;
let snake = [];
let spot = false;
let timeForAFrame = 150;
let snakeLength = 1;

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
    for (let i = 0; i < canvasWidth/square; i++) {
        if(i==0 || i==canvasWidth/square-1)
        {
            for (let j = 0; j < canvasHeight/square; j++) {
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

function gameOver(move,spawnSpot,newSnakeNode) {
    let gameOverScreen = document.getElementById("gameOver");
    clearInterval(move);
    clearInterval(spawnSpot);
    clearInterval(newSnakeNode);
    gameOverScreen.classList.remove("disable");
}


function gameStart() {
    let spawnHeadX = Math.floor(((canvasWidth-square*3)*Math.random())/square)*square+square*1.5;
    let spawnHeadY = Math.floor(((canvasHeight-square*3)*Math.random())/square)*square+square*1.5;
    let snakeHead = new Snake(spawnHeadX,spawnHeadY,null);
    drawSnake(spawnHeadX,spawnHeadY);
    var move = setInterval(() => {
        switch (direction) {
            case "up":
                // console.log("up");
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
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
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
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
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
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
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
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
    }, timeForAFrame);
    let spawnSpotX = Math.floor(((canvasWidth-square*3)*Math.random())/square)*square+square*1.5;
    let spawnSpotY = Math.floor(((canvasHeight-square*3)*Math.random())/square)*square+square*1.5;
    var spawnSpot = setInterval(() => {
        if (spot == false) {
            drawSpot(spawnSpotX,spawnSpotY);
        }
    }, timeForAFrame*2);

    var newSnakeNode = setInterval(() => {
        if (snakeHead.x==spawnSpotX&&snakeHead.y==spawnSpotY) {
            for (let p = snakeHead; p !=null ; p = p.next) {
                // console.log(p.pastPosition.x)
                if (p.next==null) {
                    const nextX = p.pastPosition.x;
                    const nextY = p.pastPosition.y;
                    p.next = new Snake(nextX,nextY,null);
                    snakeLength++;
                    spawnSpotX = Math.floor(((canvasWidth-square*3)*Math.random())/square)*square+square*1.5;
                    spawnSpotY = Math.floor(((canvasHeight-square*3)*Math.random())/square)*square+square*1.5;
                    break;
                }
            }
        }
    }, timeForAFrame);
    var checkGameOver = setInterval(() => {
        if ((snakeHead.x<square*1.5||snakeHead.x>canvasWidth-square*1.5)||(snakeHead.y<square*1.5||snakeHead.y>canvasHeight-square*1.5)) {
            gameOver(move,spawnSpot,newSnakeNode);
        }
        for (let p = snakeHead.next;p!=null ; p = p.next) {
            if (snakeHead.x==p.x&&snakeHead.y==p.y) {
                gameOver(move,spawnSpot,newSnakeNode);
            }
        }
    },timeForAFrame);
}

function gameRestart(params) {
    let gameOverScreen = document.getElementById("gameOver");
    gameOverScreen.classList.add("disable");
    gameStart();
}

gameStart();