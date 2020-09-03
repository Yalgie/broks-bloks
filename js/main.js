//...................................................
//.VVVV....VVVVV..AAAA.....AARRRRRRRRR....SSSSSSS....
//.VVVV....VVVV..AAAAAA....AARRRRRRRRRR..RSSSSSSSS...
//.VVVV....VVVV..AAAAAA....AARRRRRRRRRR.RRSSSSSSSSS..
//.VVVVV..VVVV...AAAAAAA...AARR....RRRR.RRSS...SSSS..
//..VVVV..VVVV..AAAAAAAA...AARR....RRRR.RRSSS........
//..VVVV..VVVV..AAAAAAAA...AARRRRRRRRRR..RSSSSSS.....
//..VVVVVVVVV...AAAA.AAAA..AARRRRRRRRR....SSSSSSSS...
//...VVVVVVVV..VAAAAAAAAA..AARRRRRRR........SSSSSSS..
//...VVVVVVVV..VAAAAAAAAAA.AARR.RRRRR..........SSSS..
//...VVVVVVV..VVAAAAAAAAAA.AARR..RRRRR..RRSS...SSSS..
//....VVVVVV..VVAA....AAAA.AARR...RRRRR.RRSSSSSSSSS..
//....VVVVVV..VVAA....AAAAAAARR....RRRR..RSSSSSSSSS..
//....VVVVV..VVVAA.....AAAAAARR.....RRRR..SSSSSSS....
//...................................................
var gameMethods = {
    "init": init,
    "preload": preload,
    "create": create,
    "update": update,
    "render": render
};

var blockSize = 8;
var headerHeight = 5;
var stageHeight = 22;
var footerHeight = 4;
var gameHeight = headerHeight + stageHeight + footerHeight;
var gameWidth = 16;
var stageWidth = gameWidth;
var ggwp = false;
var score = 0;
var rotatePos = 0;
var movementKeyDown = false;
var angryMode = false;
var game = new Phaser.Game(
    (blockSize * gameWidth),
    (blockSize * gameHeight) - blockSize / 2,
    Phaser.CANVAS,
    "wrapper",
    gameMethods,
    false,
    true
);

