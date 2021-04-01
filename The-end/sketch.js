var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, ground2, invisibleGround2;
var gameOver,restart;
var gameOverimg,restartimg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score,dist;
var flag = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  bgimage=loadImage("bg.jpg");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth - 20,windowHeight);
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided);
  
  gameOver = createSprite(300,140);
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
 
  ground2 = createSprite(200,180,400,20);
  ground2.addImage("ground",groundImage);
  ground2.x = ground.width + ground.width/2;
  
  invisibleGround = createSprite(ground.x,190,ground.width,10);
  invisibleGround.visible = false;
  
  invisibleGround2 = createSprite(ground2.x,190,ground.width,10);
  invisibleGround2.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  dist = ground.width;
}

function draw() {
  background(bgimage);
  if(gameState == PLAY) {
    trex.velocityX = 5;
    score = score + Math.round(getFrameRate()/60);
    text("Score: "+ score, trex.x+200,50);
    
    if(keyDown("space")) {
      trex.velocityY = -14;
    }
    
    trex.velocityY = trex.velocityY + 0.8  
    camera.position.x = trex.x+500;
    
    if (trex.x >= dist-displayWidth){
      if(flag === 0){
        ground2.x = dist+ground.width/2;
        invisibleGround2.x = ground2.x;
        flag = 1;
      }
      else{
        ground.x = dist+ground.width/2;
        invisibleGround.x = ground.x;
        flag=0;
      }
      dist+=ground.width;
    }
    
    trex.collide(invisibleGround);
    trex.collide(invisibleGround2);
    spawnClouds();
    spawnObstacles();

    if(trex.isTouching(obstaclesGroup)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    gameOver.x = trex.x+200;
    restart.x = trex.x+200;
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)) {
      reset();
    }   
    
    trex.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);   
    
    trex.changeAnimation("collided");
  }
  drawSprites();
}

function reset(){
  gameState = PLAY;  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();  
  
  trex.changeAnimation("running");  
  score = 0;
  
}
function spawnClouds() {
  
  if (frameCount % 100 === 0) {
    var cloud = createSprite(trex.x+displayWidth-100,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;    
    cloud.lifetime = displayWidth/trex.velocityX+30;
        
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    
    var obstacle = createSprite(trex.x+displayWidth-100,165,10,40);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }    
               
    obstacle.scale = 0.5;    
    obstacle.lifetime = displayWidth/trex.velocityX+30;   
    obstaclesGroup.add(obstacle);
  }
}