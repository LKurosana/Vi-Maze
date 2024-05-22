/*  Students: Please use this week's project for Week 17: Assignment 20: Final Build + Documentation. 
     You will need to replace the contents of this JavaScript file with your own work, 
     and create any other files, if any, required for the assignment.
     When you are done, be certain to submit the assignment in Canvas to be graded. */

/*
Gameplay Instructions:
Use the up arrow key to have the ship move forward. Use the left/right arrow keys to turn the ship left or right. Use the spacebar to spend 2 fuel to turn on invisible mode.

Invisibile Mode:
When virus enemies appear in the maze, being invisible will cause them to search the last place you were located when they first spawned instead of chase you right away. However, if you are near the virus while invisible, they will detect and chase you for some time, and you will no longer be invisible. You cannot enter invisibile mode while being chased. After the virus has chased you for some time or has not found you while you were invisible, it will head back to the warp point and disappear, and invisibility mode will turn off. 

Goal:
The goal is to find as many samples as you can in the maze and then enter the warp point to end the game and recieve 1 of 3 endings depending on the number of samples collected. You can also try to get a high score, which is calculated based on how many fuel tanks and samples you currently have.

Losing:
You start with 5 fuel tanks, which are like your lives. You lose 1 each time you hit something and the game will end if you have none. Getting caught by a virus enemy is an instant game over. 

*/

"use strict";

//start screen
let title = {
  key: 'title',
  active: true,
  preload: titlePreload,
  create: titleCreate,
  update: titleUpdate
};

//gameplay
let gameplay = {
  key: 'gameplay',
  active: false,
  preload: preload,
  create: create,
  update: update
};

//gameover
let gameover = {
  key: 'gameover',
  active: false,
  preload: gameoverPreload,
  create: gameoverCreate,
  update: gameoverUpdate
};


//game config
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
      mode: Phaser.Scale.FIT,//comment out for smaller size
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
  },
  physics: {
    default: 'arcade',
    //arcade: { debug: true }
  },
  scene: [title, gameplay, gameover],
  pixelArt: true
};



//*********************************************************
//title screen scene

let titleImage, startText, gameName, storyText, highscore = 0, highscoreText, titleMusic, optionsText;
let inCredits, inInstructions = false;//sees if user in in credits or instructions
let creditText, instructionsText;
let difficulty = 2;  //2 is normal, 1 is easy
let maxInteractions = 5;  //5 for normal, 10 for easy


function titlePreload() 
{
  this.load.image('back', 'img/back.png');
  //https://opengameart.org/content/space-background-1

  this.load.audio('titleMusic','sound/ambientmain_0.ogg');
  //https://opengameart.org/content/tragic-ambient-main-menu//ambientmain
}