var blocks = [
    [ // T
        [
            [[0, 1], 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0, 1], 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [[1, 0], 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [[0, 1], 1, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ], 
    [ // I
        [
            [[1,0], 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [[0,2], 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ],
        [
            [[2,0], 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [[0,1], 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]
    ],
    [ // O
        [
            [[0,1], 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 1],
            [0, 1, 1],
            [0, 0, 0]
        ]
    ],
    [ // J
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ],
        [
            [[1,0], 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [[0,1], 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ]
    ],
    [ // L
        [
            [[0,2], 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        [
            [[1,0], 0, 0],
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]
    ],
    [ // Z
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [[0,2], 0, 1],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [[1,0], 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [[0,1], 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ]
    ],
    [ // S
        [
            [[0,1], 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        [
            [[0,1], 1, 0],
            [0, 1, 1],
            [0, 0, 1]
        ],
        [
            [[1,1], 0, 0],
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ]
];
var grid = [];
var nextGrid = [];
var movement = [];
var current = [];
var gamePaused = false;
var blockColor;
var activeBlock;
var nextBlockColour;
var nextBlock = null;
var blueBorder;
var redBorder;
var logo;
var starting1 = false;
var starting2 = false;
var resetting = false;
// Timer/Interval Vars
var slamTimer;
var slamTimerInterval = 25;

var dropTimer;
var dropTimerInterval = 500;

var angryDropTimer;
var angryDropTimerInterval = 250;

var modeSwapTimer;
var modeSwapTimerInterval = 20000;

var movementHoldTimer;
var movementHoldInterval = 100;
var movementHoldAllowed = true;
var movementHoldDelay = 150;

var countdownInterval = 1000;
var glowTimerInterval = 750;

var blockFlashInterval = 75;

var btnClickDelay = 250;

var gameTimer;
var gameTimerInterval = Phaser.Timer.SECOND;
var gameTimerS = 0;
var gameTimerM = 0;

// Overlays
var introOverlay;
var outroOverlay;
var pauseOverlay;
var instructions;
var instructionsOverlay;
var slamOverlay;
var slamOverlayHeight;

// Animations
var logo;
var logoAni;
var transition;
var transitionAni;

// Misc
var colliding = false;
var gameStarted = false;
var slamming = false;
var slamStart;
var slamEnd;
var slamTotal = 0;

var timeText;
var timeTextActual;
var scoreText;
var scoreTextActual;
var nextBlockText;
var yourScoreText;

var brocSleep;
var brocSleepAni;
var brocIdle;
var brocIdleAni;
var brocBloks;
var brocBloksAni;
var gameOverTex;
var gameOverTextAni;

var normalAdd = 10; // only happens on normal drop collide when no smash
var slamAdd = 1; // this is multipled by slam amount 160 - 8
var rowAdd = 500; // times by the amount of rows matched

// Scores are multiples by 2 if mode === angryu

var pauseBtn;
var paused;
var musicBtn;
var sfxBtn;
var creditsBtn;
var infoBtn;
var resumeBtn;
var coffeeBtn;

var sfxOn = true;
var musicOn = true;

var kofiURL = "https://ko-fi.com/thecodingforge";
var brocAniSlam = false;
var canStart = false;
var instructionsDone = false;

var audioSleep;
var audioSleepTrans;
var audioAngry;
var sfxClick;
var sfxCollide;
var sfxGameover;
var sfxMove;
var sfxRotate;
var sfxSlamEnd;
var sfxSlamStart;
var sfxMuted = false;
var musicMuted = false;
var audioVolume = 0.6;
var musicCache;
var sfxCache;
var musicIntroFresh;
var tapPlaying = false;
var stopTapToPlay = false;

function init() {
    game.world.bounds.x = -(blockSize / 2);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.renderer.renderSession.roundPixels = true;
    game.stage.backgroundColor = "#181425";
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function preload() {
    game.load.image('block-1', 'assets/sprites/block-1.png');
    game.load.image('block-2', 'assets/sprites/block-2.png');
    game.load.image('block-3', 'assets/sprites/block-3.png');
    game.load.image('block-4', 'assets/sprites/block-4.png');
    game.load.image('block-5', 'assets/sprites/block-5.png');
    game.load.image('block-flash-1', 'assets/sprites/block-10.png');
    game.load.image('block-flash-2', 'assets/sprites/block-6.png');
    game.load.image('node', 'assets/sprites/block-7.png');
    game.load.image('glow-1', 'assets/sprites/block-8.png');
    game.load.image('glow-2', 'assets/sprites/block-9.png');
    game.load.image('glow-3', 'assets/sprites/block-11.png');
    game.load.image('glow-4', 'assets/sprites/block-12.png');
    game.load.image('instructions', 'assets/sprites/instruction_128x224_desktop.png');
    game.load.image('buffer', 'assets/sprites/buffer.png');
    game.load.image('paused', 'assets/sprites/paused.png');
    // game.load.image('quit', 'assets/sprites/btn_quit.png');

    // Spritesheets
    // game.load.spritesheet('pause', 'assets/sprites/btn_pause_47x13.png', 47, 13, 5);
    // game.load.spritesheet('fakku', 'assets/sprites/btn_fuckYou.png', 108, 28, 2);
    game.load.spritesheet('gameover', 'assets/sprites/gameOver_79xXX.png', 79, 15, 2);
    game.load.spritesheet('nomnom', 'assets/sprites/transition_teeth_140x248.png', 140, 248, 16);
    game.load.spritesheet("explosion", 'assets/sprites/explosion_16x8.png', 16, 8, 3);
    game.load.spritesheet('brock-sleep', 'assets/sprites/brok_sleep.png', 93, 40, 19);
    game.load.spritesheet('brock-angry', 'assets/sprites/brok_tantrum_93x40.png', 93, 40, 120);
    game.load.spritesheet('border-1', 'assets/sprites/border-1.png', 4, 4, 9);
    game.load.spritesheet('border-2', 'assets/sprites/border-2.png', 4, 4, 9);
    game.load.spritesheet('title', 'assets/sprites/titleAnimation_128x224_desktop.png', 128, 224, 54);
    game.load.spritesheet('btn-pause', 'assets/sprites/btn_pause_esc_19x18.png', 19, 20, 2);
    game.load.spritesheet('btn-music', 'assets/sprites/btn_music_48x66.png', 48, 66, 2);
    game.load.spritesheet('btn-info', 'assets/sprites/btn_i_27x23.png', 27, 23, 2);
    game.load.spritesheet('btn-credits', 'assets/sprites/btn_credits_69x23.png', 69, 23, 2);
    game.load.spritesheet('btn-coffee', 'assets/sprites/btn_coffee_104x34.png', 104, 34, 7);
    game.load.spritesheet('btn-resume', 'assets/sprites/btn_resume_104x34.png', 104, 34, 2);
    game.load.spritesheet('btn-restart', 'assets/sprites/btn_restart_104x34.png', 104, 34, 2);
    game.load.spritesheet('btn-sfx', 'assets/sprites/btn_sounds_48x66.png', 48, 66, 2);
    
    game.load.spritesheet('broks-bloks', 'assets/sprites/block_bounce.png', 24, 40, 6);

    // Audio & SFX
    // game.load.audio('audio-sleeping', ['assets/audio/sleep.mp3']);
    // game.load.audio('audio-sleepingTrans', ['assets/audio/trans.mp3']);
    // game.load.audio('audio-angry', ['assets/audio/angry.mp3']);

    // game.load.audio('sfx-click', ['assets/audio/sfx/click.mp3']);
    // game.load.audio('sfx-collide', ['assets/audio/sfx/collide.mp3']);
    // game.load.audio('sfx-gameover', ['assets/audio/sfx/gameover.mp3']);
    // game.load.audio('sfx-move', ['assets/audio/sfx/move.mp3']);
    // game.load.audio('sfx-rotate', ['assets/audio/sfx/rotate.mp3']);
    // game.load.audio('sfx-slamEnd', ['assets/audio/sfx/slamEnd.mp3']);
    // game.load.audio('sfx-slamStart', ['assets/audio/sfx/slamStart.mp3']);




    /*
        SFX/Music Map 
        
        Screen Load -- music-intro-v1


        Logo (Font) - sfx-intro-title [x]
        Logo (Letters) - sfx-intro-letters [x]
        Chomp - sfx-crunch-intro [x]
        Tap To Play - sfx-intro-tap-to-play [x]

        *Tap/Click* 

        Trans Chomp
        Countdown 3
        Countdown 2
        Countdown 1
        Countdown GO

        Block Spawn
        Brok Snore


    */



    game.load.audio('sfx-crunch-intro', ['assets/audio/Crunch Intro.mp3']);
    game.load.audio('sfx-intro-title', ['assets/audio/Intro Tittle Sound.mp3']);
    game.load.audio('sfx-intro-letters', ['assets/audio/Letters Dropping intro.mp3']);
    game.load.audio('sfx-intro-tap-to-play', ['assets/audio/Tap To Play.mp3']);

    game.load.audio('sfx-block-going-down', ['assets/audio/Block Going Down.mp3']);
    game.load.audio('sfx-block-on-place', ['assets/audio/Block On Place.mp3']);
    game.load.audio('sfx-block-drop', ['assets/audio/Drop.mp3']);
    game.load.audio('sfx-block-match-v2', ['assets/audio/Match 2.mp3']);
    game.load.audio('sfx-block-move-right-easy', ['assets/audio/R Move Easy Part.mp3']);
    game.load.audio('sfx-block-move-right-hard', ['assets/audio/R Move Hard Part.mp3']);
    game.load.audio('sfx-block-move-left-easy', ['assets/audio/L Move Easy Part.mp3']);
    game.load.audio('sfx-block-move-left-hard', ['assets/audio/L Move Hard Part.mp3']);
    game.load.audio('sfx-block-rotation', ['assets/audio/Rotation.mp3']);
    game.load.audio('sfx-block-slam-v2', ['assets/audio/Slam 2.mp3']);
    game.load.audio('sfx-block-slam-v1', ['assets/audio/Slam.mp3']);

    game.load.audio('sfx-button-click', ['assets/audio/Botton Clicks.mp3']);
    game.load.audio('sfx-pause-close-v1', ['assets/audio/Close Pause 1.mp3']);
    game.load.audio('sfx-pause-open-v1', ['assets/audio/Open Pause 1.mp3']);
    game.load.audio('sfx-countdown', ['assets/audio/3 2 1 GO!.mp3']);

    game.load.audio('sfx-brok-crash', ['assets/audio/Dinosaur Crash.mp3']);
    game.load.audio('sfx-brok-crunch-mad', ['assets/audio/Dinosaur Crunch when mad.mp3']);
    game.load.audio('sfx-brok-spin', ['assets/audio/Dinosaur Spinning.mp3']);
    game.load.audio('sfx-brok-snore-v1', ['assets/audio/Snoring 1.mp3']);
    game.load.audio('sfx-brok-snore-v2', ['assets/audio/Snoring 2.mp3']);
    game.load.audio('sfx-brok-snore-v3', ['assets/audio/Snoring 3.mp3']);
    game.load.audio('sfx-brok-snore-v4', ['assets/audio/Snoring 4.mp3']);



    game.load.audio('music-intro-reset', ['assets/audio/Music - Intro Coming from game over.mp3']);
    game.load.audio('music-intro-fresh', ['assets/audio/Music - Intro only once.mp3']);
    game.load.audio('music-intro-a1', ['assets/audio/Music - Intro A1.mp3']);
    game.load.audio('music-a1-a2', ['assets/audio/Music - A1 and A2.mp3']);
    game.load.audio('music-a-b', ['assets/audio/Music - A to B.mp3']);
    game.load.audio('music-b', ['assets/audio/Music - B.mp3']);
    game.load.audio('music-game-over', ['assets/audio/Music - Game Over.mp3']);
    game.load.audio('sfx-crunch', ['assets/audio/Crunch.mp3']);

    

    // Fonts
    game.load.bitmapFont(
        'fontBlue',
        'assets/fonts/pixelTimeBlue.png',
        'assets/fonts/pixelTimeBlue.fnt'
    );
    game.load.bitmapFont(
        'fontWhite',
        'assets/fonts/pixelTimeWhite.png',
        'assets/fonts/pixelTimeWhite.fnt'
    );
}

//...........................................................................
//....CCCCCCC....RRRRRRRRRR...EEEEEEEEEEE....AAAAA...AATTTTTTTTTTEEEEEEEEEE..
//...CCCCCCCCC...RRRRRRRRRRR..EEEEEEEEEEE....AAAAA...AATTTTTTTTTTEEEEEEEEEE..
//..CCCCCCCCCCC..RRRRRRRRRRR..EEEEEEEEEEE...AAAAAA...AATTTTTTTTTTEEEEEEEEEE..
//..CCCC...CCCCC.RRRR...RRRRR.EEEE..........AAAAAAA......TTTT...TEEE.........
//.CCCC.....CCC..RRRR...RRRRR.EEEE.........AAAAAAAA......TTTT...TEEE.........
//.CCCC..........RRRRRRRRRRR..EEEEEEEEEE...AAAAAAAA......TTTT...TEEEEEEEEEE..
//.CCCC..........RRRRRRRRRRR..EEEEEEEEEE...AAAA.AAAA.....TTTT...TEEEEEEEEEE..
//.CCCC..........RRRRRRRR.....EEEEEEEEEE..AAAAAAAAAA.....TTTT...TEEEEEEEEEE..
//.CCCC.....CCC..RRRR.RRRR....EEEE........AAAAAAAAAAA....TTTT...TEEE.........
//..CCCC...CCCCC.RRRR..RRRR...EEEE........AAAAAAAAAAA....TTTT...TEEE.........
//..CCCCCCCCCCC..RRRR..RRRRR..EEEEEEEEEEEEAAA....AAAA....TTTT...TEEEEEEEEEE..
//...CCCCCCCCCC..RRRR...RRRRR.EEEEEEEEEEEEAAA.....AAAA...TTTT...TEEEEEEEEEE..
//....CCCCCCC....RRRR....RRRR.EEEEEEEEEEEEAAA.....AAAA...TTTT...TEEEEEEEEEE..
//...........................................................................
function create() {
    createPause();
    createAudio();
    createBrok();
    
    createKeyBindings();
    createGrid();
    createGroups();
    createBorders();
    createTimers();
    createTransition();
    createCountdown();
    createIntro();
    createOutro();
    
    createSlamOverlay();
    createText();
    
    
    // startGame();
    showIntro();

    game.world.bringToTop(introOverlay);
    game.world.bringToTop(logo);
}

//......................................................
//.BBBBBBBBBB...RRRRRRRRRR.....OOOOOOO.....KKKK...KKKK..
//.BBBBBBBBBBB..RRRRRRRRRRR...OOOOOOOOOO...KKKK..KKKKK..
//.BBBBBBBBBBB..RRRRRRRRRRR..OOOOOOOOOOOO..KKKK.KKKKK...
//.BBBB...BBBB..RRRR...RRRRR.OOOOO..OOOOO..KKKKKKKKK....
//.BBBB...BBBB..RRRR...RRRRRROOOO....OOOOO.KKKKKKKK.....
//.BBBBBBBBBBB..RRRRRRRRRRR.ROOO......OOOO.KKKKKKKK.....
//.BBBBBBBBBB...RRRRRRRRRRR.ROOO......OOOO.KKKKKKKK.....
//.BBBBBBBBBBB..RRRRRRRR....ROOO......OOOO.KKKKKKKKK....
//.BBBB....BBBB.RRRR.RRRR...ROOOO....OOOOO.KKKK.KKKKK...
//.BBBB....BBBB.RRRR..RRRR...OOOOO..OOOOO..KKKK..KKKK...
//.BBBBBBBBBBBB.RRRR..RRRRR..OOOOOOOOOOOO..KKKK..KKKKK..
//.BBBBBBBBBBB..RRRR...RRRRR..OOOOOOOOOO...KKKK...KKKK..
//.BBBBBBBBBB...RRRR....RRRR....OOOOOO.....KKKK...KKKK..
//......................................................


function createBrok() {
    brocSleep = game.add.sprite(-6, (blockSize*2) + 2, 'brock-sleep');
    brocSleepAni = brocSleep.animations.add('sleep');

    brocIdle = game.add.sprite(-6, (blockSize*2) + 2, 'brock-angry');
    brocIdleAni = brocIdle.animations.add('idle');

    brocBloks = game.add.sprite(brocSleep.width - (blockSize + 4), blockSize + 2, 'broks-bloks');
    brocBloksAni = brocBloks.animations.add('bounce');

    brocSleep.anchor.y = 0.5;
    brocSleep.anchor.x = 0;
    brocIdle.anchor.y = 0.5;
    brocIdle.anchor.x = 0;
    brocBloks.anchor.y = 0.5;
    brocBloks.anchor.x = 0;

    brocBloks.alpha = 0;
    brocIdle.alpha = 0;
}

//............................................................
//.....AAAAA.....UUUU...UUUU..DDDDDDDDD...IIIII...OOOOOOO.....
//.....AAAAA.....UUUU...UUUU..DDDDDDDDDD..IIIII..OOOOOOOOOO...
//....AAAAAA.....UUUU...UUUU..DDDDDDDDDDD.IIIII.OOOOOOOOOOOO..
//....AAAAAAA....UUUU...UUUU..DDDD...DDDD.IIIII.OOOOO..OOOOO..
//...AAAAAAAA....UUUU...UUUU..DDDD....DDDDIIIIIOOOOO....OOOO..
//...AAAAAAAA....UUUU...UUUU..DDDD....DDDDIIIIIOOOO......OOO..
//...AAAA.AAAA...UUUU...UUUU..DDDD....DDDDIIIIIOOOO......OOO..
//..AAAAAAAAAA...UUUU...UUUU..DDDD....DDDDIIIIIOOOO......OOO..
//..AAAAAAAAAAA..UUUU...UUUU..DDDD....DDDDIIIIIOOOOO....OOOO..
//..AAAAAAAAAAA..UUUU...UUUU..DDDD...DDDDDIIIII.OOOOO..OOOOO..
//.AAAA....AAAA..UUUUUUUUUUU..DDDDDDDDDDD.IIIII.OOOOOOOOOOOO..
//.AAAA.....AAAA..UUUUUUUUU...DDDDDDDDDD..IIIII..OOOOOOOOOO...
//.AAAA.....AAAA...UUUUUUU....DDDDDDDDD...IIIII....OOOOOO.....
//............................................................

function createAudio() {
    // audioSleep = game.add.audio('audio-sleeping');
    // audioSleepTrans = game.add.audio('audio-sleepingTrans');
    // audioAngry = game.add.audio('audio-angry');
    // sfxClick = game.add.audio('sfx-click');
    // sfxCollide = game.add.audio('sfx-collide');
    // sfxGameover = game.add.audio('sfx-gameover');
    // sfxMove = game.add.audio('sfx-move');
    // sfxRotate = game.add.audio('sfx-rotate');
    // sfxSlamEnd = game.add.audio('sfx-slamEnd');
    // sfxSlamStart = game.add.audio('sfx-slamStart');

    // sfxMove.volume = 0.5;



    
    
    
    

    sfxIntroTitle = game.add.audio('sfx-intro-title');
    sfxIntroLetters = game.add.audio('sfx-intro-letters');
    sfxIntroCrunch = game.add.audio('sfx-crunch-intro');
    sfxIntroTapToPlay = game.add.audio('sfx-intro-tap-to-play');
    sfxButtonClick = game.add.audio('sfx-button-click');
    sfxCrunch = game.add.audio('sfx-crunch');
    sfxCountdown123Go = game.add.audio('sfx-countdown');

    sfxBlockMoveLeftEasy = game.add.audio('sfx-block-move-left-easy');
    sfxBlockMoveLeftHard = game.add.audio('sfx-block-move-left-hard');
    sfxBlockMoveRightEasy = game.add.audio('sfx-block-move-right-easy');
    sfxBlockMoveRightHard = game.add.audio('sfx-block-move-right-hard');
    sfxBlockMoveDown = game.add.audio('sfx-block-going-down');
    sfxBlockSlamStart = game.add.audio('sfx-block-drop');
    sfxBlockSlamEnd = game.add.audio('sfx-block-slam-v1'); // v1/v2
    sfxBlockRotate = game.add.audio('sfx-block-rotation');
    sfxBlockCollide = game.add.audio('sfx-block-on-place');
    sfxBlockMatch = game.add.audio('sfx-block-match-v2'); // v1/v2
    
    sfxPauseOpen = game.add.audio('sfx-pause-open-v1');
    sfxPauseClose = game.add.audio('sfx-pause-close-v1');

    sfxBrokCrash = game.add.audio('sfx-brok-crash');
    sfxBrokCrunch = game.add.audio('sfx-brok-crunch-mad');
    sfxBrokSpin = game.add.audio('sfx-brok-spin');
    sfxBrokSnore = game.add.audio('sfx-brok-snore-v1');

    
    
    

    musicIntroFresh = game.add.audio('music-intro-fresh');
    musicA1toA2 = game.add.audio('music-a1-a2');
    musicAtoB = game.add.audio('music-a-b');
    musicB = game.add.audio('music-b');
    musicIntroA1 = game.add.audio('music-intro-a1');
    musicIntroReset = game.add.audio('music-intro-reset');
    musicGameOver = game.add.audio('music-game-over');
    


    





// sfx-pause-close-v1
// sfx-pause-open-v1



    musicCache = JSON.parse(localStorage.getItem("brok-music"));
    sfxCache = JSON.parse(localStorage.getItem("brok-sfx"));

    if (musicCache !== null && !musicCache) {
        musicMuted = true;
        musicBtn.play('down');
        musicOn = false;
    }

    if (sfxCache !== null && !sfxCache) {
        sfxMuted = true;
        sfxBtn.play('down');
        sfxOn = false;
    }

    // audioSleep.loopFull(audioVolume);
}

function muteAudio() {
    // audioSleep.volume = 0;
    // audioSleepTrans.volume = 0;
    // audioAngry.volume = 0;
    // audioVolume = 0;
}

function unmuteAudio() {
    // audioVolume = 0.6;
    // audioSleep.volume = audioVolume;
    // audioSleepTrans.volume = audioVolume;
    // audioAngry.volume = audioVolume;
}

//...................................................
//.KKKK...KKKKK.EEEEEEEEEEEEEYY....YYYY..SSSSSSS.....
//.KKKK..KKKKK..EEEEEEEEEEEEEYYY..YYYYY.YSSSSSSSS....
//.KKKK.KKKKK...EEEEEEEEEEE.EYYY..YYYY..YSSSSSSSSS...
//.KKKKKKKKK....EEEE........EYYYYYYYY..YYSSS..SSSS...
//.KKKKKKKK.....EEEE.........YYYYYYYY..YYSSS.........
//.KKKKKKKK.....EEEEEEEEEE....YYYYYY....YSSSSSS......
//.KKKKKKKK.....EEEEEEEEEE....YYYYYY.....SSSSSSSSS...
//.KKKKKKKKK....EEEEEEEEEE.....YYYY........SSSSSSS...
//.KKKK.KKKKK...EEEE...........YYYY...........SSSSS..
//.KKKK..KKKK...EEEE...........YYYY....YYSS....SSSS..
//.KKKK..KKKKK..EEEEEEEEEEE....YYYY....YYSSSSSSSSSS..
//.KKKK...KKKKK.EEEEEEEEEEE....YYYY.....YSSSSSSSSS...
//.KKKK...KKKKK.EEEEEEEEEEE....YYYY......SSSSSSSS....
//...................................................
function createKeyBindings() {
    kb = game.input.keyboard.createCursorKeys();
    rotate = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    swap = game.input.keyboard.addKey(Phaser.Keyboard.Q);

    game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.Z,
        Phaser.Keyboard.Q,
        Phaser.Keyboard.SPACEBAR
    ]);

    // hammertime = new Hammer(document.getElementById("wrapper"));
    // hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
}

//................................................
//.....GGGGGGG....RRRRRRRRRR..IIIII.DDDDDDDDD.....
//...GGGGGGGGGG...RRRRRRRRRRR.IIIII.DDDDDDDDDD....
//..GGGGGGGGGGGG..RRRRRRRRRRR.IIIII.DDDDDDDDDDD...
//..GGGGG..GGGGG..RRRR...RRRRRIIIII.DDDD...DDDD...
//.GGGGG....GGG...RRRR...RRRRRIIIII.DDDD....DDDD..
//.GGGG...........RRRRRRRRRRR.IIIII.DDDD....DDDD..
//.GGGG..GGGGGGGG.RRRRRRRRRRR.IIIII.DDDD....DDDD..
//.GGGG..GGGGGGGG.RRRRRRRR....IIIII.DDDD....DDDD..
//.GGGGG.GGGGGGGG.RRRR.RRRR...IIIII.DDDD....DDDD..
//..GGGGG....GGGG.RRRR..RRRR..IIIII.DDDD...DDDDD..
//..GGGGGGGGGGGG..RRRR..RRRRR.IIIII.DDDDDDDDDDD...
//...GGGGGGGGGG...RRRR...RRRRRIIIII.DDDDDDDDDD....
//.....GGGGGGG....RRRR....RRRRIIIII.DDDDDDDDD.....
//................................................
function createGrid() {
    for (var i = 0; i < (stageHeight); i++) {
        grid.push([]);
    }

    grid.map(function (row) {
        for (var i = 0; i < (stageWidth - 1); i++) {
            row.push({
                state: "empty"
            });
        }
    })

    grid.map(function (row, y) {
        row.map(function (col, x) {
            if (y < 3) {
                var node = game.add.image(
                    (x * blockSize),
                    ((y * blockSize) + (blockSize * headerHeight)),
                    'buffer'
                );
                // node.alpha = 0.5;
            }
            else {
                var node = game.add.image(
                    (x * blockSize),
                    ((y * blockSize) + (blockSize * headerHeight)),
                    'node'
                );
            }
            
            col.node = node;
        })
    })

    createNextGrid();
}

function createNextGrid() {
    for (var i = 0; i <= 2; i++) {
        nextGrid.push([]);
    }

    nextGrid.map(function (row) {
        for (var i = 0; i <= 3; i++) {
            row.push({
                state: "empty"
            });
        }
    })

    nextGrid.map(function (row, y) {
        row.map(function (col, x) {
            var node = game.add.image(
                (((gameWidth - 5) * blockSize) + 2) + (x * blockSize),
                (((y + 2) * blockSize) - 2),
                'node'
            );

            col.node = node;
        })
    })
}

//...................................................................
//...SSSSSSS......CCCCCCC......OOOOOOO.....RRRRRRRRRR...EEEEEEEEEEE..
//..SSSSSSSSS....CCCCCCCCC....OOOOOOOOOO...RRRRRRRRRRR..EEEEEEEEEEE..
//..SSSSSSSSSS..CCCCCCCCCCC..OOOOOOOOOOOO..RRRRRRRRRRR..EEEEEEEEEEE..
//.SSSSS..SSSS..CCCC...CCCCC.OOOOO..OOOOO..RRRR...RRRRR.EEEE.........
//.SSSSS.......SCCC.....CCC.COOOO....OOOOO.RRRR...RRRRR.EEEE.........
//..SSSSSSS....SCCC.........COOO......OOOO.RRRRRRRRRRR..EEEEEEEEEE...
//...SSSSSSSSS.SCCC.........COOO......OOOO.RRRRRRRRRRR..EEEEEEEEEE...
//.....SSSSSSS.SCCC.........COOO......OOOO.RRRRRRRR.....EEEEEEEEEE...
//........SSSSSSCCC.....CCC.COOOO....OOOOO.RRRR.RRRR....EEEE.........
//.SSSS....SSSS.CCCC...CCCCC.OOOOO..OOOOO..RRRR..RRRR...EEEE.........
//.SSSSSSSSSSSS.CCCCCCCCCCC..OOOOOOOOOOOO..RRRR..RRRRR..EEEEEEEEEEE..
//..SSSSSSSSSS...CCCCCCCCCC...OOOOOOOOOO...RRRR...RRRRR.EEEEEEEEEEE..
//...SSSSSSSS.....CCCCCCC.......OOOOOO.....RRRR....RRRR.EEEEEEEEEEE..
//...................................................................
function updateScore(type, multi) {
    var add = 0;

    if (type === "normal") {
        add += normalAdd;
    }
    else if (type === "slam") {
        add += (slamAdd * multi);
    }
    else if (type === "row") {
        add += (rowAdd * multi);
    }

    if (angryMode) {
        add = add * 2;
    }

    score += add;
    scoreTextActual.text = score;
}

//................................................
//.TTTTTTTTTTTEEEEEEEEEEEEEXXX..XXXXX.XTTTTTTTTT..
//.TTTTTTTTTTTEEEEEEEEEEE.EXXX..XXXX..XTTTTTTTTT..
//.TTTTTTTTTTTEEEEEEEEEEE.EXXXXXXXXX..XTTTTTTTTT..
//....TTTT....EEEE.........XXXXXXXX......TTTT.....
//....TTTT....EEEE..........XXXXXX.......TTTT.....
//....TTTT....EEEEEEEEEE....XXXXXX.......TTTT.....
//....TTTT....EEEEEEEEEE....XXXXX........TTTT.....
//....TTTT....EEEEEEEEEE....XXXXXX.......TTTT.....
//....TTTT....EEEE.........XXXXXXXX......TTTT.....
//....TTTT....EEEE.........XXXXXXXX......TTTT.....
//....TTTT....EEEEEEEEEEE.EXXX.XXXXX.....TTTT.....
//....TTTT....EEEEEEEEEEEEEXXX..XXXXX....TTTT.....
//....TTTT....EEEEEEEEEEEEEXX....XXXX....TTTT.....
//................................................
function createText() {
    var bottomY = (((headerHeight + stageHeight)) * blockSize) - (blockSize / 3) + 2;
    var scoreX = (((gameWidth - 2) * blockSize) / 2) - blockSize;
    // Next

    // Time
    // Actual Time

    // Score
    // Actual Score

    // Game Over

    nextBlockText = game.add.bitmapText(
        (((gameWidth) * blockSize) - 6), 
        -2, 
        'fontBlue', 
        'next', 
        5
    );

    timeText = game.add.bitmapText(
        21,
        bottomY,
        'fontBlue',
        'time',
        5
    );

    timeTextActual = game.add.bitmapText(
        21,
        bottomY + (blockSize) + 5,
        'fontWhite',
        '0:00',
        5
    );

    scoreText = game.add.bitmapText(
        (((gameWidth) * blockSize) - 6),
        bottomY,
        'fontBlue',
        'score',
        5
    );

    scoreTextActual = game.add.bitmapText(
        (((gameWidth) * blockSize) - 6),
        bottomY + (blockSize) + 5,
        'fontWhite',
        '0',
        5
    );

    yourScoreText = game.add.bitmapText(
        ((game.width / 2) - 4),
        100,
        'fontWhite',
        'your score',
        5
    );
    yourScoreTextActual = game.add.bitmapText(
        ((game.width / 2) - 4),
        115,
        'fontWhite',
        '0000',
        5
    );
    
    nextBlockText.anchor.x = 1;
    scoreText.anchor.x = 1;
    scoreTextActual.anchor.x = 1;
    yourScoreText.anchor.x = 0.5;
    yourScoreText.anchor.y = 0.5;
    yourScoreTextActual.anchor.x = 0.5;
    yourScoreTextActual.anchor.y = 0.5;

    yourScoreText.alpha = 0;
    yourScoreTextActual.alpha = 0;
}

function startGameTimer() {
    game.time.events.loop(Phaser.Timer.SECOND, function () {
        gameTimerS += 1;

        if (gameTimerS == 60) {
            gameTimerS = 0;
            gameTimerM += 1;
        }

        if (gameTimerS < 10) {
            gameTimerSOut = "0" + gameTimerS;
        }
        else {
            gameTimerSOut = gameTimerS;
        }

        if (gameTimerM < 10) {
            gameTimerMOut = "0" + gameTimerM
        }
        else {
            gameTimerMOut = gameTimerM;
        }

        timeTextActual.text = gameTimerMOut + ":" + gameTimerSOut
    }, this);
}

//.................................................................................
//.....GGGGGGG....RRRRRRRRRR.....OOOOOOO.....UUUU...UUUU..PPPPPPPPP....SSSSSSS.....
//...GGGGGGGGGG...RRRRRRRRRRR...OOOOOOOOOO...UUUU...UUUU..PPPPPPPPPP..SSSSSSSSS....
//..GGGGGGGGGGGG..RRRRRRRRRRR..OOOOOOOOOOOO..UUUU...UUUU..PPPPPPPPPPP.SSSSSSSSSS...
//..GGGGG..GGGGG..RRRR...RRRRR.OOOOO..OOOOO..UUUU...UUUU..PPPP...PPPPPSSSS..SSSS...
//.GGGGG....GGG...RRRR...RRRRROOOOO....OOOOO.UUUU...UUUU..PPPP...PPPPPSSSS.........
//.GGGG...........RRRRRRRRRRR.OOOO......OOOO.UUUU...UUUU..PPPPPPPPPPP.SSSSSSS......
//.GGGG..GGGGGGGG.RRRRRRRRRRR.OOOO......OOOO.UUUU...UUUU..PPPPPPPPPP...SSSSSSSSS...
//.GGGG..GGGGGGGG.RRRRRRRR....OOOO......OOOO.UUUU...UUUU..PPPPPPPPP......SSSSSSS...
//.GGGGG.GGGGGGGG.RRRR.RRRR...OOOOO....OOOOO.UUUU...UUUU..PPPP..............SSSSS..
//..GGGGG....GGGG.RRRR..RRRR...OOOOO..OOOOO..UUUU...UUUU..PPPP.......PSSS....SSSS..
//..GGGGGGGGGGGG..RRRR..RRRRR..OOOOOOOOOOOO..UUUUUUUUUUU..PPPP.......PSSSSSSSSSSS..
//...GGGGGGGGGG...RRRR...RRRRR..OOOOOOOOOO....UUUUUUUUU...PPPP........SSSSSSSSSS...
//.....GGGGGGG....RRRR....RRRR....OOOOOO.......UUUUUUU....PPPP.........SSSSSSSS....
//.................................................................................
function createGroups() {
    blueBorder = game.add.group();
    redBorder = game.add.group();
}

//................................................................................
//.BBBBBBBBBB.....OOOOOOO.....RRRRRRRRRR...DDDDDDDDD....EEEEEEEEEEE.ERRRRRRRRR....
//.BBBBBBBBBBB...OOOOOOOOOO...RRRRRRRRRRR..DDDDDDDDDD...EEEEEEEEEEE.ERRRRRRRRRR...
//.BBBBBBBBBBB..OOOOOOOOOOOO..RRRRRRRRRRR..DDDDDDDDDDD..EEEEEEEEEEE.ERRRRRRRRRR...
//.BBBB...BBBB..OOOOO..OOOOO..RRRR...RRRRR.DDDD...DDDD..EEEE........ERRR...RRRRR..
//.BBBB...BBBB.BOOOO....OOOOO.RRRR...RRRRR.DDDD....DDDD.EEEE........ERRR...RRRRR..
//.BBBBBBBBBBB.BOOO......OOOO.RRRRRRRRRRR..DDDD....DDDD.EEEEEEEEEE..ERRRRRRRRRR...
//.BBBBBBBBBB..BOOO......OOOO.RRRRRRRRRRR..DDDD....DDDD.EEEEEEEEEE..ERRRRRRRRRR...
//.BBBBBBBBBBB.BOOO......OOOO.RRRRRRRR.....DDDD....DDDD.EEEEEEEEEE..ERRRRRRR......
//.BBBB....BBBBBOOOO....OOOOO.RRRR.RRRR....DDDD....DDDD.EEEE........ERRR.RRRR.....
//.BBBB....BBBB.OOOOO..OOOOO..RRRR..RRRR...DDDD...DDDDD.EEEE........ERRR..RRRR....
//.BBBBBBBBBBBB.OOOOOOOOOOOO..RRRR..RRRRR..DDDDDDDDDDD..EEEEEEEEEEE.ERRR..RRRRR...
//.BBBBBBBBBBB...OOOOOOOOOO...RRRR...RRRRR.DDDDDDDDDD...EEEEEEEEEEE.ERRR...RRRRR..
//.BBBBBBBBBB......OOOOOO.....RRRR....RRRR.DDDDDDDDD....EEEEEEEEEEE.ERRR....RRRR..
//................................................................................
function createBorders() {
    var borderY = (blockSize * headerHeight) - blockSize / 4;
    var borderWidth = (stageWidth - 1) * blockSize;
    var borderHeight = stageHeight * blockSize;

    var buffer = (blockSize / 4);
    var blueTop = game.add.sprite(-buffer, borderY, 'border-1', 1);
    var blueLeft = game.add.sprite(-buffer, borderY, 'border-1', 3);
    var blueBot = game.add.sprite(-buffer, (borderY + borderHeight), 'border-1', 7);
    var blueRight = game.add.sprite(borderWidth - buffer, borderY, 'border-1', 5);

    blueBorder.add(game.add.sprite(-buffer, borderY, 'border-1', 0)); // TL
    blueBorder.add(game.add.sprite(borderWidth - buffer, borderY, 'border-1', 2)) // TR
    blueBorder.add(game.add.sprite(-buffer, (borderY + borderHeight), 'border-1', 6)) // BL
    blueBorder.add(game.add.sprite(borderWidth - buffer, (borderY + borderHeight), 'border-1', 8)) // BR

    blueTop.width = borderWidth;
    blueLeft.height = borderHeight;
    blueBot.width = borderWidth;
    blueRight.height = borderHeight;

    blueBorder.add(blueTop);
    blueBorder.add(blueLeft);
    blueBorder.add(blueBot);
    blueBorder.add(blueRight);

    // Cloning Red border - everything is the same just swapping the colour
    blueBorder.children.map(function (item) {
        var clone = game.add.sprite(
            item.x,
            item.y,
            'border-2',
            item._frame.index
        );

        clone.height = item.height;
        clone.width = item.width;

        redBorder.add(clone);
    });

    redBorder.alpha = 0;
}

//......................................................................
//.TTTTTTTTTTTIIIIIMMMMM...MMMMMM.EEEEEEEEEEE.RRRRRRRRRR....SSSSSSS.....
//.TTTTTTTTTTTIIIIIMMMMM...MMMMMM.EEEEEEEEEEE.RRRRRRRRRRR..SSSSSSSSS....
//.TTTTTTTTTTTIIIIIMMMMM...MMMMMM.EEEEEEEEEEE.RRRRRRRRRRR..SSSSSSSSSS...
//....TTTT...TIIIIIMMMMMM.MMMMMMM.EEEE........RRRR...RRRRRRSSSS..SSSS...
//....TTTT...TIIIIIMMMMMM.MMMMMMM.EEEE........RRRR...RRRRRRSSSS.........
//....TTTT...TIIIIIMMMMMM.MMMMMMM.EEEEEEEEEE..RRRRRRRRRRR..SSSSSSS......
//....TTTT...TIIIIIMMMMMMMMMMMMMM.EEEEEEEEEE..RRRRRRRRRRR...SSSSSSSSS...
//....TTTT...TIIIIIMMMMMMMMMMMMMM.EEEEEEEEEE..RRRRRRRR........SSSSSSS...
//....TTTT...TIIIIIMMMMMMMMMMMMMM.EEEE........RRRR.RRRR..........SSSSS..
//....TTTT...TIIIIIMMM.MMMMM.MMMM.EEEE........RRRR..RRRR..RSSS....SSSS..
//....TTTT...TIIIIIMMM.MMMMM.MMMM.EEEEEEEEEEE.RRRR..RRRRR.RSSSSSSSSSSS..
//....TTTT...TIIIIIMMM.MMMMM.MMMM.EEEEEEEEEEE.RRRR...RRRRR.SSSSSSSSSS...
//....TTTT...TIIIIIMMM.MMMMM.MMMM.EEEEEEEEEEE.RRRR....RRRR..SSSSSSSS....
//......................................................................
function createTimers() {
    slamTimer = game.time.create(false);
    slamTimer.loop(slamTimerInterval, function () {
        movement.push('down');
    }, this);

    dropTimer = game.time.create(false);
    dropTimer.loop(dropTimerInterval, function () {
        if (!angryMode) {
            movement.push('');
        }
    }, this);

    angryDropTimer = game.time.create(false);
    angryDropTimer.loop(angryDropTimerInterval, function () {
        movement.push('');
    }, this);

    modeSwapTimer = game.time.create(false);
    modeSwapTimer.loop(modeSwapTimerInterval, function () {
        swapMode();
        pauseModeTimer();
    }, this);

    movementHoldTimer = game.time.create(false);
    movementHoldTimer.loop(movementHoldInterval, function () {
        movementHoldAllowed = true;
        movementHoldTimer.pause();
    }, this);

    gameTimer = game.time.create(false);
    gameTimer.loop(gameTimerInterval, function () {
        updateGameTimer();
    }, this);
}

function pauseDropTimers() {
    if (!angryMode) {
        dropTimer.pause();
    }
    else {
        angryDropTimer.pause();
    }

    gameTimer.pause();
}

function resumeDropTimers() {
    if (!gamePaused) {
        if (!angryMode) {
            if (!dropTimer.running) {
                if (!sfxMuted) {
                    sfxBrokSnore.loopFull();
                }
                dropTimer.start();
            }
            else {
                dropTimer.resume();
            }
        }
        else {
            if (!angryDropTimer.running) {
                angryDropTimer.start();
            }
            else {
                angryDropTimer.resume();
            }
        }

        if (!gameTimer.running) {
            gameTimer.start();
        }
        else {
            gameTimer.resume();
        }
    }
}

function resumeModeTimer() {
    if (!modeSwapTimer.running) {
        modeSwapTimer.start();
    }
    else {
        modeSwapTimer.resume();
    }
}

function pauseModeTimer() {
    modeSwapTimer.pause();
}

function updateGameTimer() {
    gameTimerS += 1;

    if (gameTimerS == 60) {
        gameTimerS = 0;
        gameTimerM += 1;
    }

    if (gameTimerS < 10) {
        gameTimerSOut = "0" + gameTimerS;
    }
    else {
        gameTimerSOut = gameTimerS;
    }

    if (gameTimerM < 10) {
        gameTimerMOut = "0" + gameTimerM
    }
    else {
        gameTimerMOut = gameTimerM;
    }

    timeTextActual.text = gameTimerMOut + ":" + gameTimerSOut
}

//..........................................................
//.IIIII.NNNN...NNNN..TTTTTTTTTTRRRRRRRRRRR.....OOOOOOO.....
//.IIIII.NNNNN..NNNN..TTTTTTTTTTRRRRRRRRRRRR...OOOOOOOOOO...
//.IIIII.NNNNN..NNNN..TTTTTTTTTTRRRRRRRRRRRR..OOOOOOOOOOOO..
//.IIIII.NNNNNN.NNNN.....TTTT....RRRR...RRRRR.OOOOO..OOOOO..
//.IIIII.NNNNNN.NNNN.....TTTT....RRRR...RRRRROOOOO....OOOO..
//.IIIII.NNNNNNNNNNN.....TTTT....RRRRRRRRRRR.OOOO......OOO..
//.IIIII.NNNNNNNNNNN.....TTTT....RRRRRRRRRRR.OOOO......OOO..
//.IIIII.NNNNNNNNNNN.....TTTT....RRRRRRRR....OOOO......OOO..
//.IIIII.NNNNNNNNNNN.....TTTT....RRRR.RRRR...OOOOO....OOOO..
//.IIIII.NNNN.NNNNNN.....TTTT....RRRR..RRRR...OOOOO..OOOOO..
//.IIIII.NNNN..NNNNN.....TTTT....RRRR..RRRRR..OOOOOOOOOOOO..
//.IIIII.NNNN..NNNNN.....TTTT....RRRR...RRRRR..OOOOOOOOOO...
//.IIIII.NNNN...NNNN.....TTTT....RRRR....RRRR....OOOOOO.....
//..........................................................
function createIntro() {
    introOverlay = game.add.graphics(-2, 0);
    introOverlay.beginFill(0x181425);
    introOverlay.drawRect(
        -(blockSize / 4), // X
        0, // Y
        ((gameWidth) * blockSize) + (blockSize / 2), // Width
        gameHeight * blockSize // Height
    );
    introOverlay.alpha = 0;

    logo = game.add.image(
        (((gameWidth - 1) * blockSize) / 2),
        ((gameHeight * blockSize) / 2) - (blockSize * 2),
        'title'
    );
    logo.anchor.x = 0.5;
    logo.anchor.y = 0.5;
    logo.inputEnabled = false;

    logoAni = logo.animations.add('start', [], 15, false);
    logo.animations.add('idle', [48, 49, 50, 51, 52, 53, 54], 15, true);
    logo.play('start');

    if (!musicMuted) {
        musicIntroFresh.play();
    }

    // musicIntroFresh.onStop.add(function() {
    //     console.log("FIN")
    // }, this);
    // musicIntroA1
    // musicAtoB

    // sfx-intro-title
    // sfx-intro-letters
    // sfx-crunch-intro
    // sfx-intro-tap-to-play
    
    logoAni.onComplete.add(function () {
        logo.play('idle');

        canStart = true;
        // introOverlay.inputEnabled = true;
    }, this);

    
    // introOverlay.events.onInputDown.add(function () {
    //     // introOverlay.inputEnabled = false;
       
    // }, this);

    // }

    // game.world.bringToTop(titleOverlay)
    // game.world.bringToTop(titleFlashOverlay)
    // game.world.bringToTop(title)
}

function showIntro() {
    introOverlay.alpha = 1;
    window.updateBG("#181425");
}

//...............................................................
//.TTTTTTTTTTTRRRRRRRRRR......AAAAA.....NNNN...NNNN...SSSSSSS....
//.TTTTTTTTTTTRRRRRRRRRRR.....AAAAA.....NNNNN..NNNN..SSSSSSSSS...
//.TTTTTTTTTTTRRRRRRRRRRR....AAAAAA.....NNNNN..NNNN..SSSSSSSSSS..
//....TTTT....RRRR...RRRRR...AAAAAAA....NNNNNN.NNNN.NSSSS..SSSS..
//....TTTT....RRRR...RRRRR..AAAAAAAA....NNNNNN.NNNN.NSSSS........
//....TTTT....RRRRRRRRRRR...AAAAAAAA....NNNNNNNNNNN..SSSSSSS.....
//....TTTT....RRRRRRRRRRR...AAAA.AAAA...NNNNNNNNNNN...SSSSSSSSS..
//....TTTT....RRRRRRRR.....AAAAAAAAAA...NNNNNNNNNNN.....SSSSSSS..
//....TTTT....RRRR.RRRR....AAAAAAAAAAA..NNNNNNNNNNN........SSSS..
//....TTTT....RRRR..RRRR...AAAAAAAAAAA..NNNN.NNNNNN.NSSS....SSS..
//....TTTT....RRRR..RRRRR.RAAA....AAAA..NNNN..NNNNN.NSSSSSSSSSS..
//....TTTT....RRRR...RRRRRRAAA.....AAAA.NNNN..NNNNN..SSSSSSSSSS..
//....TTTT....RRRR....RRRRRAAA.....AAAA.NNNN...NNNN...SSSSSSSS...
//...............................................................
function createTransition() {
    transition = game.add.sprite(-(blockSize / 2), 0, 'nomnom');
    transitionAni = transition.animations.add('nom');
    // transition.height = gameHeight * blockSize;
    // transition.width = (gameWidth * blockSize) + (blockSize / 2);
    transition.alpha = 0;
}

function playTransition() {
    transition.alpha = 1;
    game.world.bringToTop(transition);
    transitionAni.play(15, false);
}

//..................................................................
//....CCCCCCC......OOOOOOO.....UUUU...UUUU..NNNN...NNNN..TTTTTTTTT..
//...CCCCCCCCC....OOOOOOOOOO...UUUU...UUUU..NNNNN..NNNN..TTTTTTTTT..
//..CCCCCCCCCCC..OOOOOOOOOOOO..UUUU...UUUU..NNNNN..NNNN..TTTTTTTTT..
//..CCCC...CCCCC.OOOOO..OOOOO..UUUU...UUUU..NNNNNN.NNNN.....TTTT....
//.CCCC.....CCC.OOOOO....OOOOO.UUUU...UUUU..NNNNNN.NNNN.....TTTT....
//.CCCC.........OOOO......OOOO.UUUU...UUUU..NNNNNNNNNNN.....TTTT....
//.CCCC.........OOOO......OOOO.UUUU...UUUU..NNNNNNNNNNN.....TTTT....
//.CCCC.........OOOO......OOOO.UUUU...UUUU..NNNNNNNNNNN.....TTTT....
//.CCCC.....CCC.OOOOO....OOOOO.UUUU...UUUU..NNNNNNNNNNN.....TTTT....
//..CCCC...CCCCC.OOOOO..OOOOO..UUUU...UUUU..NNNN.NNNNNN.....TTTT....
//..CCCCCCCCCCC..OOOOOOOOOOOO..UUUUUUUUUUU..NNNN..NNNNN.....TTTT....
//...CCCCCCCCCC...OOOOOOOOOO....UUUUUUUUU...NNNN..NNNNN.....TTTT....
//....CCCCCCC.......OOOOOO.......UUUUUUU....NNNN...NNNN.....TTTT....
//..................................................................
function createCountdown() {
    countdown = game.add.bitmapText(
        ((gameWidth - 1) * blockSize) / 2,
        ((gameHeight * blockSize) / 2),
        'fontWhite',
        '3',
        10
    );

    countdown.anchor.x = 0.5;
    countdown.anchor.y = 0.5;
}

function startCountdown() {
    var countdownText = 3;

    pauseBtn.inputEnabled = false;

    introOverlay.alpha = 0;
    introOverlay.inputEnabled = false;
    countdown.text = countdownText;
    pauseOverlay.alpha = 0.75;
    countdown.alpha = 1;
    game.world.bringToTop(pauseOverlay);
    game.world.bringToTop(countdown);
    game.world.bringToTop(transition);

    if (!musicMuted) {
        musicIntroFresh.stop();
        musicIntroReset.stop();
    }

    if (!sfxMuted) {
        sfxCountdown123Go.play();
    }

    game.time.events.repeat(countdownInterval, 5, function () {
        if (countdownText === 0) {
            countdownText = "GO";
            countdown.text = countdownText;
        }
        else if (countdownText === "GO" && !gameStarted) {
            brocSleepAni.play(10, true)
            countdown.alpha = 0;
            pauseOverlay.alpha = 0;
            pauseBtn.inputEnabled = true;
            gameStarted = true;
            nextBlock = null;
            nextBlockColour = null;
            rotatePos = 0;
            colliding = false;
            spawnBlock();
            startAudio();
        }
        else {
            countdown.text = countdownText;
            
            countdownText--;
        }
    }, this);
}

//..............................................................
//.PPPPPPPPP.....AAAA.....AAAU....UUUU...USSSSSS...SSSEEEEEEEE..
//.PPPPPPPPPP...AAAAAA....AAAU....UUUU..UUSSSSSSS..SSSEEEEEEEE..
//.PPPPPPPPPPP..AAAAAA....AAAU....UUUU.UUUSSSSSSSS.SSSEEEEEEEE..
//.PPPP...PPPP..AAAAAAA...AAAU....UUUU.UUUS...SSSS.SSSE.........
//.PPPP...PPPP.PAAAAAAA...AAAU....UUUU.UUUSS.......SSSE.........
//.PPPPPPPPPPP.PAAAAAAA...AAAU....UUUU..UUSSSSS....SSSEEEEEEEE..
//.PPPPPPPPPP..PAAA.AAAA..AAAU....UUUU...USSSSSSS..SSSEEEEEEEE..
//.PPPPPPPPP..PPAAAAAAAA..AAAU....UUUU.....SSSSSSS.SSSEEEEEEEE..
//.PPPP.......PPAAAAAAAAA.AAAUU...UUUU........SSSSSSSSE.........
//.PPPP......PPPAAAAAAAAA..AAUU..UUUUU.UUUS...SSSSSSSSE.........
//.PPPP......PPPA....AAAA..AAUUUUUUUUU.UUUSSSSSSSS.SSSEEEEEEEE..
//.PPPP......PPPA....AAAAA.AAUUUUUUUU...UUSSSSSSSS.SSSEEEEEEEE..
//.PPPP.....PPPPA.....AAAA...UUUUUUU.....USSSSSS...SSSEEEEEEEE..
//..............................................................
function createPause() {
    createPauseOverlay();
    createPauseUI();
    bindPauseEvents();
}

function createPauseOverlay() {
    pauseOverlay = game.add.graphics(-2, 0);
    pauseOverlay.beginFill(0x181425);
    pauseOverlay.drawRect(
        -(blockSize / 4), // X
        0, // Y
        ((gameWidth) * blockSize) + (blockSize / 2), // Width
        gameHeight * blockSize // Height
    );
    pauseOverlay.alpha = 0;
}

function createPauseUI() {
    pauseBtn = game.add.sprite(
        -2,
        (((headerHeight + stageHeight)) * blockSize) + 6,
        'btn-pause'
    );
    pauseBtn.animations.add('up', [0]);
    pauseBtn.animations.add('down', [1]);

    paused = game.add.image(
        (game.width / 2) - 4,
        20,
        'paused'
    );

    musicBtn = game.add.sprite(
        ((game.width / 2) - 4) + 28,
        70,
        'btn-music'
    );
    musicBtn.animations.add('up', [0]);
    musicBtn.animations.add('down', [1]);

    sfxBtn = game.add.sprite(
        ((game.width / 2) - 4) - 28,
        70,
        'btn-sfx'
    );
    sfxBtn.animations.add('up', [0]);
    sfxBtn.animations.add('down', [1]);

    creditsBtn = game.add.sprite(
        ((game.width / 2) - 4) - 18,
        123,
        'btn-credits'
    );
    creditsBtn.animations.add('up', [0]);
    creditsBtn.animations.add('down', [1]);
    creditsBtn.play('down')

    infoBtn = game.add.sprite(
        ((game.width / 2) - 4) + 38,
        123,
        'btn-info'
    );
    infoBtn.animations.add('up', [0]);
    infoBtn.animations.add('down', [1]);
    infoBtn.play('down')

    resumeBtn = game.add.sprite(
        ((game.width / 2) - 4),
        162,
        'btn-resume'
    );
    resumeBtn.animations.add('up', [0]);
    resumeBtn.animations.add('down', [1]);

    coffeeBtn = game.add.sprite(
        ((game.width / 2) - 4),
        205,
        'btn-coffee'
    );
    coffeeBtn.animations.add('up', [0, 1, 2, 3, 4, 5]);
    coffeeBtn.animations.add('down', [6]);
    coffeeBtn.play('up', 10, true);

    paused.anchor.x = 0.5;
    paused.anchor.y = 0.5;
    musicBtn.anchor.x = 0.5;
    musicBtn.anchor.y = 0.5;
    sfxBtn.anchor.x = 0.5;
    sfxBtn.anchor.y = 0.5;
    creditsBtn.anchor.x = 0.5;
    creditsBtn.anchor.y = 0.5;
    infoBtn.anchor.x = 0.5;
    infoBtn.anchor.y = 0.5;
    resumeBtn.anchor.x = 0.5;
    resumeBtn.anchor.y = 0.5;
    coffeeBtn.anchor.x = 0.5;
    coffeeBtn.anchor.y = 0.5;

    paused.alpha = 0;
    musicBtn.alpha = 0;
    sfxBtn.alpha = 0;
    creditsBtn.alpha = 0;
    infoBtn.alpha = 0;
    resumeBtn.alpha = 0;
    coffeeBtn.alpha = 0;
}

function bindPauseEvents() {
    pauseBtn.inputEnabled = true;
    pauseBtn.events.onInputDown.add(function () {
        pauseGame();
    }, this);

    musicBtn.events.onInputDown.add(function () {
        if (musicOn) {
            localStorage.setItem("brok-music", false);
            musicMuted = true;
            musicBtn.play('down')
        }
        else {
            localStorage.setItem("brok-music", true);
            musicMuted = false;
            musicBtn.play('up')
        }

        musicOn = !musicOn;
    }, this);

    sfxBtn.events.onInputDown.add(function () {
        if (sfxOn) {
            localStorage.setItem("brok-sfx", false);
            sfxMuted = true;
            sfxBtn.play('down')
        }
        else {
            localStorage.setItem("brok-sfx", true);
            sfxMuted = false;
            sfxBtn.play('up')
        }

        sfxOn = !sfxOn;
    }, this);

    // creditsBtn.events.onInputDown.add(function () {
    //     creditsBtn.play('down')
    // }, this);

    // infoBtn.events.onInputDown.add(function () {
    //     infoBtn.play('down')
    // }, this);

    resumeBtn.events.onInputDown.add(function () {
        resumeBtn.play('down');

        setTimeout(function () {
            resumeGame();
        }, btnClickDelay);
    }, this);

    coffeeBtn.events.onInputDown.add(function () {
        coffeeBtn.play('down')

        setTimeout(function () {
            window.open(kofiURL, '_blank');
            coffeeBtn.play('up')
        }, btnClickDelay);
    }, this);

};

function pauseGame() {
    gamePaused = true;
    
    pauseDropTimers();
    pauseModeTimer();

    pauseBtn.play('down');

    if (!sfxMuted) {
        sfxPauseOpen.play();
    }

    if (!angryMode) {
        if (!sfxMuted) {
            sfxBrokSnore.stop();
        }
    }

    setTimeout(function() {
        brocSleepAni.stop();
        brocIdleAni.stop();
        pauseOverlay.alpha = 1;

        game.world.bringToTop(pauseOverlay);
        game.world.bringToTop(paused);
        game.world.bringToTop(musicBtn);
        game.world.bringToTop(sfxBtn);
        game.world.bringToTop(creditsBtn);
        game.world.bringToTop(infoBtn);
        game.world.bringToTop(resumeBtn);
        game.world.bringToTop(coffeeBtn);

        paused.alpha = 1;
        musicBtn.alpha = 1;
        sfxBtn.alpha = 1;
        creditsBtn.alpha = 1;
        infoBtn.alpha = 1;
        resumeBtn.alpha = 1;
        coffeeBtn.alpha = 1;

        musicBtn.inputEnabled = true;
        sfxBtn.inputEnabled = true;
        creditsBtn.inputEnabled = true;
        infoBtn.inputEnabled = true;
        resumeBtn.inputEnabled = true;
        coffeeBtn.inputEnabled = true;
    }, btnClickDelay);
}

function resumeGame() {
    gamePaused = false;
    resumeDropTimers();
    resumeModeTimer();
    pauseBtn.play('up');
    resumeBtn.play('up');
    
    if (angryMode) {
        brocIdleAni.play(10, true);
    }
    else {
        if (!sfxMuted) {
            sfxBrokSnore.loopFull();
        }
        brocSleepAni.play(10, true);
    }

    pauseOverlay.alpha = 0;
    paused.alpha = 0;
    musicBtn.alpha = 0;
    sfxBtn.alpha = 0;
    creditsBtn.alpha = 0;
    infoBtn.alpha = 0;
    resumeBtn.alpha = 0;
    coffeeBtn.alpha = 0;

    pauseOverlay.inputEnabled = false;
    paused.inputEnabled = false;
    musicBtn.inputEnabled = false;
    sfxBtn.inputEnabled = false;
    creditsBtn.inputEnabled = false;
    infoBtn.inputEnabled = false;
    resumeBtn.inputEnabled = false;
    coffeeBtn.inputEnabled = false;

    if (!sfxMuted) {
        sfxPauseClose.play();
    }
}

//...................................................................
//....OOOOOOO.....UUUU...UUUU..TTTTTTTTTTRRRRRRRRRRR.....OOOOOOO.....
//...OOOOOOOOOO...UUUU...UUUU..TTTTTTTTTTRRRRRRRRRRRR...OOOOOOOOOO...
//..OOOOOOOOOOOO..UUUU...UUUU..TTTTTTTTTTRRRRRRRRRRRR..OOOOOOOOOOOO..
//..OOOOO..OOOOO..UUUU...UUUU.....TTTT....RRRR...RRRRR.OOOOO..OOOOO..
//.OOOOO....OOOOO.UUUU...UUUU.....TTTT....RRRR...RRRRROOOOO....OOOO..
//.OOOO......OOOO.UUUU...UUUU.....TTTT....RRRRRRRRRRR.OOOO......OOO..
//.OOOO......OOOO.UUUU...UUUU.....TTTT....RRRRRRRRRRR.OOOO......OOO..
//.OOOO......OOOO.UUUU...UUUU.....TTTT....RRRRRRRR....OOOO......OOO..
//.OOOOO....OOOOO.UUUU...UUUU.....TTTT....RRRR.RRRR...OOOOO....OOOO..
//..OOOOO..OOOOO..UUUU...UUUU.....TTTT....RRRR..RRRR...OOOOO..OOOOO..
//..OOOOOOOOOOOO..UUUUUUUUUUU.....TTTT....RRRR..RRRRR..OOOOOOOOOOOO..
//...OOOOOOOOOO....UUUUUUUUU......TTTT....RRRR...RRRRR..OOOOOOOOOO...
//.....OOOOOO.......UUUUUUU.......TTTT....RRRR....RRRR....OOOOOO.....
//...................................................................
function createOutro() {
    outroOverlay = game.add.graphics(-2, 0);
    outroOverlay.beginFill(0x6a141d); //0xFF0B46
    outroOverlay.drawRect(
        -(blockSize / 4), // X
        0, // Y
        ((gameWidth) * blockSize) + (blockSize / 2), // Width
        gameHeight * blockSize // Height
    );
    outroOverlay.alpha = 0;

    gameOverText = game.add.sprite(
        ((game.width / 2) - 4),
        80,
        'gameover'
    );
    gameOverTextAni = gameOverText.animations.add('sleep');
    gameOverTextAni.play(10, true);

    

    gameOverButton = game.add.sprite(
        ((game.width / 2) - 4),
        180,
        'btn-restart'
    );
    gameOverButton.animations.add('up', [0]);
    gameOverButton.animations.add('down', [1]);

    gameOverText.anchor.x = 0.5;
    gameOverText.anchor.y = 0.5;
    gameOverButton.anchor.x = 0.5;
    gameOverButton.anchor.y = 0.5;
    gameOverText.alpha = 0;
    gameOverButton.alpha = 0;

    gameOverButton.events.onInputDown.add(function() {
        gameOverButton.play('down');
        gameOverButton.inputEnabled = false;
        
        setTimeout(function() {
            resetting = true;
            gameStarted = false;
            playTransition();
        }, btnClickDelay);
    }, this);
}

function showOutro() {
    pauseBtn.inputEnabled = false;
    gameOverButton.inputEnabled = true;
    outroOverlay.alpha = 1;
    gameOverText.alpha = 1;
    gameOverButton.alpha = 1;
    yourScoreText.alpha = 1;
    yourScoreTextActual.alpha = 1;
    gamePaused = true;

    pauseDropTimers();
    pauseModeTimer();

    yourScoreTextActual.text = score;

    game.world.bringToTop(outroOverlay);
    game.world.bringToTop(gameOverButton);
    game.world.bringToTop(gameOverText);
    game.world.bringToTop(yourScoreText);
    game.world.bringToTop(yourScoreTextActual);
    game.world.bringToTop(transition);
}

//..............................................................
//.RRRRRRRRRR...EEEEEEEEEEE..SSSSSSS....SEEEEEEEEEE.ETTTTTTTTT..
//.RRRRRRRRRRR..EEEEEEEEEEE.ESSSSSSSS...SEEEEEEEEEE.ETTTTTTTTT..
//.RRRRRRRRRRR..EEEEEEEEEEE.ESSSSSSSSS..SEEEEEEEEEE.ETTTTTTTTT..
//.RRRR...RRRRR.EEEE.......EESSS..SSSS..SEEE...........TTTT.....
//.RRRR...RRRRR.EEEE.......EESSS........SEEE...........TTTT.....
//.RRRRRRRRRRR..EEEEEEEEEE..ESSSSSS.....SEEEEEEEEE.....TTTT.....
//.RRRRRRRRRRR..EEEEEEEEEE...SSSSSSSSS..SEEEEEEEEE.....TTTT.....
//.RRRRRRRR.....EEEEEEEEEE.....SSSSSSS..SEEEEEEEEE.....TTTT.....
//.RRRR.RRRR....EEEE..............SSSSS.SEEE...........TTTT.....
//.RRRR..RRRR...EEEE.......EESS....SSSS.SEEE...........TTTT.....
//.RRRR..RRRRR..EEEEEEEEEEEEESSSSSSSSSS.SEEEEEEEEEE....TTTT.....
//.RRRR...RRRRR.EEEEEEEEEEE.ESSSSSSSSS..SEEEEEEEEEE....TTTT.....
//.RRRR....RRRR.EEEEEEEEEEE..SSSSSSSS...SEEEEEEEEEE....TTTT.....
//..............................................................
function resetGame() {
    score = 0;
    scoreTextActual.text = 0;
    introOverlay.inputEnabled = true;
    outroOverlay.alpha = 0;
    gameOverButton.alpha = 0;
    gameOverText.alpha = 0;
    yourScoreText.alpha = 0;
    yourScoreTextActual.alpha = 0;
    gameTimerM = 0;
    gameTimerS = 0;
    timeTextActual.text = "0:00";
    logo.alpha = 1;
    introOverlay.alpha = 1;
    game.world.bringToTop(introOverlay);
    game.world.bringToTop(logo);
    game.world.bringToTop(transition);
    brocSleepAni.stop();
    brocIdleAni.stop();
    brocSleep.alpha = 1;
    brocIdle.alpha = 0;
    angryMode = false;
    blueBorder.alpha = 1;
    redBorder.alpha = 0;
    slamTotal = 0;
    slamOverlay.alpha = 0;
    gamePaused = false;
    movement = [];
    current = [];
    gameOverButton.play("up");
    canStart = true;
    // audioAngry.stop();
    // audioSleep.loopFull(audioVolume);
    colliding = false;
    slamming = false;
    stopTapToPlay = false;
    slamTimer.pause();
    pauseModeTimer();

    if (!musicMuted) {
        musicGameOver.stop();
        musicIntroReset.play();
    }

    grid.map(function(col, y) {
        col.map(function(item) {
            if (y < 3) {
                item.node.loadTexture('buffer');
            }
            else {
                item.node.loadTexture('node');
            }
            
            item.state = "empty";
        })
    })
    nextGrid.map(function (col, y) {
        col.map(function (item) {
            item.node.loadTexture('node');
            item.state = "empty";
        })
    })
}

//...................................................................
//...SSSSSSS....PPPPPPPPP.....AAAA...AAAA...WWWWW..WWWWWWNNN...NNNN..
//..SSSSSSSSS...PPPPPPPPPP...AAAAAA..AAAAW..WWWWW..WWWWWWNNN...NNNN..
//..SSSSSSSSSS..PPPPPPPPPPP..AAAAAA...AAAW.WWWWWW..WWWWWWNNNN..NNNN..
//.SSSSS..SSSS..PPPP...PPPP..AAAAAAA..AAAW.WWWWWWW.WWWWWWNNNNN.NNNN..
//.SSSSS........PPPP...PPPP.AAAAAAAA..AAAW.WWWWWWW.WWWWWWNNNNN.NNNN..
//..SSSSSSS.....PPPPPPPPPPP.AAAAAAAA..AAAW.WWWWWWWWWWW.WWNNNNNNNNNN..
//...SSSSSSSSS..PPPPPPPPPP..AAAA.AAAA..AAWWWWWWWWWWWWW.WWNNNNNNNNNN..
//.....SSSSSSS..PPPPPPPPP..PAAAAAAAAA..AAWWWWW.WWWWWWW.WWNN.NNNNNNN..
//........SSSSS.PPPP.......PAAAAAAAAAA.AAWWWWW.WWWWWWW.WWNN.NNNNNNN..
//.SSSS....SSSS.PPPP......PPAAAAAAAAAA.AAWWWW..WWWWWW..WWNN..NNNNNN..
//.SSSSSSSSSSSS.PPPP......PPAA....AAAA..AWWWW...WWWWW..WWNN..NNNNNN..
//..SSSSSSSSSS..PPPP......PPAA....AAAAA.AWWWW...WWWWW..WWNN...NNNNN..
//...SSSSSSSS...PPPP.....PPPAA.....AAAA.AWWWW...WWWWW..WWNN....NNNN..
//...................................................................
function spawnBlock() {
    colliding = false;
    rotatePos = 0;

    if (nextBlock === null) {
        activeBlock = blocks[getRandomNum(0, blocks.length - 1)];
        nextBlock = blocks[getRandomNum(0, blocks.length - 1)];
        nextBlockColour = 'block-' + String(getRandomNum(1, 5));
        blockColor = 'block-' + String(getRandomNum(1, 5));
    }
    else {
        nextBlock[0].map(function (b, i) {
            b.map(function (n, x) {
                if (n && n.length === undefined) {
                    nextGrid[i][x].node.loadTexture('node');
                    nextGrid[i][x].state = "empty";
                }
            })
        })

        activeBlock = nextBlock;
        nextBlock = blocks[getRandomNum(0, blocks.length - 1)];
        blockColor = nextBlockColour;
        nextBlockColour = 'block-' + String(getRandomNum(1, 5));
    }
    
    // activeBlock = blocks[2];
    
    
    activeBlock[0].map(function(b, i) {
        b.map(function(n, x) {
            var z = (((gameWidth) / 2) - 2) + x;
            if (n && n.length === undefined) {
                grid[i][z].node.loadTexture(blockColor);
                grid[i][z].state = "active";
                current.push([i, z]);
            }
        })
    })

    nextBlock[0].map(function (b, i) {
        b.map(function (n, x) {
            if (n && n.length === undefined) {
                nextGrid[i][x].node.loadTexture(nextBlockColour);
                nextGrid[i][x].state = "active";
            }
        })
    })
}

//.........................................................
//.MMMMMM...MMMMMM...OOOOOOO.....DDDDDDDDD....EEEEEEEEEEE..
//.MMMMMM...MMMMMM..OOOOOOOOOO...DDDDDDDDDD...EEEEEEEEEEE..
//.MMMMMM...MMMMMM.OOOOOOOOOOOO..DDDDDDDDDDD..EEEEEEEEEEE..
//.MMMMMMM.MMMMMMM.OOOOO..OOOOO..DDDD...DDDD..EEEE.........
//.MMMMMMM.MMMMMMMOOOOO....OOOOO.DDDD....DDDD.EEEE.........
//.MMMMMMM.MMMMMMMOOOO......OOOO.DDDD....DDDD.EEEEEEEEEE...
//.MMMMMMMMMMMMMMMOOOO......OOOO.DDDD....DDDD.EEEEEEEEEE...
//.MMMMMMMMMMMMMMMOOOO......OOOO.DDDD....DDDD.EEEEEEEEEE...
//.MMMMMMMMMMMMMMMOOOOO....OOOOO.DDDD....DDDD.EEEE.........
//.MMMM.MMMMM.MMMM.OOOOO..OOOOO..DDDD...DDDDD.EEEE.........
//.MMMM.MMMMM.MMMM.OOOOOOOOOOOO..DDDDDDDDDDD..EEEEEEEEEEE..
//.MMMM.MMMMM.MMMM..OOOOOOOOOO...DDDDDDDDDD...EEEEEEEEEEE..
//.MMMM.MMMMM.MMMM....OOOOOO.....DDDDDDDDD....EEEEEEEEEEE..
//.........................................................
function swapMode() {
    if (!angryMode) {        
        // audioSleep.stop();
        // audioSleepTrans.restart()
        // audioSleepTrans.volume = audioVolume;

        if (!musicMuted) {
            musicA1toA2.stop();
            musicAtoB.play();
        }

        game.time.events.add(1350, function () {
            blueBorder.alpha = 0;
            redBorder.alpha = 1;
        }, this);

        game.time.events.add(1670, function () {
            blueBorder.alpha = 1;
            redBorder.alpha = 0;
        }, this);

        game.time.events.add(2330, function () {
            blueBorder.alpha = 0;
            redBorder.alpha = 1;
        }, this);

        game.time.events.add(2490, function () {
            blueBorder.alpha = 1;
            redBorder.alpha = 0;
        }, this);

        game.time.events.add(2680, function () {
            blueBorder.alpha = 0;
            redBorder.alpha = 1;
        }, this);

        game.time.events.add(3680, function () {
            blueBorder.alpha = 1;
            redBorder.alpha = 0;
        }, this);

        game.time.events.add(3840, function () {
            console.log("Attemptiong")
            if (!canStart) {
                if (!musicMuted) {
                    musicB.loopFull(1);
                }
                console.log("Yuh")
                angryMode = true;
                // audioAngry.loopFull(audioVolume);
                brocSleep.alpha = 0;
                brocIdle.alpha = 1;
                brocIdleAni.play(10, true)
                brocSleepAni.stop();

                blueBorder.alpha = 0;
                redBorder.alpha = 1;

                if (!sfxMuted) {
                    sfxBrokSnore.stop();
                }

                resumeModeTimer();
            }
        }, this);
    }
    else {
        pauseDropTimers();
        brocSleep.alpha = 1;
        brocIdle.alpha = 0;
        brocSleepAni.play(10, true)
        brocIdleAni.stop();
        angryMode = false;
        blueBorder.alpha = 1;
        redBorder.alpha = 0;

        // audioAngry.stop();
        // audioSleep.loopFull(audioVolume);

        if (!sfxMuted) {
            sfxBrokSnore.loopFull();
        }

        if (!musicMuted) {
            musicAtoB.stop();
            musicB.stop();
            musicA1toA2.loopFull(1);
        }

        resumeDropTimers();
    }

    
}

//..........................................................................
//.UUUU...UUUU..PPPPPPPPP...PDDDDDDDD.......AAAAA...AAATTTTTTTTTTEEEEEEEEE..
//.UUUU...UUUU..PPPPPPPPPP..PDDDDDDDDD......AAAAA...AAATTTTTTTTTTEEEEEEEEE..
//.UUUU...UUUU..PPPPPPPPPPP.PDDDDDDDDDD....AAAAAA...AAATTTTTTTTTTEEEEEEEEE..
//.UUUU...UUUU..PPPP...PPPP.PDDD...DDDD....AAAAAAA......TTTT...TTEE.........
//.UUUU...UUUU..PPPP...PPPP.PDDD....DDDD..AAAAAAAA......TTTT...TTEE.........
//.UUUU...UUUU..PPPPPPPPPPP.PDDD....DDDD..AAAAAAAA......TTTT...TTEEEEEEEEE..
//.UUUU...UUUU..PPPPPPPPPP..PDDD....DDDD..AAAA.AAAA.....TTTT...TTEEEEEEEEE..
//.UUUU...UUUU..PPPPPPPPP...PDDD....DDDD.DAAAAAAAAA.....TTTT...TTEEEEEEEEE..
//.UUUU...UUUU..PPPP........PDDD....DDDD.DAAAAAAAAAA....TTTT...TTEE.........
//.UUUU...UUUU..PPPP........PDDD...DDDDD.DAAAAAAAAAA....TTTT...TTEE.........
//.UUUUUUUUUUU..PPPP........PDDDDDDDDDD.DDAA....AAAA....TTTT...TTEEEEEEEEE..
//..UUUUUUUUU...PPPP........PDDDDDDDDD..DDAA.....AAAA...TTTT...TTEEEEEEEEE..
//...UUUUUUU....PPPP........PDDDDDDDD..DDDAA.....AAAA...TTTT...TTEEEEEEEEE..
//..........................................................................
function update() {
    if (transitionAni._frameIndex === 8) {
        game.camera.shake(0.01, 50);
        if (!sfxMuted) { sfxCrunch.play(); }

        if (starting1) {
            starting1 = false;
            startGame(1);
        }
        if (starting2) {
            starting2 = false;
            startGame(2);
        }
        if (ggwp) {
            ggwp = false;
            showOutro();
        }
        if (resetting) {
            resetting = false;
            resetGame();
        }
    }
    
    if (rotate.isDown && !rotateKeyDown) {
        var playSounds = false;

        if (canStart) {
            canStart = false;
            starting1 = true;
            playSounds = true;
        }
        else if (instructionsDone) {
            instructionsDone = false;
            starting2 = true;
            playSounds = true;
        }
        
        if (playSounds) {
            rotateKeyDown = true;
            playTransition();

            // sfxIntroTapToPlay.stop();

            if (!sfxMuted) {
                sfxButtonClick.play();
            }
        }
    }

    if (brocIdleAni._frameIndex === 52 && !brocAniSlam || 
        brocIdleAni._frameIndex === 93 && !brocAniSlam) {
        brocAniSlam = true;
            
        if (getRandomNum(0, 1) === 0) {
            movement.push("right");
        }
        else {
            movement.push("left");
        }

        game.camera.shake(0.01, 50);

        setTimeout(function () {
            brocAniSlam = false;
        }, 100);
    }

    if (brocIdleAni._frameIndex === 23 ||
        brocIdleAni._frameIndex === 30 ||
        brocIdleAni._frameIndex === 59 ||
        brocIdleAni._frameIndex === 76 ||
        brocIdleAni._frameIndex === 110) {
        if (!sfxMuted) { sfxBrokCrunch.play(); }
    }

    if (brocIdleAni._frameIndex === 40 ||
        brocIdleAni._frameIndex === 80) {
        if (!sfxMuted) { sfxBrokSpin.play(); }
    }

    if (brocIdleAni._frameIndex === 50 ||
        brocIdleAni._frameIndex === 90) {
        if (!sfxMuted) { sfxBrokCrash.play(); }
    }

    if (logoAni._frameIndex === 11) {
        if (!sfxMuted) { sfxIntroTitle.play(); }
    }
    if (logoAni._frameIndex === 18) {
        if (!sfxMuted) { sfxIntroLetters.play(); }
    }
    if (logoAni._frameIndex === 33) {
        game.camera.shake(0.01, 50);
        if (!sfxMuted) { sfxIntroCrunch.play(); }
    }

    // console.log(logo)
    if (!stopTapToPlay) {
        if (logo.animations.currentFrame.index == 48 ||
            logo.animations.currentFrame.index == 53) {
                if (!sfxMuted && !tapPlaying) {
                    tapPlaying = true;
                    sfxIntroTapToPlay.play(); 

                    sfxIntroTapToPlay.onStop.add(function() {
                        tapPlaying = false;
                    }, this)
                }
        }
    }


    if (!slamTimer.running && !slamTimer.paused || slamTimer.running && slamTimer.paused && !colliding && !slamming && !canStart) {
        if (rotate.isDown && !rotateKeyDown) {
            rotateKeyDown = true;
            movement.push("rotate");
        }

        if (kb.left.isDown && !movementKeyDown) {
            movementKeyDown = true;
            movement.push("left");
        }
        if (!kb.left.downDuration(movementHoldDelay) && kb.left.isDown && movementHoldAllowed) {
            movementHoldAllowed = false;
            movement.push("left");
            resumeMovementHoldTimer();
        }

        if (kb.right.isDown && !movementKeyDown) {
            movementKeyDown = true;
            movement.push("right");
        }
        if (!kb.right.downDuration(movementHoldDelay) && kb.right.isDown && movementHoldAllowed) {
            movementHoldAllowed = false;
            movement.push("right");
            resumeMovementHoldTimer();
        }

        if (kb.down.isDown && !movementKeyDown) {
            movementKeyDown = true;
            movement.push("slam");
        }
        
    }
    if (!rotate.isDown && !kb.left.isDown && !kb.right.isDown && !kb.down.isDown) {
        movementKeyDown = false;
    }
    if (!rotate.isDown) {
        rotateKeyDown = false;
    }

    if (gameStarted) {
        parseMovements();
    }
}

function resumeMovementHoldTimer() {
    if (!movementHoldTimer.running) {
        movementHoldTimer.start();
    }
    else {
        movementHoldTimer.resume();
    }
}

function parseMovements() {
    pauseDropTimers();

    movement.map(function(cmd) {
        switch (cmd) {
            case "rotate":
                rotateBlock();
                break;
            case "left":
                if (angryMode) {
                    moveRight();
                }
                else {
                    moveLeft();
                }
                break;
            case "right":
                if (angryMode) {
                    moveLeft();
                }
                else {
                    moveRight();
                }
                break;
            case "slam":
                slamDown();
                break;
            default:
                moveDown();
        }
    });

    movement = [];

    resumeDropTimers();
}

//.........................................................................
//.RRRRRRRRRR.....OOOOOOO.....TTTTTTTTTTT..AAAA....AAATTTTTTTTTTTEEEEEEEE..
//.RRRRRRRRRRR...OOOOOOOOOO...TTTTTTTTTTT.AAAAAA...AAATTTTTTTTTTTEEEEEEEE..
//.RRRRRRRRRRR..OOOOOOOOOOOO..TTTTTTTTTTT.AAAAAA...AAATTTTTTTTTTTEEEEEEEE..
//.RRRR...RRRRR.OOOOO..OOOOO.....TTTT.....AAAAAAA......TTTT...TTTE.........
//.RRRR...RRRRRROOOO....OOOOO....TTTT....AAAAAAAA......TTTT...TTTE.........
//.RRRRRRRRRRR.ROOO......OOOO....TTTT....AAAAAAAA......TTTT...TTTEEEEEEE...
//.RRRRRRRRRRR.ROOO......OOOO....TTTT....AAAA.AAAA.....TTTT...TTTEEEEEEE...
//.RRRRRRRR....ROOO......OOOO....TTTT...TAAAAAAAAA.....TTTT...TTTEEEEEEE...
//.RRRR.RRRR...ROOOO....OOOOO....TTTT...TAAAAAAAAAA....TTTT...TTTE.........
//.RRRR..RRRR...OOOOO..OOOOO.....TTTT..TTAAAAAAAAAA....TTTT...TTTE.........
//.RRRR..RRRRR..OOOOOOOOOOOO.....TTTT..TTAA....AAAA....TTTT...TTTEEEEEEEE..
//.RRRR...RRRRR..OOOOOOOOOO......TTTT..TTAA....AAAAA...TTTT...TTTEEEEEEEE..
//.RRRR....RRRR....OOOOOO........TTTT.TTTAA.....AAAA...TTTT...TTTEEEEEEEE..
//.........................................................................
function rotateBlock() {
    var nextRotate = rotatePos + 1; 

    if (nextRotate === 4) {
        nextRotate = 0;
    }

    var ogStart0 = current[0][0];
    var ogStart1 = current[0][1];
    var start = current[0];
    var blocked = false;
    var rotatedArr = activeBlock[(nextRotate)];
    var newCurrent = [];
    var tempMatrix;

    if (activeBlock[0].length === 3) {
        tempMatrix = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
    }
    else {
        tempMatrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }

    if (activeBlock[(nextRotate) - 1] !== undefined) {
        if (activeBlock[(nextRotate)-1][0][0].length > 1) {
            start[0] -= activeBlock[(nextRotate) - 1][0][0][0];
            start[1] -= activeBlock[(nextRotate) - 1][0][0][1];
        }
    }
    else {
        if (activeBlock[(nextRotate) + 3][0][0].length > 1) {
            start[0] -= activeBlock[(nextRotate) + 3][0][0][0];
            start[1] -= activeBlock[(nextRotate) + 3][0][0][1];
        }
    }

    // Replicating matrix with actual nodes
    var bumpRight = false;
    var bumpRightX2 = false;
    var bumpLeft = false;
    var bumpLeftX2 = false;

    for (var i = 0; i < tempMatrix.length; i++) {
        for (var x = 0; x < tempMatrix.length; x++) {
            var xPos = [start[1] + x];

            if (xPos[0] === -1) {
                bumpRight = true;
            }

            if (xPos[0] === -2) {
                bumpRightX2 = true;
            }

            if (xPos[0] === (gameWidth - 1)) {
                bumpLeft = true;
            }

            if (xPos[0] === gameWidth) {
                bumpLeftX2 = true;
            }
        }
    }

    for (var i = 0; i < tempMatrix.length; i++) {
        for (var x = 0; x < tempMatrix.length; x++) {
            var xPos = [start[1] + x];

            if (bumpRight) {
                xPos[0] += 1;
            }

            if (bumpRightX2) {
                xPos[0] += 1;
            }

            if (bumpLeft) {
                xPos[0] -= 1;
            }

            if (bumpLeftX2) {
                xPos[0] -= 1;
            }

            if (grid[start[0] + i] === undefined) {
                blocked = true;
            }

            var node = grid[start[0] + i][xPos[0]];
            tempMatrix[i][x] = node;

            if (node.state === "set") {
                blocked = true;
            }
        }
    }

    if (!blocked) {
        tempMatrix.map(function(row, i) {
            row.map(function (block, x) {
                // console.log(row)
                if (rotatedArr[i][x] === 1) {
                    block.node.loadTexture(blockColor)
                    block.state = "active";
                }
                else {
                    emptyNode(block, true);
                }
            });
        })
        
        grid.map(function(row, y) {
            row.map(function(col, x) {
                if (col.state === "active") {
                    newCurrent.push([
                        y, x
                    ])
                }
            })
        })

        current = newCurrent;

        rotatePos++;

        if (rotatePos === 4) {
            rotatePos = 0;
        }

        if (!sfxMuted) {
            sfxBlockRotate.play();
        }
    }
    else {
        current[0][0] = ogStart0;
        current[0][1] = ogStart1;
    }
}

//.....................................................
//...SSSSSSS....LLLL..........AAAAA....MMMMMM...MMMMM..
//..SSSSSSSSS...LLLL..........AAAAA....MMMMMM...MMMMM..
//..SSSSSSSSSS..LLLL.........AAAAAA....MMMMMM...MMMMM..
//.SSSSS..SSSS..LLLL.........AAAAAAA...MMMMMMM.MMMMMM..
//.SSSSS........LLLL........AAAAAAAA...MMMMMMM.MMMMMM..
//..SSSSSSS.....LLLL........AAAAAAAA...MMMMMMM.MMMMMM..
//...SSSSSSSSS..LLLL........AAAA.AAAA..MMMMMMMMMMMMMM..
//.....SSSSSSS..LLLL.......AAAAAAAAAA..MMMMMMMMMMMMMM..
//........SSSSS.LLLL.......AAAAAAAAAAA.MMMMMMMMMMMMMM..
//.SSSS....SSSS.LLLL.......AAAAAAAAAAA.MMMM.MMMMM.MMM..
//.SSSSSSSSSSSS.LLLLLLLLLLLAAA....AAAA.MMMM.MMMMM.MMM..
//..SSSSSSSSSS..LLLLLLLLLLLAAA.....AAAAMMMM.MMMMM.MMM..
//...SSSSSSSS...LLLLLLLLLLLAAA.....AAAAMMMM.MMMMM.MMM..
//.....................................................
function slamDown() {
    if (!slamming) {
        slamStart = current;
        slamming = true;
        
        if (!sfxMuted) {
            // sfxSlamStart.play();
            sfxBlockSlamStart.play();
        }

        if (!slamTimer.running) {
            slamTimer.start();
        }
        else {
            slamTimer.resume();
        }
    }
}

function slamFinish() {
    var slamYStart = null;
    var slamYEnd = null;
    var slamAmount;
    var max;

    slamStart.map(function (block) {
        var ref = grid[block[0]][block[1]];
        var y = ref.node.y;

        if (y > slamYStart || slamYStart === null) {
            slamYStart = y;
        }
    });

    slamEnd.map(function (block) {
        var ref = grid[block[0]][block[1]];
        var y = ref.node.y;

        if (y > slamYEnd || slamYEnd === null) {
            slamYEnd = y;
        }
    });
    
    slamAmount = (slamYEnd - slamYStart);

    max = (stageHeight * blockSize) - (blockSize * 2)

    slamStart = null;
    slamEnd = null;
    
    slamTotal += slamAmount;
    var percentage = (slamTotal / (max * 3)) * 100

    game.camera.shake(slamAmount / 10000, 100);
    brocBloksAni.play(10, false)

    if (!angryMode) {
        if (percentage >= 100) {
            slamOverlay.alpha = 0;
            slamTotal = 0;
            swapMode();
        }
        else {
            slamOverlay.alpha = (percentage / 100) / 4;
        }
    }

    if (!sfxMuted) {
        sfxBlockSlamEnd.play();
        sfxBlockCollide.play();
    }

    updateScore("slam", slamAmount)

    if (angryMode) {
        slamTotal = 0;
    }
}

function createSlamOverlay() {
    slamOverlayHeight = (stageHeight * blockSize) + blockSize / 4;
    slamOverlay = game.add.graphics(-2, 0);
    // 28894E
    slamOverlay.beginFill(0xA51E2D);
    slamOverlay.drawRect(
        0, // X
        (blockSize * headerHeight) - blockSize / 4, // Y
        ((gameWidth) * blockSize) - (blockSize / 2), // Width
        slamOverlayHeight // Height
    );
    slamOverlay.alpha = 0;
    game.world.sendToBack(slamOverlay);

    // slamOverlay.height = 100;
}

//..........................................................
//.DDDDDDDDD......OOOOOOO...OOWWW..WWWWW...WWWWNNNN...NNNN..
//.DDDDDDDDDD....OOOOOOOOOO..OWWW..WWWWW..WWWW.NNNNN..NNNN..
//.DDDDDDDDDDD..OOOOOOOOOOOO.OWWW..WWWWWW.WWWW.NNNNN..NNNN..
//.DDDD...DDDD..OOOOO..OOOOO.OWWW.WWWWWWW.WWWW.NNNNNN.NNNN..
//.DDDD....DDDDDOOOO....OOOOOOWWW.WWWWWWW.WWWW.NNNNNN.NNNN..
//.DDDD....DDDDDOOO......OOOO.WWWWWWWWWWW.WWW..NNNNNNNNNNN..
//.DDDD....DDDDDOOO......OOOO.WWWWWWW.WWWWWWW..NNNNNNNNNNN..
//.DDDD....DDDDDOOO......OOOO.WWWWWWW.WWWWWWW..NNNNNNNNNNN..
//.DDDD....DDDDDOOOO....OOOOO.WWWWWWW.WWWWWWW..NNNNNNNNNNN..
//.DDDD...DDDDD.OOOOO..OOOOO..WWWWWWW.WWWWWWW..NNNN.NNNNNN..
//.DDDDDDDDDDD..OOOOOOOOOOOO...WWWWW...WWWWW...NNNN..NNNNN..
//.DDDDDDDDDD....OOOOOOOOOO....WWWWW...WWWWW...NNNN..NNNNN..
//.DDDDDDDDD.......OOOOOO......WWWWW...WWWWW...NNNN...NNNN..
//..........................................................
function moveDown(timer) {
    var collide = false;

    current.map(function(block) {
        if ((block[0] + 1) === stageHeight) {
            collide = true;
        }
        else {
            var ref = grid[block[0] + 1][block[1]];
            
            if (ref.state === "set") {
                collide = true;
            }
        }
    });

    if (collide) {
        if (timer !== undefined) {
            timer.destroy();
        }

        blockCollision();
    }
    else {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            emptyNode(ref)
        });

        var newCurrent = [];

        current.map(function (block) {
            var newRef = grid[block[0] + 1][block[1]];
            newRef.node.loadTexture(blockColor);
            newRef.state = "active";

            newCurrent.push([
                block[0] + 1, block[1]
            ])
        });

        if (!sfxMuted && !slamming) {
            sfxBlockMoveDown.play();
        }

        current = newCurrent;
    }
}

//..............................................
//.LLLL.......EEEEEEEEEEE.EFFFFFFFFF.TTTTTTTTT..
//.LLLL.......EEEEEEEEEEE.EFFFFFFFFF.TTTTTTTTT..
//.LLLL.......EEEEEEEEEEE.EFFFFFFFFF.TTTTTTTTT..
//.LLLL.......EEEE........EFFF..........TTTT....
//.LLLL.......EEEE........EFFF..........TTTT....
//.LLLL.......EEEEEEEEEE..EFFFFFFFF.....TTTT....
//.LLLL.......EEEEEEEEEE..EFFFFFFFF.....TTTT....
//.LLLL.......EEEEEEEEEE..EFFFFFFFF.....TTTT....
//.LLLL.......EEEE........EFFF..........TTTT....
//.LLLL.......EEEE........EFFF..........TTTT....
//.LLLLLLLLLL.EEEEEEEEEEE.EFFF..........TTTT....
//.LLLLLLLLLL.EEEEEEEEEEE.EFFF..........TTTT....
//.LLLLLLLLLL.EEEEEEEEEEE.EFFF..........TTTT....
//..............................................
function moveLeft() {
    var blocked = false;

    current.map(function (block) {
        if ((block[1] - 1) < 0) {
            blocked = true;
        }
        else {
            var ref = grid[block[0]][block[1] - 1];

            if (ref.state === "set") {
                blocked = true;
            }
        }
    });

    if (!blocked) {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            emptyNode(ref)
        });

        var newCurrent = [];

        current.map(function (block) {
            var newRef = grid[block[0]][block[1] - 1];
            newRef.node.loadTexture(blockColor);
            newRef.state = "active";

            newCurrent.push([
                block[0], block[1] - 1
            ])
        });

        if (!sfxMuted) {
            if (angryMode) {
                sfxBlockMoveLeftHard.play();
            }
            else {
                sfxBlockMoveLeftEasy.play();
            }
        }

        current = newCurrent;
    }
}

//.........................................................
//.RRRRRRRRRR..RIIII....GGGGGGG....GHHH...HHHH..TTTTTTTTT..
//.RRRRRRRRRRR.RIIII..GGGGGGGGGG...GHHH...HHHH..TTTTTTTTT..
//.RRRRRRRRRRR.RIIII.GGGGGGGGGGGG..GHHH...HHHH..TTTTTTTTT..
//.RRRR...RRRRRRIIII.GGGGG..GGGGG..GHHH...HHHH.....TTTT....
//.RRRR...RRRRRRIIIIIGGGG....GGG...GHHH...HHHH.....TTTT....
//.RRRRRRRRRRR.RIIIIIGGG...........GHHHHHHHHHH.....TTTT....
//.RRRRRRRRRRR.RIIIIIGGG..GGGGGGGG.GHHHHHHHHHH.....TTTT....
//.RRRRRRRR....RIIIIIGGG..GGGGGGGG.GHHHHHHHHHH.....TTTT....
//.RRRR.RRRR...RIIIIIGGGG.GGGGGGGG.GHHH...HHHH.....TTTT....
//.RRRR..RRRR..RIIII.GGGGG....GGGG.GHHH...HHHH.....TTTT....
//.RRRR..RRRRR.RIIII.GGGGGGGGGGGG..GHHH...HHHH.....TTTT....
//.RRRR...RRRRRRIIII..GGGGGGGGGG...GHHH...HHHH.....TTTT....
//.RRRR....RRRRRIIII....GGGGGGG....GHHH...HHHH.....TTTT....
//.........................................................
function moveRight() {
    var blocked = false;

    current.map(function (block) {
        if ((block[1] + 1) >= gameWidth - 1) {
            blocked = true;
        }
        else {
            var ref = grid[block[0]][block[1] + 1];

            if (ref.state === "set") {
                blocked = true;
            }
        }
    });

    
    if (!blocked) {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];

            emptyNode(ref)
        });

        var newCurrent = [];

        current.map(function (block) {
            var newRef = grid[block[0]][block[1] + 1];
            newRef.node.loadTexture(blockColor);
            newRef.state = "active";

            newCurrent.push([
                block[0], block[1] + 1
            ])
        });

        if (!sfxMuted) {
            if (angryMode) {
                sfxBlockMoveRightHard.play();
            } else {
                sfxBlockMoveRightEasy.play();
            }
        }

        current = newCurrent;
    }
}

//.................................................................................
//....CCCCCCC......OOOOOOO.....LLLL.......LLLL......IIIII.DDDDDDDDD....EEEEEEEEEE..
//...CCCCCCCCC....OOOOOOOOOO...LLLL.......LLLL......IIIII.DDDDDDDDDD...EEEEEEEEEE..
//..CCCCCCCCCCC..OOOOOOOOOOOO..LLLL.......LLLL......IIIII.DDDDDDDDDDD..EEEEEEEEEE..
//..CCCC...CCCCC.OOOOO..OOOOO..LLLL.......LLLL......IIIII.DDDD...DDDD..EEEE........
//.CCCC.....CCC.OOOOO....OOOOO.LLLL.......LLLL......IIIII.DDDD....DDDD.EEEE........
//.CCCC.........OOOO......OOOO.LLLL.......LLLL......IIIII.DDDD....DDDD.EEEEEEEEEE..
//.CCCC.........OOOO......OOOO.LLLL.......LLLL......IIIII.DDDD....DDDD.EEEEEEEEEE..
//.CCCC.........OOOO......OOOO.LLLL.......LLLL......IIIII.DDDD....DDDD.EEEEEEEEEE..
//.CCCC.....CCC.OOOOO....OOOOO.LLLL.......LLLL......IIIII.DDDD....DDDD.EEEE........
//..CCCC...CCCCC.OOOOO..OOOOO..LLLL.......LLLL......IIIII.DDDD...DDDDD.EEEE........
//..CCCCCCCCCCC..OOOOOOOOOOOO..LLLLLLLLLL.LLLLLLLLLLIIIII.DDDDDDDDDDD..EEEEEEEEEE..
//...CCCCCCCCCC...OOOOOOOOOO...LLLLLLLLLL.LLLLLLLLLLIIIII.DDDDDDDDDD...EEEEEEEEEE..
//....CCCCCCC.......OOOOOO.....LLLLLLLLLL.LLLLLLLLLLIIIII.DDDDDDDDD....EEEEEEEEEE..
//.................................................................................
function blockCollision() {
    if (!colliding) {
        var bufferZone = false;
        colliding = true;
    
        if (slamTimer.running) {
            slamTimer.pause();
        }

        pauseDropTimers();
        
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.state = "set";

            if (ref.node.y <= (((headerHeight + 2) * (blockSize)))) {
                bufferZone = true;
            }
        });
        
        if (bufferZone) {
            if (!sfxMuted) {
                // sfxGameover.play();
                sfxBrokSnore.stop();
            }
            
            angryDropTimer.pause();
            brocIdleAni.stop();
            dropTimer.pause();
            // audioSleepTrans.pause();

            gameOver();
        }
        else {
            if (slamming) {
                slamEnd = current;
                slamming = false;
                slamFinish();
                flash();
                explode();
            }
            else {
                flash();
                updateScore("normal");

                if (!sfxMuted) {
                    sfxBlockCollide.play();
                }
            }
        }
    }
}

//...........................................
//.PPPPPPPPP...PEEEEEEEEEEEEWW..WWWWW...WWW..
//.PPPPPPPPPP..PEEEEEEEEEEEEWW..WWWWW..WWWW..
//.PPPPPPPPPPP.PEEEEEEEEEEEEWW..WWWWWW.WWWW..
//.PPPP...PPPP.PEEE.......EEWW.WWWWWWW.WWWW..
//.PPPP...PPPP.PEEE.......EEWW.WWWWWWW.WWWW..
//.PPPPPPPPPPP.PEEEEEEEEE..EWWWWWWWWWW.WWW...
//.PPPPPPPPPP..PEEEEEEEEE..EWWWWWW.WWWWWWW...
//.PPPPPPPPP...PEEEEEEEEE..EWWWWWW.WWWWWWW...
//.PPPP........PEEE........EWWWWWW.WWWWWWW...
//.PPPP........PEEE........EWWWWWW.WWWWWWW...
//.PPPP........PEEEEEEEEEE..WWWWW...WWWWW....
//.PPPP........PEEEEEEEEEE..WWWWW...WWWWW....
//.PPPP........PEEEEEEEEEE..WWWWW...WWWWW....
//...........................................
function flash() {
    var color = blockColor;

    game.time.events.add(blockFlashInterval, function () {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.node.loadTexture("block-flash-2");
        });
    }, this);

    game.time.events.add(blockFlashInterval * 2, function () {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.node.loadTexture("block-flash-1");
        });
    }, this);

    game.time.events.add(blockFlashInterval * 3, function () {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.node.loadTexture("block-flash-2");
        });
    }, this);

    game.time.events.add(blockFlashInterval * 4, function () {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.node.loadTexture("block-flash-2");
        });
    }, this);

    game.time.events.add(blockFlashInterval * 5, function () {
        current.map(function (block) {
            var ref = grid[block[0]][block[1]];
            ref.node.loadTexture(color);
        });
    }, this);

    game.time.events.add(blockFlashInterval * 5, function () {
        checkRows();
    }, this);
}

