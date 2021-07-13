let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = 660;
let canvasHeight = 540;
let square = 30;
let direction;

function gameInput(event) {
    let keypress = event.key;
    switch (keypress) {
        case "w":
            direction = "up";
            break;
        case "s":
            direction = "down";
            break;
        case "a":
            direction = "left";
            break;
        case "d":
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
            drawSquare(i*square,canvasHeight-30);
        }
    }
}
createWall();

class Snake{
    constructor(x,y,next)
    {
        this.x = x;
        this.y = y;
        this.next = next;
    }
}

class snake{
    constructor(x,y,next)
    {
        this.x = x;
        this.y = y;
        this.next = next;
    }
}

class Cell{
    constructor(x,y,top,left,right,bottom)
    {        
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;      
    }
    snake = false;
    spot = false;
}

function drawSnake(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,15,0,Math.PI*2,false);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function gameStart() {
    let spawnHeadX = Math.floor(((canvasWidth-square*3)*Math.random())/square)*square+square*1.5;
    let spawnHeadY = Math.floor(((canvasHeight-square*3)*Math.random())/square)*square+square*1.5;
    let snakeHead = new Snake(spawnHeadX,spawnHeadY,null);
    drawSnake(spawnHeadX,spawnHeadY);
    setInterval(() => {
        switch (direction) {
            case "up":
                console.log("up");
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
                drawSnake(snakeHead.x,snakeHead.y-square);
                snakeHead.y = snakeHead.y-square;
                break;
            case "down":
                console.log("down");
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
                drawSnake(snakeHead.x,snakeHead.y+square);
                snakeHead.y = snakeHead.y+square;
                break;
            case "left":
                console.log("left");
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
                drawSnake(snakeHead.x-square,snakeHead.y);
                snakeHead.x = snakeHead.x-square;
                break;
            case "right":
                console.log("right");
                ctx.clearRect(square,square,canvasWidth-square*2,canvasHeight-square*2);
                drawSnake(snakeHead.x+square,snakeHead.y);
                snakeHead.x = snakeHead.x+square;
                break;
            default:
                break;
        }
    }, 300);
}

gameStart();