function titleCreate() 
{
  titleImage = this.add.image(0, 0, 'back').setOrigin(0, 0);

  gameName = this.add.text(400, 100, 'VI-MAZE', { fontSize: '50px', fill: '#00ff00', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  startText = this.add.text(400, 500, 'CLICK TO START', { fontSize: '30px', fill: '#ffffff', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  optionsText = this.add.text(400, 580, 'SPACEBAR: VIEW CREDITS     1: CONTROLS     2: DIFFICULTY - NORMAL', { fontSize: '20px', fill: '#00ff00', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  //options text will reflect current difficulty mode instead of reverting to default when player enters title screen after game over
  if (difficulty == 1)
  {
    optionsText.setText('SPACEBAR: VIEW CREDITS     1: CONTROLS     2: DIFFICULTY - EASY');
  }
  console.log("difficulty is " + difficulty);
  console.log("interactions needed: " + maxInteractions);

  highscoreText = this.add.text(400, 400, 'HIGHSCORE: ' + highscore, { fontSize: '30px', fill: '#00ff00', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  storyText = this.add.text(400, 250, 'A mysterious virus from space has started to take over\n Earth, causing creatures to exhibit plant-like behaviors.\n As part of a space research team working to develop a vaccine,\n you have been given orders to travel to the location where\n the virus is thought to have originated in order to collect\n weakened virus samples. Arriving in an unusual maze-like area,\n you must carefully navigate your ship to gather samples and\n find the warp point to get back home.', { align: 'center', fontSize: '20px', fill: '#ffffff', fontFamily: 'Kode Mono' },).setOrigin(0.5);

  //credits are also located in the code in all preload functions, except font
  //which is in index.html
  creditText = this.add.text(400, 250, 'ART\nShip: https://opengameart.org/content/assorted-space-ships-16x16-and-32x32 by awesomeduck\nSci-Fi Tileset: https://opengameart.org/content/space-merc-redux-platform-shmup-tileset by Emcee Flesher\nNature Titleset: https://opengameart.org/content/space-merc-redux-giant-jungle-environment by Emcee Flesher\nSamples: https://opengameart.org/content/dungeon-crawl-32x32-tiles maintained by Chris Hamons\nBackground: https://opengameart.org/content/space-background-1 by Westbeam\nAsteroids: https://opengameart.org/content/brown-asteroid by FunwithPixels\nFuel: https://opengameart.org/content/sci-fi-goodscommodities by ChaosShark\n Warp Point: https://opengameart.org/content/portal-animation by rrcaseyr\nVirus Enemy: https://opengameart.org/content/super-dead-gunner-batch-3 by Emcee Flesher\n\nSOUND\nTitle BGM: https://opengameart.org/content/tragic-ambient-main-menu by brandon75689\nMain BGM: https://opengameart.org/content/spacelife-14 by yd\nGood End BGM: https://opengameart.org/content/i-swear-i-saw-it-background-track by yd\nBad End BGM: https://opengameart.org/content/lost-on-the-moon by Some Weirdo\nShip Hitting Wall: https://opengameart.org/content/big-explosion by Blender Foundation\nInvincible Ship Hitting Wall: https://opengameart.org/content/synthesized-explosion by Iwan Gabovitch\nAsteroid Destroyed: https://opengameart.org/content/wgs-sound-fx-explosion-1 by WrathGames Studio\nAsteroid Hitting Wall: https://opengameart.org/content/muffled-distant-explosion by NenadSimic\nFuel/Sample/Warp: https://opengameart.org/content/sci-fi-sound-effects-library by Little Robot Sound Factory\nVirus: https://opengameart.org/content/space-winds by aquinn\nEngine: https://opengameart.org/content/engine-sound by kurt\nGlass Breaking: https://opengameart.org/content/breaking-bottle by spookymodem\nInvisible Mode: https://opengameart.org/content/ui-menu-open-and-close by FiveBrosStopMosYT\n\nFONT\nhttps://fonts.google.com/specimen/Kode+Mono?classification=Monospace by Isa Ozler\n\nSHIP MOVEMENT CONCEPT\nhttps://gamemechanicexplorer.com/#thrust-2 by John Watson', { align: 'center', fontSize: '12px', fill: '#00ff00', fontFamily: 'Kode Mono' },).setOrigin(0.5).setAlpha(0);

  instructionsText = this.add.text(400, 250, 'CONTROLS:\nUP KEY: Move forward\nLEFT/RIGHT KEYS: Turn left or right\nSPACEBAR: Spend 2 fuel tanks to enter invisibility mode\n\nMISSION NOTES:\nViruses currently on Earth may become aware of your presence in the maze.\n If you hear a static-like sound, you may want to turn on invisibility mode\n and move away from your current location. Also, keep an eye on your fuel tanks.\nThe ship will be destroyed if you run out, but only a max of 5 can be carried.\nAnd lastly, be sure to bring enough samples before using the warp point.\n', { align: 'center', fontSize: '16px', fill: '#00ff00', fontFamily: 'Kode Mono' },).setOrigin(0.5).setAlpha(0);


  //makes click to start text blink
  this.tweens.add(
    {
      targets: startText,
      duration: 600,
      repeat: -1, // repeat of -1 means forever
      yoyo: true,
      alpha: '-=0.5',  //opacity
    }
  );

  this.input.on('pointerup', gameplayTrans, this);  //transition to gameplay once user clicks

  //keys for entering credits and instructions
  this.input.keyboard.on('keydown-SPACE', credits, this);
  this.input.keyboard.on('keydown-ONE', instructions, this);
  this.input.keyboard.on('keydown-TWO', changeDifficulty, this);


  titleMusic = this.sound.add('titleMusic');
  titleMusic.play(
    {
      volume: 1,
      loop: true
    }
  );
}

//nothing to update
function titleUpdate() { }


//shows or hides credits
function credits()
{
  if (!inCredits && !inInstructions)
  {
    inCredits = true;    
    //hide title text
    highscoreText.setAlpha(0);
    gameName.setAlpha(0);
    storyText.setAlpha(0);
    optionsText.setAlpha(0);
    startText.setText('PRESS SPACE TO RETURN');    
    //show credit text
    creditText.setAlpha(1);
  }
  else
  {
    inCredits = false;
    inInstructions = false;   
    //show title text
    highscoreText.setAlpha(1);
    gameName.setAlpha(1);
    storyText.setAlpha(1);
    optionsText.setAlpha(1);
    startText.setText('CLICK TO START');
    //hide credit text
    creditText.setAlpha(0);
    instructionsText.setAlpha(0);
  }
  
}

//shows or hides instructions
function instructions()
{
  if (!inInstructions && !inCredits)
  {
    inInstructions = true;
    //hide title text
    highscoreText.setAlpha(0);
    gameName.setAlpha(0);
    storyText.setAlpha(0);
    optionsText.setAlpha(0);
    startText.setText('PRESS 1 TO RETURN');
    //show instructions text
    instructionsText.setAlpha(1);
  }
  else
  {
    inInstructions = false;
    inCredits = false;
    //show title text
    highscoreText.setAlpha(1);
    gameName.setAlpha(1);
    storyText.setAlpha(1);
    optionsText.setAlpha(1);
    startText.setText('CLICK TO START');
    //hide credit text
    instructionsText.setAlpha(0);
    creditText.setAlpha(0);
  }
  
}


//changes difficulty by modifying how many interactions must be made with maze before virus enemy spawns
function changeDifficulty()
{
  //switch from normal to easy
  if (difficulty == 2)
  {
    console.log('change to easy');
    difficulty = 1;
    optionsText.setText('SPACEBAR: VIEW CREDITS     1: CONTROLS     2: DIFFICULTY - EASY');
    maxInteractions = 10;
  }

  //switch from easy to normal
  else
  {
    console.log('change to normal');
    difficulty = 2;
    optionsText.setText('SPACEBAR: VIEW CREDITS     1: CONTROLS     2: DIFFICULTY - NORMAL');
    maxInteractions = 5;
  }
}


// scene 1 transition to 2
//makes title screen fade
function gameplayTrans() 
{
  if (!inCredits && !inInstructions)
  {
    titleMusic.stop();

    this.scene.transition(
      {
        target: 'gameplay',
        duration: 2000,
        moveBelow: true,
        allowInput: false,
        onUpdate: function(progress) {
          titleImage.alpha = 1 - progress;
          startText.alpha = 1 - progress * 2;
          highscoreText.alpha = 1 - progress * 2;
          gameName.alpha = 1 - progress * 2;
          storyText.alpha = 1 - progress * 2;
          optionsText.alpha = 1 - progress * 2;
        }
      }
    ); 
  }
}



//*********************************************************
//gameover scene
let finalScore;  //text
let score;  //store calculated final score here
let rank;
let endingText;
let endMusicGood, endMusicBad;

function gameoverPreload() 
{
  this.load.image('back', 'img/back.png');
  //https://opengameart.org/content/space-background-1

  this.load.audio('endMusicGood','sound/IswearIsawit.mp3');
  //https://opengameart.org/content/i-swear-i-saw-it-background-track
  
  this.load.audio('endMusicBad','sound/lost_on_the_moon.ogg');
  //https://opengameart.org/content/lost-on-the-moon
}

function gameoverCreate() 
{
  //fixes problems of engine and virus sound playing once entering gameover scene
  if (engineSFX.isPlaying)
    engineSFX.stop();

  if (virusSFX.isPlaying)
    virusSFX.stop();

  //fade into gameover
  this.cameras.main.fadeIn(1000, 0, 0, 0)
  
  endMusicGood = this.sound.add('endMusicGood');
  endMusicBad = this.sound.add('endMusicBad');

  let backImage = this.add.image(0, 0, 'back').setOrigin(0, 0);

  //final score and rank calculation
  score = samplesCollected * 100 + fuelRemaining * 100;

  let missionStatus = this.add.text(400, 100, '', { fontSize: '50px', fill: '#ff0000', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  endingText = this.add.text(400, 300, 'STORY ENDING TEXT HERE', { align: 'center', fontSize: '20px', fill: '#00ff00', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  //determine mission success/fail and rank  
  if (fuelRemaining == 0)
  {
    missionStatus.setText('MISSION FAILED');
    rank = "D";
    endingText.setText('Your ship loses the last of its fuel and is destroyed.\n Unable to contact you, your team assumes the worst.\n They started to make preparations to send another researcher\n in your stead, but were too late, and were powerless as\n the virus took over Earth.').setColor('#ff0000');

    endMusicBad.play(
      {
        volume: 0.5,
        loop: true
      });
  }
  else if (caught)
  {
    missionStatus.setText('MISSION FAILED');
    rank = "D";
    endingText.setText('The virus finds its way into your ship and infects you.\n You are powerless to do anything as your body gradually\n morphs into one of a plant. Your team repeatedly\n tries to contact you, but you can do nothing to communicate\n with them. They eventually give up and start making plans\n to send someone else on your mission, but were too late\n as the virus took over earth.').setColor('#ff0000');

    endMusicBad.play(
      {
        volume: 0.5,
        loop: true
      });
  }
    
  //endings if warp point was reached
  else {
    missionStatus.setText('MISSION COMPLETE').setColor('#00ff00');

    if (samplesCollected == MAX_SAMPLES) {
      rank = "A";
      endingText.setText('You return home with as many samples as your ship could carry.\n Your team gets to work on analyzing the samples and within a\n few weeks, a vaccine is created and successfully deployed.\n You and your team are celebrated as heroes.\n What remains of earth gradually begins to be rebuilt,\n and your team begins research on a way to\n reverse the plant transformation effect from the virus.');

      endMusicGood.play(
      {
        volume: 0.5,
        loop: true
      });
    }

    else if (samplesCollected == 4 || samplesCollected == 3) {
      rank = "B";
      endingText.setText('You return home with a decent selection of samples.\n Your team finds that the samples show promise and create\n some prototype vaccines. They are not the most effective,\n but help to slow the virus a little.\n Plans are made for you to reenter the maze.');

      endMusicGood.play(
      {
        volume: 0.5,
        loop: true
      });
    }

    else {
      missionStatus.setText('MISSION FAILED').setColor('#ff0000');
      rank = "C";
      endingText.setText('You make it home safely, but not with many samples.\n Your team is unable to conclude anything,\n and the virus takes over Earth.\n Buildings are reduced to rubble and everyone is\n powerless as their essence is trapped in the form of a plant.').setColor('#ff0000');

      endMusicBad.play(
      {
        volume: 0.5,
        loop: true
      });
      
    }

  }


  finalScore = this.add.text(400, 150, 'SCORE: ' + score, { fontSize: '30px', fill: '#ffffff', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  rank = this.add.text(400, 200, 'RANK: ' + rank, { fontSize: '30px', fill: '#ffffff', fontFamily: 'Kode Mono' }).setOrigin(0.5);

  let promptText = this.add.text(400, 500, 'CLICK TO EXIT TO TITLE', { fontSize: '15px', fill: '#ffffff', fontFamily: 'Kode Mono' }).setOrigin(0.5);


  //makes text blink
  this.tweens.add(
    {
      targets: [finalScore, rank, promptText],
      duration: 600,
      repeat: -1, // repeat of -1 means forever
      yoyo: true,
      alpha: '-=0.5',  //opacity
    }
  );

  this.input.on('pointerup', resetGame, this);

}


//saves the high score for use on title screen
function gameoverUpdate() 
{
  if (score > highscore)
    highscore = score;
}


//goes to title screen and resets variables for the next game
function resetGame() 
{
  this.sound.stopAll();
  this.scene.start('title');
  score = 0;
  fuelRemaining = MAX_FUEL;
  samplesCollected = 0;
  interactions = 0;
  caught = false;
  invisible = false;
  timer = 0;
}


//*********************************************************
//gameplay scene

//variables
let player;
let cursors;
let ROTATION_SPEED = 180+50 // degrees/second
let ACCELERATION = 200; // pixels/second/second
let MAX_SPEED = 250; // pixels/second
let DRAG = 50;
let MAX_FUEL_IN_MAP = 20;
let MAX_FUEL = 5;  //max player can carry
let MAX_SAMPLES = 5;
let fuelRemaining = MAX_FUEL;  //current fuel player has
let samplesCollected = 0;
let interactions = 0;
let fuelText;
let sampleText;
let samples;
let fuelTanks;
let warpPoint
let asteroids;
let MAX_ASTEROIDS = 5;
let timer = 0;  //timer for invincibility
let INVINCIBILITY_TIME = 3;  //in seconds
let movingWalls;
let virusEnemies;
//let virusTimer = 0;
let caught = false, invisible = false;

//sounds
let wallHitSFX, asteroidDestroyedSFX, wallHitInvSFX, asteroidHitWallSFX;
let fuelSFX, sampleSFX, warpSFX, virusSFX, engineSFX, caughtSFX;
let invisibleOnSFX, invisibleOffSFX;
let bgMusic;


function preload() 
{
  //load tilesets and tilemap
  this.load.image("tiles", "img/nature-extruded.png");
  this.load.image("tiles2", "img/tech-extruded.png");//using 2 tilesets
  this.load.tilemapTiledJSON("map", "img/prototypeMaze1.tmj");

  //background
  this.load.image("back", "img/back.png");

  //player
  this.load.spritesheet('player', 'img/Starship.png', { frameWidth: 32, frameHeight: 32 });

  //nonmovable objects
  this.load.spritesheet('sample', 'img/sample.png', {frameWidth: 32, frameHeight: 32});
  this.load.image("fuelTank", "img/fuelTank.png");
  this.load.spritesheet('warpPoint', 'img/warpPoint.png', { frameWidth: 480, frameHeight: 312 });

  //movable objects
  this.load.image("asteroid", "img/asteroid.png");
  this.load.image("movingWall", "img/movingWall.png");
  this.load.spritesheet('virusEnemy', 'img/virusEnemy.png', {frameWidth: 18, frameHeight: 18});

  //sounds
  this.load.audio('wallHitSFX','sound/DeathFlash.flac');
  //https://opengameart.org/content/big-explosion
  
  this.load.audio('wallHitInvSFX','sound/explode.flac');
  //https://opengameart.org/content/synthesized-explosion

  this.load.audio('asteroidDestroyedSFX','sound/asteroid.ogg');
  //https://opengameart.org/content/wgs-sound-fx-explosion-1

  this.load.audio('asteroidHitWallSFX','sound/asteroidWall.wav');
  //https://opengameart.org/content/muffled-distant-explosion

  this.load.audio('fuelSFX','sound/fuel.wav');
  this.load.audio('sampleSFX','sound/sample.wav');
  this.load.audio('warpSFX','sound/warp.wav');
  //https://opengameart.org/content/sci-fi-sound-effects-library

  this.load.audio('virusSFX','sound/space-wind.mp3');
  //https://opengameart.org/content/space-winds

  this.load.audio('engineSFX','sound/engine.ogg');
  //https://opengameart.org/content/engine-sound

  this.load.audio('caughtSFX','sound/glassBreak.wav');
  //https://opengameart.org/content/breaking-bottle

  this.load.audio('invisibleOnSFX','sound/invisibleOn.wav');
  this.load.audio('invisibleOffSFX','sound/invisibleOff.wav');
  //https://opengameart.org/content/ui-menu-open-and-close by FiveBrosStopMosYT

  //background music
  this.load.audio('bgMusic','sound/spacelifeNo14.ogg');
  //https://opengameart.org/content/spacelife-14


  
  //Art Credits
  
  //spaceship
  //https://opengameart.org/content/assorted-space-ships-16x16-and-32x32

  //tilesets (also used for moving wall)
  //https://opengameart.org/content/space-merc-redux-platform-shmup-tileset 
  //https://opengameart.org/content/space-merc-redux-giant-jungle-environment

  //samples
  //https://opengameart.org/content/dungeon-crawl-32x32-tiles 

  //background
  //https://opengameart.org/content/space-background-1

  //asteroids
  //https://opengameart.org/content/brown-asteroid 

  //fuel
  //https://opengameart.org/content/sci-fi-goodscommodities 

  //warp point
  //https://opengameart.org/content/portal-animation

  //virus enemy
  //https://opengameart.org/content/super-dead-gunner-batch-3

}


function create() 
{
  console.log("difficulty is " + difficulty);
  console.log("interactions needed: " + maxInteractions);

  //*************************************************************************
  //tileset and tilemap creation

  //background with parallax scrolling
  let background = this.add.image(0, 0, 'back').setOrigin(0, 0);
  background.setScrollFactor(0.5);

  //make tilemap named mymap
  let mymap = this.make.tilemap({ key: "map" });

  //make tileset and add it to mymap
  //tile sets were extruded with https://github.com/sporadic-labs/tile-extruder
  //so last 4 parameters are tilewidth, tileheight, margin, spacing
  //there was no margin or spacing in the images, so used defaults of 1 and 2
  //first two parameters are name in Tiled, name in Phaser
  let mytileset = mymap.addTilesetImage("nature", "tiles", 16, 16, 1, 2);
  let mytileset2 = mymap.addTilesetImage("tech", "tiles2", 16, 16, 1, 2);//the 2nd set

  //create the layers
  let myabovelayer = mymap.createLayer("topLayer", [mytileset, mytileset2], 0, 0);
  let myworldlayer = mymap.createLayer("worldLayer", [mytileset, mytileset2], 0, 0);
  let mybelowlayer = mymap.createLayer("groundLayer", [mytileset, mytileset2], 0, 0);

  //move top layer to top
  myabovelayer.setDepth(10);

  //cause collisions for tiles in map that were set to collidable
  myworldlayer.setCollisionByProperty({ collides: true });

  //*************************************************************************
  //create player

  player = this.physics.add.sprite(45 * 16, 95 * 16, 'player');
  //for testing: vertical wall: 38 27, spawn: 45 95, wall2: 47, 33
  
  player.setBounce(0.5);//bounce off walls
  //player.setSize(26, 26, true);//change hitbox size if use square

  //allow collisions with player and myworldLayer (created in Tiled)
  this.physics.add.collider(player, myworldlayer, hitWall, null, this);

  //implement velocity and drag
  player.body.setMaxVelocity(MAX_SPEED);
  player.body.setDrag(DRAG);
  player.setOrigin(0.5, 0.5);
  player.angle = -90;
  player.setCircle(15, 1, 1);//change hitbox to circle. last 2 #s are x, y offset

  //controls
  cursors = this.input.keyboard.createCursorKeys();

  //Invisible mode
  this.input.keyboard.on('keydown-SPACE', invisibleMode, this)

  //animations for the flame
  this.anims.create({
    key: 'showFlame',
    frames: this.anims.generateFrameNumbers('player', { frames: [ 1, 5 ] }),
    frameRate: 4,
    repeat: -1
  });

  //static frame with no flame for when player isn't making ship move
  this.anims.create({
      key: 'hideFlame',
      frames: [ { key: 'player', frame: 2 } ],
      frameRate: 1
  });


  //*************************************************************************
  //setting bounds and camera

  //set bounds for world (not the layer) and collisions
  this.physics.world.setBoundsCollision(true, true, true, true);
  this.physics.world.setBounds(0, 0, mymap.widthInPixels, mymap.heightInPixels);

  //don't let player go off map
  player.setCollideWorldBounds(true);

  //camera will follow player and stay in game bounds
  let mycamera = this.cameras.main;
  mycamera.startFollow(player);
  mycamera.setBounds(0, 0, mymap.widthInPixels, mymap.heightInPixels);

  //zoom in so it's easier to see stuff
  this.cameras.main.setZoom(2);

  //*************************************************************************
  //HUD showing fuel and sample count

  fuelText = this.add.text(215, 150, 'FUEL TANKS: ' + fuelRemaining, { fontSize: '16px', fill: '#ff0000' });
  fuelText.setScrollFactor(0);
  fuelText.setDepth(12);

  sampleText = this.add.text(470, 150, 'SAMPLES: 0/' + MAX_SAMPLES, { fontSize: '16px', fill: '#ff0000' });
  sampleText.setScrollFactor(0);
  sampleText.setDepth(12);

  //background for HUD
  let HUD = this.add.rectangle(200, 150, 800, 50, 0x0A1172, 0.8);
  //let HUD = this.add.rectangle(200, 150, 800, 600, 0xff0000, 0.5);//makes bg red 
  HUD.setScrollFactor(0);  
  HUD.setDepth(11);  //places it on top of everything else

  //*************************************************************************
  //Samples

  samples = this.physics.add.group({
    defaultKey: 'sample',
    maxSize: MAX_SAMPLES
  });

  this.physics.add.collider(player, samples, collectSample, null, this);

  //place the 5 samples
  var sample = samples.create(81 * 16, 95 * 16, 'sample');
  var sample = samples.create(16 * 16, 61 * 16, 'sample');
  var sample = samples.create(52 * 16, 13 * 16, 'sample');
  var sample = samples.create(95 * 16, 5 * 16, 'sample');
  var sample = samples.create(3 * 16, 4 * 16, 'sample');

  this.anims.create({
    key: 'glow',
    frames: this.anims.generateFrameNumbers('sample', { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1
  });

  //scale down image and play animation
  samples.children.iterate(
    function(sample) {
      sample.setScale(0.8);
      sample.anims.play('glow', true);
    });

  //makes them a bit bigger and smaller over time
  this.tweens.add(
    {
      targets: samples.getChildren(),
      duration: 2000,
      repeat: -1,
      yoyo: true,
      scale: '+=.1',
      ease: 'Sine.easeIn'
    }
  );

  //*************************************************************************
  //Fuel Tanks

  fuelTanks = this.physics.add.group({
    defaultKey: 'fuelTank',
    //defaultFrame: 40,
    maxSize: MAX_FUEL_IN_MAP
  });

  this.physics.add.collider(player, fuelTanks, collectFuel, null, this);

  //Fuel Placement (Assuming there are 20 total)
  //furthest into map gets least fuel (5)
  for (let i = 0; i < MAX_FUEL_IN_MAP - 15; i++) 
  {
    let x = Phaser.Math.Between(0, 99 * 16);
    let y = Phaser.Math.Between(0, 19 * 16);
    var fuelTank = fuelTanks.create(x, y, 'fuelTank');
  }
  //middle of map gets slightly more (10)
  for (let i = 0; i < MAX_FUEL_IN_MAP - 10; i++) 
  {
    let x = Phaser.Math.Between(0, 99 * 16);
    let y = Phaser.Math.Between(20 * 16, 49 * 16);
    var fuelTank = fuelTanks.create(x, y, 'fuelTank');
  }
  //beginning of map gets most (15)
  for (let i = 0; i < MAX_FUEL_IN_MAP - 5; i++) 
  {
    let x = Phaser.Math.Between(0, 99 * 16);
    let y = Phaser.Math.Between(50 * 16, 99 * 16);
    var fuelTank = fuelTanks.create(x, y, 'fuelTank');
  }

  //scale down image
  fuelTanks.children.iterate(
    function(fuelTank) {
      fuelTank.setScale(0.5);
    });

  //makes tanks bob up and down
  this.tweens.add(
    {
      targets: fuelTanks.getChildren(),
      duration: 2000,
      repeat: -1,
      yoyo: true,
      y: '+=8',
      ease: 'Sine.easeIn'
    }
  );

  //*************************************************************************
  //Warp point

  //select a location from some preset coordinates
  let warpLocation = (Phaser.Math.Between(0,10));
  let warpXPossible = [38,27,89,93,6,6,19,56,38,68,73];
  let warpYPossible = [23,54,90,51,13,85,95,58,44,13,5];
  let warpX = warpXPossible[warpLocation];
  let warpY = warpYPossible[warpLocation];
  console.log("Warp is at " + warpX + " " + warpY);


  //the coordinates need to be multiplied by 16 to get correct location
  //(the above coordinates were in tiles, not pixels)
  warpPoint = this.physics.add.sprite(warpX * 16, warpY * 16, 'warpPoint').setScale(0.1);

  this.anims.create({
    key: 'move',
    frames: this.anims.generateFrameNumbers('warpPoint', { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1
  });

  warpPoint.anims.play('move', true);

  this.physics.add.collider(player, warpPoint, useWarp, null, this);


  //*************************************************************************
  //asteroids

  asteroids = this.physics.add.group({
    defaultKey: 'asteroid',
    maxSize: MAX_ASTEROIDS
  });

  this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
  this.physics.add.collider(asteroids, myworldlayer, asteroidHitWall, null, this);

  //random placement
  for (let i = 0; i < MAX_ASTEROIDS; i++) {
    let x = Phaser.Math.Between(0, 99 * 16);
    let y = Phaser.Math.Between(0, 99 * 16);
    var asteroid = asteroids.create(x, y, 'asteroid');
  }

  //make bouncy, give velocity, scale down
  asteroids.children.iterate(
    function(asteroid) {
      asteroid.setScale(0.2);
      asteroid.setBounce(1);
      asteroid.setVelocity(50);
      asteroid.setCollideWorldBounds(true); //this is so if asteroid spawns in a wall, it won't go out of game bounds (otherwise, it can move on the wall and is a chance it will leave the map)  
    });

  //*************************************************************************
  //moving walls

  movingWalls = this.physics.add.group({
    defaultKey: 'movingWall'
  });

  //create the walls
  var movingWall1 = movingWalls.create(505, 345, 'movingWall');//32, 21 in tiled
  var movingWall2 = movingWalls.create(736+40, 576+8, 'movingWall');//46, 36 in tiled
  movingWall2.angle = -90;  //2nd wall will be horizontal
  movingWall2.setSize(769, 128, true);  //resize hitbox to be horizontal by swapping width and height of original image dimensions
  

  movingWalls.children.iterate(
    function(movingWall) {
      movingWall.setScale(0.1);
      movingWall.setImmovable();
    });

  this.physics.add.collider(player, movingWalls, hitWall, null, this);
  this.physics.add.collider(asteroids, movingWalls, asteroidHitWall, null, this);


  //make the vertical wall move
  this.tweens.add(
    {
      targets: movingWall1,
      duration: 2000,
      repeat: -1,
      yoyo: true,
      y: '+=208',
      ease: 'Sine.easeIn'
    }
  );

  //make the horizontal wall move
  this.tweens.add(
    {
      targets: movingWall2,
      duration: 2000,
      repeat: -1,
      yoyo: true,
      x: '+=512',
      ease: 'Sine.easeIn'
    }
  );

  //*************************************************************************
  //virus enemies

  virusEnemies = this.physics.add.group({
    defaultKey: 'virusEnemy',
    defaultFrame: 0
  });

  this.physics.add.collider(player, virusEnemies, caughtByVirus, null, this);

  this.anims.create({
      key: 'motion',
      frames: this.anims.generateFrameNumbers('virusEnemy', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
      yoyo: true
  });

  //*************************************************************************
  //sounds

  wallHitSFX = this.sound.add('wallHitSFX'); 
  wallHitInvSFX = this.sound.add('wallHitInvSFX');
  asteroidDestroyedSFX = this.sound.add('asteroidDestroyedSFX');
  asteroidHitWallSFX = this.sound.add('asteroidHitWallSFX');
  fuelSFX = this.sound.add('fuelSFX');
  sampleSFX = this.sound.add('sampleSFX');
  warpSFX = this.sound.add('warpSFX');
  virusSFX = this.sound.add('virusSFX');
  engineSFX = this.sound.add('engineSFX');
  caughtSFX = this.sound.add('caughtSFX');
  invisibleOnSFX = this.sound.add('invisibleOnSFX');
  invisibleOffSFX = this.sound.add('invisibleOffSFX');

  bgMusic = this.sound.add('bgMusic');
  bgMusic.play(
    {
      volume: 0.5,
      loop: true
    }
  );

}



function update() 
{

  //count down for invincibility if have it
  if (timer > 0)
    timer--;

  //clear tint if not invincible
  if (timer == 0)
    player.clearTint();

  //*************************************************************************
  //code from https://gamemechanicexplorer.com/#thrust-2 was used for implementing ship controls, velocity, and drag

  if (cursors.left.isDown) {
    // If the LEFT key is down, rotate left
    player.body.angularVelocity = -ROTATION_SPEED;
  } else if (cursors.right.isDown) {
    // If the RIGHT key is down, rotate right
    player.body.angularVelocity = ROTATION_SPEED;
  } else {
    // Stop rotating
    player.body.angularVelocity = 0;
  }

  if (cursors.up.isDown) {
    // If the UP key is down, thrust
    // Calculate acceleration vector based on this.angle and this.ACCELERATION
    player.body.acceleration.x = Math.cos(player.rotation) * ACCELERATION;
    player.body.acceleration.y = Math.sin(player.rotation) * ACCELERATION;
    player.anims.play('showFlame', true);
    if (engineSFX.isPlaying == false)
      engineSFX.play(
        {
          volume: 1,
          loop: true
        }
      );

  } else {
    // Otherwise, stop thrusting
    player.body.setAcceleration(0, 0);
    player.anims.play('hideFlame', true);
    engineSFX.stop();
  }

  //**************************************
  //virus chase

  //every 5 or 10 interactions with the world will cause a virus to spawn
  //(changes based on difficulty set on title screen)
  if (interactions == maxInteractions)
  {
    virusChase();
  }

  //another idea
  //spawns viruses to chase ship
  //and once time is up they just keep going
  //but once another spawns, they all chase player again
  //requires virusTimer var = 0 at init
  /*if (virusTimer > 0) 
  {
    virusTimer--;

  virusEnemies.children.iterate(
  function(virusEnemy) {
    if (player.x < virusEnemy.x) {
        virusEnemy.setVelocityX(-50);
    } else {
        virusEnemy.setVelocityX(50);
    }
    if (player.y < virusEnemy.y) {
        virusEnemy.setVelocityY(-50);
    } else {
        virusEnemy.setVelocityY(50);
    }  
  });
  }*/

  //have viruses try to locate player. If they do, chase player for certain amount of time then go back to warp and disappear
  virusEnemies.children.iterate(function (virusEnemy) {
    switch ( virusEnemy.custom_state ) {

      //once virus spawns, it will attempt to locate player
      case 'locate':

        //start virus sound at low volume
        if (virusSFX.isPlaying == false)
        {
          virusSFX.play(
            {
              volume: 0.1,
              loop: true
            }
          );
        }

        //IF PLAYER NOT INVISIBLE
        //have virus get close to player, and then do the chase for x seconds
        //will make game harder since is a guarantee it will find player
        if (!invisible)
        {
          console.log("virus will get close to chase");
          //if close enough to player, start the chase
          if (Math.abs(virusEnemy.x - player.x) < 200 && Math.abs(virusEnemy.y - player.y) < 150)
            virusEnemy.custom_state = 'chase';

            //if not close enough, keep getting closer
            else
          {
            if (player.x < virusEnemy.x) {
                virusEnemy.setVelocityX(-50);
            } else {
                virusEnemy.setVelocityX(50);
            }
            if (player.y < virusEnemy.y) {
                virusEnemy.setVelocityY(-50);
            } else {
                virusEnemy.setVelocityY(50);
            }

          }

        }

        //IF PLAYER INVISIBLE
        //go to player's last known location at time of spawn or find them along the way 
        //makes game easier since virus will not chase if not close enough
        else if (invisible)
        {
          console.log("virus will search 1st");
          //go to player's last location at time of spawn
          if (Math.abs(virusEnemy.x - virusEnemy.searchX) > 16 || Math.abs(virusEnemy.y - virusEnemy.searchY) > 16) 
          {
            //see if player was found along the way and begin chase if true
            //and player will no longer be invisible
            if ((Math.abs(virusEnemy.x - player.x) < 100 && Math.abs(virusEnemy.y - player.y) < 50))
            {
              console.log("player located before reaching location");
              invisible = false;
              invisibleOffSFX.play(
                {
                  volume: 1,
                }
              );
              player.setAlpha(1);
              virusEnemy.custom_state = 'chase';
            }

            //keep getting closer to last known player location
            else
            {
              if (virusEnemy.searchX < virusEnemy.x) {
                virusEnemy.setVelocityX(-50);
              } else {
                  virusEnemy.setVelocityX(50);
              }
              if (virusEnemy.searchY < virusEnemy.y) {
                  virusEnemy.setVelocityY(-50);
              } else {
                  virusEnemy.setVelocityY(50);
              }
            }
          }
            
          //once there, chase player if they are nearby or go back to warp if not
          //either way, player will not be invisible anymore
          else 
          {
            console.log("Virus is at last known location");
            console.log("virusenemyx" + virusEnemy.x);
            console.log("virusenemyy" + virusEnemy.y);
              if ((Math.abs(virusEnemy.x - player.x) < 100 && Math.abs(virusEnemy.y - player.y) < 50))
              {
                console.log("player located");
                invisible = false;
                invisibleOffSFX.play(
                  {
                    volume: 1,
                  }
                );
                player.setAlpha(1);
                virusEnemy.custom_state = 'chase';
              }
            else
              {
                console.log("player not located");
                invisible = false;
                invisibleOffSFX.play(
                  {
                    volume: 1,
                  }
                );
                player.setAlpha(1);
                virusSFX.stop();
                virusEnemy.custom_state = 'warpAway';
              }
          }

        }         
          break;


      //virus will chase player for x seconds, then go back to warp.
      //player cannot become invisible when being chased.
      case 'chase':

        //increase virus sound or start playing it at increased sound
        if (virusSFX.isPlaying == false && !caught)
        {
          virusSFX.play(
            {
              volume: 1,
              loop: true
            }
          );
        }
        else
          virusSFX.setVolume(1);

        //have the virus chase for x seconds (and player can't become invisible)
        if (virusEnemy.custom_state_timer > 0) 
        {
          if (invisible == true)
          {
            invisibleOffSFX.play(
              {
                volume: 1,
              }
            );
            invisible = false;
            player.setAlpha(1);
          }
            
            virusEnemy.custom_state_timer--;

          if (player.x < virusEnemy.x) {
              virusEnemy.setVelocityX(-50);
          } else {
              virusEnemy.setVelocityX(50);
          }
          if (player.y < virusEnemy.y) {
              virusEnemy.setVelocityY(-50);
          } else {
              virusEnemy.setVelocityY(50);
          }
        } 
        else 
        {
            virusSFX.stop();
            invisible = false;
            invisibleOffSFX.play(
              {
                volume: 1,
              }
            );
            player.setAlpha(1);
            virusEnemy.custom_state = 'warpAway';

        }
        break;

      //virus goes back to warp
      case 'warpAway':  

        //if at warp, disappear
        if (Math.abs(virusEnemy.x - warpPoint.x) <= 5 && Math.abs(virusEnemy.y - warpPoint.y) <= 5)
        {
          //console.log("virus gone");      
          virusEnemy.disableBody(true, true);//destroy() gives errors sometimes
        }

        //go to warp if not there yet
        else
        {
          if (warpPoint.x < virusEnemy.x) {
              virusEnemy.setVelocityX(-50);
          } else {
              virusEnemy.setVelocityX(50);
          }
          if (warpPoint.y < virusEnemy.y) {
              virusEnemy.setVelocityY(-50);
          } else {
              virusEnemy.setVelocityY(50);
          }
        }
        break;
    }
  });


  //*****************************************
  //game over if no fuel
  
  if (fuelRemaining == 0) 
  {
    //this.sound.stopAll();
    if (virusSFX.isPlaying)
      virusSFX.stop();

    if (engineSFX.isPlaying)
      engineSFX.stop();
    
    bgMusic.stop();
    this.scene.start('gameover');
    
  }
  
}


//************************************************************
//Functions


/*
Called when player hits wall.
Causes player to lose 1 fuel and become invincible if not invincible,
or if already invincible, just play SFX
Parameters: player, wall that was hit
*/
function hitWall(player, wall) 
{
  wallHitSFX.play(
    {
      volume: 1,
    }
  );
  
  //if dont have invincibility, lose fuel and become invincible
  if (timer == 0) 
  {
    interactions++;
    fuelRemaining--;
    fuelText.setText('FUEL TANKS: ' + fuelRemaining);

    //temp invincibility
    player.setTint(0xff0000);
    timer = 30 * INVINCIBILITY_TIME;
  }
  else
  {
    wallHitInvSFX.play(
      {
        volume: 1,
      }
    );
    console.log("invincible hitwall");
    
  }

}



/*
Called when player collects sample.
Makes sample disappear and increases samplesCollected.
Parameters: player, sample that player collided with
*/
function collectSample(player, sample) 
{

  sampleSFX.play(
    {
      volume: 1,
    }
  );
  
  sample.disableBody(true, true);
  samplesCollected++;
  sampleText.setText('SAMPLES: ' + samplesCollected + '/' + MAX_SAMPLES);
  interactions++;
}



/*
Called when player collects fuel.
Makes fuel disappear and increases fuelRemaining if not at max.
Parameters: player, fuel tank player collided with
*/
function collectFuel(player, fuelTank) 
{

  fuelSFX.play(
    {
      volume: 1,
    }
  );
  
  fuelTank.disableBody(true, true);

  if (fuelRemaining < MAX_FUEL)//player cant exceed max fuel
  {
    fuelRemaining++;
    fuelText.setText('FUEL TANKS: ' + fuelRemaining);
  }
  interactions++;
}


/*
Called when player goes into warp point.
Starts gameover scene.
*/
function useWarp(player, warpPoint) 
{

  warpSFX.play(
    {
      volume: 1,
    }
  );
  
  bgMusic.stop();
  this.scene.start('gameover');
}



/*
Called when player hits asteroid.
Gives player invincibility and decreases their fuel if not already invincible.
Respawns asteroid elsewhere.
Parameters: player, asteroid that hit player
*/
function hitAsteroid(player, asteroid) 
{
  //destroy asteroid
  asteroid.disableBody(true, true);

  asteroidDestroyedSFX.play(
    {
      volume: 1,
    }
  );

  //lose fuel if not invincible, then become invincible
  if (timer == 0) {
    fuelRemaining--;
    fuelText.setText('FUEL TANKS: ' + fuelRemaining);

    //temp invincibility
    player.setTint(0xff0000);
    timer = 30 * INVINCIBILITY_TIME;
  }

  interactions++;

  //respawn asteroid
  //should be ok if asteroids spawn in walls since they'll move out of it
  var x = Phaser.Math.Between(0, 99 * 16);
  var y = Phaser.Math.Between(0, 99 * 16);
  asteroid.enableBody(true, x, y, true, true)
  asteroid.setVelocity(50);

}



//Called when asteroid hits wall.
//Parameters: asteroid that touched a wall, wall that was touched
function asteroidHitWall(asteroid, wall) 
{
  //only play sound if close enough to player (otherwise will be too noisy)
  if (Math.abs(asteroid.x - player.x) < 200 && Math.abs(asteroid.y - player.y) < 150)
  {
    asteroidHitWallSFX.play(
      {
        volume: 1,
      }
    );
  }
  
}



/*
Called in update loop when 5 or 10 interactions are made by player (hitting walls, asteroids, or collecting fuel or samples).
Resets interactions, spawns a virus at warp and sets it in locate mode. 
The place the virus will search if player is invisible is set here. A switch statement in the update loop handles its behavior. 
*/
function virusChase()
{
  interactions = 0;//reset interaction count

  //spawn virus at warp point
  var virusEnemy = virusEnemies.create(warpPoint.x, warpPoint.y, 'virusEnemy');

  //scale and hitbox resize
  virusEnemy.setScale(1.3);
  virusEnemy.setCircle(9, 0, 0);

  virusEnemy.anims.play('motion', true);

  //virus will try to locate player first.
  //if found, will chase for x seconds
  virusEnemy.custom_state = 'locate';
  virusEnemy.custom_state_timer = 30 * 20;//30 is framerate, 20 is seconds?

  //set last location player was at
  //virus will search here if player is or becomes invisible
  virusEnemy.searchX = player.x;
  virusEnemy.searchY = player.y;
  console.log("searchx" + virusEnemy.searchX);
  console.log("searchy" + virusEnemy.searchY);

  /*if (virusSFX.isPlaying == false)
  {
    virusSFX.isPlaying = true;
    virusSFX.play(
      {
        volume: 0.1,
        loop: true
      }
    );
  }*/
}



//Called if player is caught by virus (instant game over)
//Parameters: virus that touched player, player
function caughtByVirus(virusEnemy, player)
{ 
  caught = true;
  virusEnemy.disableBody(true, true);
  this.sound.stopAll();
  caughtSFX.play(
    {
      volume: 1,
    }
  );
  this.scene.start('gameover');
}


/*
Called whenever spacebar is pressed. Lets player spend 2 fuel to become
invisible (makes virus enemies easier to avoid). 
*/
function invisibleMode()
{
  //>= makes it possible for player to get themselves to 0 fuel if not paying attention to fuel level
  //play explode sound if player gets to 0 fuel from this
  if (fuelRemaining >= 2 && !invisible)
  {
    
    invisibleOnSFX.play(
      {
        volume: 1,
      }
    );
    
    //play explode sound if player gets to 0 fuel from this
    if (fuelRemaining == 2)
    {
      asteroidDestroyedSFX.play(
        {
          volume: 1,
        }
      );
    }
    
    fuelRemaining -= 2;
    fuelText.setText('FUEL TANKS: ' + fuelRemaining);
    console.log("Invisible");
    player.setAlpha(0.5); 
    invisible = true;
  }
  else
    console.log("Not enough fuel");

}


let mygame = new Phaser.Game(config);
     