function explode() {
    var mY = null;
    var lX = null;
    var rX = null;

    current.map(function (block) {
        var ref = grid[block[0]][block[1]];

        var y = ref.node.y;

        if (y > mY || mY === null) {
            mY = y;
        }
    });

    current.map(function (block) {
        var ref = grid[block[0]][block[1]];

        var x = ref.node.worldPosition.x;
        var y = ref.node.worldPosition.y;

        if (x < lX && y === mY || lX === null && y === mY) {
            lX = x;
        }

        if (x > rX && y === mY || rX === null && y === mY) {
            rX = x;
        }
    })

    game.time.events.add(blockFlashInterval * 2, function () {
        var explodeLeft = game.add.sprite(lX, mY, 'explosion');
        var explodeAnimLeft = explodeLeft.animations.add('pew');

        explodeLeft.anchor = 0.5;
        explodeLeft.scale.x = -1;

        var explodeRight = game.add.sprite(rX, mY, 'explosion');
        var explodeAnimRight = explodeRight.animations.add('pew');

        explodeRight.anchor = 0.5;
        explodeRight.scale.x = 1;

        explodeAnimLeft.onComplete.add(function () {
            explodeLeft.destroy();
        }, this);

        explodeAnimRight.onComplete.add(function () {
            explodeRight.destroy();
        }, this);

        explodeAnimLeft.play(15, false);
        explodeAnimRight.play(15, false);
    }, this);
}

