var canvas = document.getElementById("snailbait-game-canvas"),
    context = canvas.getContext("2d");


//初始化主角
function drawRunner() {
    //设置主角位置
    context.drawImage(runnerImage, 50, 280);
}

/************ 平台相关代码 ***********/
PLATFORM_HEIGHT = 8
//用于存放平台对象的数组
var platformData = [
    /*{
        left: 10,
        width: 230,
        height:PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,250,0)',
        opacity: 0.5,
        track: 1,
        pulsate: false
    },
    {
        left: 330,
        width: 100,
        height:PLATFORM_HEIGHT,
        fillStyle: 'rgb(212,212,23)',
        opacity: 0.5,
        track: 1,
        pulsate: false
    },
    {
        left: 600,
        width: 230,
        height:PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,250,0)',
        opacity: 0.5,
        track: 2,
        pulsate: false
    }*/
    {
        left:      10,
        width:     230,
        height:    PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,250,0)',
        opacity:   0.5,
        track:     1,
        pulsate:   false,
    },

    {  left:      250,
        width:     100,
        height:    PLATFORM_HEIGHT,
        fillStyle: 'rgb(150,190,255)',
        opacity:   1.0,
        track:     2,
        pulsate:   false,
    },

    {  left:      400,
        width:     125,
        height:    PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,0,0)',
        opacity:   1.0,
        track:     3,
        pulsate:   false
    },

    {  left:      633,
        width:     100,
        height:    PLATFORM_HEIGHT,
        fillStyle: 'rgb(250,250,0)',
        opacity:   1.0,
        track:     1,
        pulsate:   false,
    },

]

//水平轨迹类型（平台的高度）
var TRACK_1_BASELINE = 323, //距离顶部323px
    TRACK_2_BASELINE = 223, //距离顶部223px
    TRACK_3_BASELINE = 123; //距离顶部123px

//获取平台轨迹类型，决定高度
function calculatePlatformTop(track) {
    switch (track){
        case 1:
            return TRACK_1_BASELINE;
            break;
        case 2:
            return TRACK_2_BASELINE;
            break;
        case 3:
            return TRACK_3_BASELINE;
            break;
    }
}

/************ 绘制平台 ***********/
var PLATFORM_STROKE_WIDTH = 8,
    PLATFORM_STROKE_STYLE = 'rgb(0,0,0)';

var PLATFORM_VELOCITY_MULTIPLIER = 4.35,
    platformOffset = 0,
    platformVelocity = 0;

function setPlatformVelocity() {
    //设置平台的移动速度为背景的4.35倍
    platformVelocity = PLATFORM_VELOCITY_MULTIPLIER * bgVelocity;
}
//设置平台偏移
function setPlatformOffset(now) {
    platformOffset += platformVelocity *
        (now - lastAnimationFrameTime) / 1000;

    if(platformOffset > 2 * background.width){
        turnLeft();
        platformOffset = 0;
    }
    else if (platformOffset < 0){
        turnRight();
    }

}
function drawPlatform(data){
    var platformTop = calculatePlatformTop(data.track);

    context.lineWidth = PLATFORM_STROKE_WIDTH;
    context.strokeStyle = PLATFORM_STROKE_STYLE;
    context.fillStyle = data.fillStyle;
    context.globalAlpha = data.opacity;

    context.strokeRect(data.left, platformTop, data.width, data.height);
    context.fillRect(data.left, platformTop, data.width, data.height);
}

function drawPlatforms(){
    console.log(platformOffset)
    context.translate(-platformOffset,0);
    for (let i=0; i<platformData.length; i++){
        drawPlatform(platformData[i]);
    }
    context.translate(platformOffset,0);
}
/************ 帧率计算以及更新***********/
var lastAnimationFrameTime = 0,
    lastFpsUpdateTime = 0;  //设置专门用于记录更新fps的监控

function calculateFps(now) {
    var fps = 1 / (now - lastAnimationFrameTime) * 1000;
    fpsElement = document.getElementById("snailbait-fps");

    //每秒提交一次更新
    if(now - lastFpsUpdateTime > 1000){
        lastFpsUpdateTime = now;
        fpsElement.innerHTML = fps.toFixed(0) + "fps";
    }

    return fps;
}

/************ 背景偏移 ***********/
//背景偏移量
var backgroundOffset = 0;
function drawBackground() {
    //将原点向左偏移绘制背景，形成视觉上向右前进效果
    context.translate(-backgroundOffset, 0);
    context.drawImage(background, 0, 0);
    context.drawImage(background, background.width, 0);
    context.translate(backgroundOffset, 0);
}

//运动速率，25像素每秒
var BACKGROUND_VELOCITY = 25,
    bgVelocity = BACKGROUND_VELOCITY;//实际速度

function setBackgroundOffset(now) {
    backgroundOffset +=
        bgVelocity * (now - lastAnimationFrameTime) / 1000;
    if(backgroundOffset < 0 || backgroundOffset > background.width){
        backgroundOffset = 0;
    }
}

//设置背景和平台的偏移
function setOffset(now) {
    setBackgroundOffset(now);
    setPlatformOffset(now);
}

//向左移动
function turnLeft() {
    bgVelocity = -BACKGROUND_VELOCITY;
}

function turnRight() {
    bgVelocity = BACKGROUND_VELOCITY;
}

/************ 动画循环 ***********/
    var background = new Image(),
    runnerImage = new Image();

//每一帧动画
function draw(now){

    //先绘制背景再绘制人物，这样背景才是在最底层
    drawBackground();

    setPlatformVelocity();

    setOffset(now);

    drawPlatforms();

    drawRunner();
    lastAnimationFrameTime = now;
}

function animate(now) {
    fps = calculateFps(now);
    draw(now);
    requestAnimationFrame(animate);
}
/************ 初始化 ***********/
function startGame() {
    requestAnimationFrame(animate);
}

function initializeImage() {
    background.src = "images/background.png";
    runnerImage.src = "images/runner.png";

    background.onload = function (e) {
        startGame();
    };
}

/************ 启动游戏 ***********/

initializeImage();


