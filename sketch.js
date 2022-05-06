var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieGroup, zombie_running;
var bullet, bulletIMG, bulletGroup;
var heart, heart1IMG, heart2IMG, heart3IMG;
var gameover;
var counter = 3;
var score = 0;
var gameState = 1;

function preload() {

  zombie_running = loadAnimation("assets/z1.png", "assets/z2.png", "assets/z3.png", "assets/z4.png", "assets/z5.png", "assets/z6.png");
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  loser = loadImage("assets/shooter_1.png")
  bgImg = loadImage("assets/bg.jpeg")
  zombieIMG = loadImage("assets/z1.png")
  heart1IMG = loadImage("assets/heart_1.png")
  heart2IMG = loadImage("assets/heart_2.png")
  heart3IMG = loadImage("assets/heart_3.png")
  bulletIMG = loadImage("assets/bullet.png")
  gameOver = loadImage("assets/gameover.png")
  winSound = loadSound("assets/win.mp3")
  loseSound = loadSound("assets/lose.mp3")

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  //adding the background image
  bg = createSprite(width / 2 - 20, height / 2 - 40, 500, 20);
  bg.addImage(bgImg)
  bg.scale = 1.5

  //game over
  gameover = createSprite(width / 2, height / 2, 100, 100);
  gameover.addImage(gameOver)
  gameover.scale = 1.5;
  gameover.visible = false;

  //creating the player sprite
  player = createSprite(width - 1150, height - 300, 50, 50);
  player.addImage("normal", shooterImg)
  player.addImage("loser", loser)
  player.scale = 0.7
  player.debug = false
  player.setCollider("rectangle", 0, 0, 300, 300)

  //lives
  heart = createSprite(width / 2 + 750, height / 2 - 100, 50, 50);
  heart.addImage(heart3IMG);
  heart.scale = 0.5;


  zombieGroup = new Group()
  bulletGroup = new Group()

}

function draw() {
  background(0);



  if (gameState === 1) {
    //player movements
    if ((keyDown("UP_ARROW") && player.y >= height / 2) || touches.length > 0) {
      player.y = player.y - 10
    }

    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      player.y = player.y + 10
    }

    if (keyDown("LEFT_ARROW") || touches.length > 0) {
      player.x = player.x - 10
    }
    if (keyDown("RIGHT_ARROW") || touches.length > 0) {
      player.x = player.x + 10
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if (keyWentDown("space")) {

      player.addImage(shooter_shooting)
      spawnBullets()

    }

    //player goes back to original standing image once we stop pressing the space bar
    else if (keyWentUp("space")) {
      player.addImage(shooterImg)
    }

    spawnZombies();

    zombieDeath();

    playerDeath();
  }

  else if (gameState === 0) {
    console.log("Game Ended")
  }

  console.log(score);

  drawSprites();

  fill("white")
  textSize(50)
  text("Score = " + score, width / 2 - 750, height / 2 - 100)


}

function spawnBullets() {
  bullet = createSprite(player.x + 150, player.y - 55, 100, 100)
  bullet.addImage(bulletIMG);
  bullet.scale = 0.2;
  bullet.velocityX = 70
  bulletGroup.add(bullet);
}

function spawnZombies() {

  if (frameCount % 20 === 0) {
    zombie = createSprite(width, random(height - 300, height - 150))
    zombie.addAnimation("running", zombie_running);
    zombie.scale = 1.3
    zombie.velocityX = -10
    zombieGroup.add(zombie)
  }
}

function zombieDeath() {
  if (bulletGroup.isTouching(zombieGroup)) {
    zombieGroup.destroyEach();
    bulletGroup.destroyEach();
    score = score + 1;
  }
}

function playerDeath() {

  if (player.isTouching(zombieGroup)) {
    zombieGroup.destroyEach();
    counter = counter - 1;
    console.log(counter);
  }

  if (counter === 2) {
    heart.addImage(heart2IMG)
  }

  if (counter === 1) {
    heart.addImage(heart1IMG)
  }

  if (counter <= 0) {
    heart.visible = false;
    player.addImage(loser);
    loseSound.play();
    loseSound.setVolume(0.1)
    gameover.visible = true;

    gameState = 0;
  }
}