//.................................................................
//.RRRRRRRRRR.....OOOOOOO...OOWWW..WWWWW...WWWW.... MMMMM...MMMMM..
//.RRRRRRRRRRR...OOOOOOOOOO..OWWW..WWWWW..WWWW..... MMMMM...MMMMM..
//.RRRRRRRRRRR..OOOOOOOOOOOO.OWWW..WWWWWW.WWWW..... MMMMM...MMMMM..
//.RRRR...RRRRR.OOOOO..OOOOO.OWWW.WWWWWWW.WWWW..... MMMMMM.MMMMMM..
//.RRRR...RRRRRROOOO....OOOOOOWWW.WWWWWWW.WWWW..... MMMMMM.MMMMMM..
//.RRRRRRRRRRR.ROOO......OOOO.WWWWWWWWWWW.WWW...... MMMMMM.MMMMMM..
//.RRRRRRRRRRR.ROOO......OOOO.WWWWWWW.WWWWWWW...... MMMMMMMMMMMMM..
//.RRRRRRRR....ROOO......OOOO.WWWWWWW.WWWWWWW...... MMMMMMMMMMMMM..
//.RRRR.RRRR...ROOOO....OOOOO.WWWWWWW.WWWWWWW...... MMMMMMMMMMMMM..
//.RRRR..RRRR...OOOOO..OOOOO..WWWWWWW.WWWWWWW...... MMM.MMMMM.MMM..
//.RRRR..RRRRR..OOOOOOOOOOOO...WWWWW...WWWWW....... MMM.MMMMM.MMM..
//.RRRR...RRRRR..OOOOOOOOOO....WWWWW...WWWWW....... MMM.MMMMM.MMM..
//.RRRR....RRRR....OOOOOO......WWWWW...WWWWW....... MMM.MMMMM.MMM..
//.................................................................
function checkRows() {
    var matched = 0;
    var startFrom = null;

    grid.map(function(row, y) {
        var filled = true;
        row.map(function(ref) {
            if (ref.state !== "set") {
                filled = false;
            }
        })
        
        if (filled) {
            startFrom = y;
            matched++;

            if (!sfxMuted) {
                sfxBlockMatch.play();
            }

            game.time.events.add(blockFlashInterval, function () {
                row.map(function (ref) {
                    ref.node.loadTexture('block-flash-2');
                });
            }, this);

            game.time.events.add(blockFlashInterval * 2, function () {
                row.map(function (ref) {
                    ref.node.loadTexture('block-flash-1');
                });
            }, this);

            game.time.events.add(blockFlashInterval * 3, function () {
                row.map(function (ref) {
                    ref.node.loadTexture('block-flash-2');
                });
            }, this);

            game.time.events.add(blockFlashInterval * 4, function () {
                row.map(function (ref) {
                    ref.node.loadTexture('block-flash-1');
                });
            }, this);

            game.time.events.add(blockFlashInterval * 7, function () {
                row.map(function (ref) {
                    ref.state = "empty";
                    ref.node.loadTexture('node');
                });
            }, this);
        }
    })

    if (matched === 0) {
        current = [];
        spawnBlock();
    }
    else {
        game.time.events.add(blockFlashInterval * 7, function () {
            var reversed = grid.slice().reverse();

            reversed.map(function (row, y) {
                if ((reversed.length - y) <= ((startFrom)) && (reversed.length - y) > 3) {
                    row.map(function(col, x) {
                        var copy = grid[(reversed.length - y) - matched][x]
                        var paste = grid[(reversed.length - y)][x]

                        if ((reversed.length - y) - matched > 3) {
                            paste.node.loadTexture(copy.node.key)
                            paste.state = copy.state;
                            
                            copy.node.loadTexture('node')
                            copy.state = "empty";
                        }
                    })
                }
            });

            current = [];
            spawnBlock();
            updateScore("row", matched);
        }, this);
    }
}
//..........................................................
//.....GGGGGGG....LLLL.........OOOOOOO...OWWWW..WWWWW...WW..
//...GGGGGGGGGG...LLLL........OOOOOOOOOO..WWWW..WWWWW..WWW..
//..GGGGGGGGGGGG..LLLL.......OOOOOOOOOOOO.WWWW..WWWWWW.WWW..
//..GGGGG..GGGGG..LLLL.......OOOOO..OOOOO.WWWW.WWWWWWW.WWW..
//.GGGGG....GGG...LLLL......OOOOO....OOOOOWWWW.WWWWWWW.WWW..
//.GGGG...........LLLL......OOOO......OOOO.WWWWWWWWWWW.WWW..
//.GGGG..GGGGGGGG.LLLL......OOOO......OOOO.WWWWWWW.WWWWWWW..
//.GGGG..GGGGGGGG.LLLL......OOOO......OOOO.WWWWWWW.WWWWWWW..
//.GGGGG.GGGGGGGG.LLLL......OOOOO....OOOOO.WWWWWWW.WWWWWWW..
//..GGGGG....GGGG.LLLL.......OOOOO..OOOOO..WWWWWWW.WWWWWWW..
//..GGGGGGGGGGGG..LLLLLLLLLL.OOOOOOOOOOOO...WWWWW...WWWWW...
//...GGGGGGGGGG...LLLLLLLLLL..OOOOOOOOOO....WWWWW...WWWWW...
//.....GGGGGGG....LLLLLLLLLL....OOOOOO......WWWWW...WWWWW...
//..........................................................
function emptyNode(ref, ignore) {
    ref.state = "glow-2";

    if (angryMode) {
        ref.node.loadTexture('glow-4');
    }
    else {
        ref.node.loadTexture('glow-2');
    }

    ref.glowTimer = game.time.create(false);

    ref.glowTimer.loop(glowTimerInterval, function () {
        if (ref.state === "glow-2") {
            ref.state = "glow-1";

            if (angryMode) {
                ref.node.loadTexture('glow-3');
            }
            else {
                ref.node.loadTexture('glow-1');
            }
        }

        if (ref.state === "glow-1") {
            ref.state = "empty";
            ref.node.loadTexture('node');
            ref.glowTimer.destroy();
        }
    }, this);

    if (ref.node.y / blockSize < (headerHeight + 3)) {
        ref.node.loadTexture('buffer');
    }
    else {
        if (ignore) {
            ref.state = "empty";
            ref.node.loadTexture('node');
            ref.glowTimer.destroy();
        }
        else {
            ref.glowTimer.start();
        }
    }
}

