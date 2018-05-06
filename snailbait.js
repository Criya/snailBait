var canvas = document.getElementById("snailbait-game-canvas"),
    context = canvas.getContext("2d"),

    background = new Image(),
    runnerImage = new Image();

function initializeImage() {
    background.src = "images/background.png";
    runnerImage.src = "images/runner.png";

    background.onload = function (e) {
        startGame();
    };
}

function startGame() {
    draw();
}

//填充canvas
function draw(){
    //先绘制背景再绘制人物，这样背景才是在最底层
    drawBackground();
    drawRunner();
}

//初始化背景
function drawBackground() {
    context.drawImage(background,0 ,0);
}

//初始化主角
function drawRunner() {
    //设置主角位置
    context.drawImage(runnerImage, 50, 280);
}

// 启动游戏 *************

initializeImage();