//...........................................................
//.....GGGGGGG.......GGGGGGG..GGWWW..WWWWW...WWWPPPPPPPPPP...
//...GGGGGGGGGG....GGGGGGGGGG..GWWW..WWWWW..WWWW.PPPPPPPPPP..
//..GGGGGGGGGGGG..GGGGGGGGGGGG.GWWW..WWWWWW.WWWW.PPPPPPPPPP..
//..GGGGG..GGGGG..GGGGG..GGGGG.GWWW.WWWWWWW.WWWW.PPPP...PPP..
//.GGGGG....GGG..GGGGG....GGG..GWWW.WWWWWWW.WWWW.PPPP...PPP..
//.GGGG..........GGGG...........WWWWWWWWWWW.WWW..PPPPPPPPPP..
//.GGGG..GGGGGGGGGGGG..GGGGGGGG.WWWWWWW.WWWWWWW..PPPPPPPPPP..
//.GGGG..GGGGGGGGGGGG..GGGGGGGG.WWWWWWW.WWWWWWW..PPPPPPPPP...
//.GGGGG.GGGGGGGGGGGGG.GGGGGGGG.WWWWWWW.WWWWWWW..PPPP........
//..GGGGG....GGGG.GGGGG....GGGG.WWWWWWW.WWWWWWW..PPPP........
//..GGGGGGGGGGGG..GGGGGGGGGGGG...WWWWW...WWWWW...PPPP........
//...GGGGGGGGGG....GGGGGGGGGG....WWWWW...WWWWW...PPPP........
//.....GGGGGGG.......GGGGGGG.....WWWWW...WWWWW...PPPP........
//...........................................................
function gameOver() {
    ggwp = true;

    if (!musicMuted) {
        musicA1toA2.stop();
        musicB.stop();
        musicAtoB.stop();
        musicGameOver.play();
    }

    playTransition();
    // showOutro();
}

//................................................
//.MMMMMM...MMMMMMIIIII..SSSSSSS......CCCCCCC.....
//.MMMMMM...MMMMMMIIIII.SSSSSSSSS....CCCCCCCCC....
//.MMMMMM...MMMMMMIIIII.SSSSSSSSSS..CCCCCCCCCCC...
//.MMMMMMM.MMMMMMMIIIIISSSSS..SSSS..CCCC...CCCCC..
//.MMMMMMM.MMMMMMMIIIIISSSSS.......SCCC.....CCC...
//.MMMMMMM.MMMMMMMIIIII.SSSSSSS....SCCC...........
//.MMMMMMMMMMMMMMMIIIII..SSSSSSSSS.SCCC...........
//.MMMMMMMMMMMMMMMIIIII....SSSSSSS.SCCC...........
//.MMMMMMMMMMMMMMMIIIII.......SSSSSSCCC.....CCC...
//.MMMM.MMMMM.MMMMIIIIISSSS....SSSS.CCCC...CCCCC..
//.MMMM.MMMMM.MMMMIIIIISSSSSSSSSSSS.CCCCCCCCCCC...
//.MMMM.MMMMM.MMMMIIIII.SSSSSSSSSS...CCCCCCCCCC...
//.MMMM.MMMMM.MMMMIIIII..SSSSSSSS.....CCCCCCC.....
//................................................

function render() {

}

function getRandomNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function startGame(type) {
    introOverlay.inputEnabled = false;
    introOverlay.alpha = 0;
    logo.alpha = 0;
    stopTapToPlay = true;

    if (type === 1) {
        loadInstructions();
    }
    else if (type === 2) {
        instructionsOverlay.alpha = 0;
        instructions.alpha = 0;
        startCountdown();
    }
    
    // 

    // countdown.alpha = 0;
    // pauseOverlay.alpha = 0;
    // spawnBlock();
    // resumeDropTimers();
    // brocSleepAni.play(10, true);
}

function loadInstructions() {
    instructionsOverlay = game.add.graphics(-2, 0);
    instructionsOverlay.beginFill(0x181425); //0x181425
    instructionsOverlay.drawRect(
        -(blockSize / 4), // X
        0, // Y
        ((gameWidth) * blockSize) + (blockSize / 2), // Width
        gameHeight * blockSize // Height
    );
    instructionsOverlay.alpha = 1;

    instructions = game.add.image(
        ((game.width / 2) - 4),
        ((game.height / 2)),
        'instructions'
    );

    instructions.anchor.x = 0.5;
    instructions.anchor.y = 0.5;
    instructionsDone = true;

    game.world.bringToTop(transition);
}

function startAudio() {
    if (!musicMuted) {
        musicIntroA1.play();

        musicIntroA1.onStop.add(function() {
            
            musicA1toA2.loopFull(1);
        }, this)
    }
}