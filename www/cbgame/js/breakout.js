/**
 * Created by daniel on 30/08/15.
 */
var Breakout = (function () {

    //The Phaser game object
    var game;

    //BreakoutGame contains the various game states
    var BreakoutGame = {};

    var ballSpeed = 250;

    var highscore;

    /*
     The boot state just loads the required images for the
     preloader, and performs any required initial setup.
     */
    BreakoutGame.bootState = function (game) {
        console.log('CASTLE BREAKOUT - DAN DOOLEY - 2015');
    };
    BreakoutGame.bootState.prototype = {
        preload: function () {
            this.game.load.image('ldbar', 'assets/ldbar.png');
            this.game.load.image('ldbarouter', 'assets/ldbarouter.png');
        },

        create: function () {
            this.game.state.start('preloader');
        }
    };

    BreakoutGame.preloader = function (game) {
    };
    BreakoutGame.preloader.prototype = {
        preload: function () {
            this.game.add.sprite(175, 285, 'ldbarouter');
            var loader = this.game.add.sprite(175, 285, 'ldbar');
            this.game.load.setPreloadSprite(loader);
            this.game.load.image('bg', 'assets/bg.png');
            this.game.load.image('box1', 'assets/box.png');
            this.game.load.image('box2', 'assets/boxAlt.png');
            this.game.load.image('boxCoin', 'assets/boxCoin_disabled.png');
            this.game.load.image('box3', 'assets/boxEmpty.png');
            this.game.load.image('boxItem', 'assets/boxItemAlt.png');
            this.game.load.image('coin1', 'assets/coinBronze.png');
            this.game.load.image('coin2', 'assets/coinSilver.png');
            this.game.load.image('coin3', 'assets/coinGold.png');
            this.game.load.image('hudCoin', 'assets/hud_coins.png');
            this.game.load.image('hudHeartEmpty', 'assets/hud_heartEmpty.png');
            this.game.load.image('hudHeartFull', 'assets/hud_heartFull.png');
            this.game.load.image('p1', 'assets/hud_p1.png');
            this.game.load.image('p2', 'assets/hud_p2.png');
            this.game.load.image('p3', 'assets/hud_p3.png');
            this.game.load.image('particleW1', 'assets/particleBrick1a.png');
            this.game.load.image('particleW2', 'assets/particleBrick1b.png');
            this.game.load.image('particleS1', 'assets/particleBrick2a.png');
            this.game.load.image('particleS2', 'assets/particleBrick2b.png');
            this.game.load.image('star', 'assets/star.png');
            this.game.load.image('stone', 'assets/stoneCenter_rounded.png');
            this.game.load.image('stone1', 'assets/stoneCenter_rounded_crack.png');
            this.game.load.image('stoneWall', 'assets/stoneWall.png');
            this.game.load.image('key', 'assets/keyRed.png');
            this.game.load.image('lock', 'assets/lock_red.png');
            this.game.load.image('tnt', 'assets/boxWarning.png');
            this.game.load.spritesheet('explosion', 'assets/explosion.png', 100, 100, 20);
            this.game.load.spritesheet('stars', 'assets/stars.png', 50, 50, 16);
            this.game.load.spritesheet('hearts', 'assets/hearts.png', 50, 50, 16);
            this.game.load.spritesheet('coins', 'assets/coins.png', 50, 50, 16);
            this.game.load.image('logo', 'assets/logo.png');
            this.game.load.audio('bounce', 'assets/sound/bounce.wav');
            this.game.load.audio('death', 'assets/sound/death.wav');
            this.game.load.audio('explosion', 'assets/sound/explosion.wav');
            this.game.load.audio('item', 'assets/sound/item.wav');
            this.game.load.audio('lock', 'assets/sound/lock.wav');
            this.game.load.audio('victory', 'assets/sound/victory.wav');
            this.game.load.audio('wood', 'assets/sound/wood.wav');
            this.game.load.audio('stone', 'assets/sound/stone.wav');
        },

        create: function () {
            this.game.state.start('menuState');
        }
    };

    //defining main menu state
    BreakoutGame.menuState = function (game) {
    };
    BreakoutGame.menuState.prototype = {
        create: function () {
            //sprite for bg
            this.game.add.sprite(0, 0, 'bg');

            //create a group for outside walls
            var walls = this.game.add.group();

            //populate it
            for (var i = 0; i < 10; i++) {
                walls.create(i * 70, 0, 'stoneWall');
            }
            for (var i = 1; i < 10; i++) {
                walls.create(0, i * 70, 'stoneWall');
                walls.create(9 * 70, i * 70, 'stoneWall');
            }


            var title = this.game.add.sprite(157, 90, 'logo');

            var play = this.game.add.text(235, 570, 'PLAY', {font: '50pt agent_orangeregular', fill: 'white'});

            /*
            this.game.input.onDown.add(function () {
                var x = this.game.input.x;
                var y = this.game.input.y;
                if (x > 235 && x < 475 && y > 170 && y < 250) {
                    this.game.state.start('game');
                }
            }, this);
            */

            play.inputEnabled = true;
            play.input.useHandCursor = true; //if you want a hand cursor
            play.events.onInputDown.add(function(){
                this.game.state.start('game');
            }, this);



            this.ui = this.game.add.group();
            this.uicoin = this.ui.create(580, 655, 'coin3');
            var uistr;
            switch (highscore.toString().length) {
                case 1:
                    uistr = '00' + highscore.toString();
                    break;
                case 2:
                    uistr = '0' + highscore.toString();
                    break;
                default:
                    uistr = highscore.toString();
                    break;
            }
            this.uiscore = this.game.add.text(570, 650, uistr, {
                font: '28pt agent_orangeregular',
                fill: 'white',
                align: 'right'
            }, this.ui);
            this.uiscore.anchor.set(1, 0);

        }
    };

    //defining the main game state
    BreakoutGame.gameState = function (game) {
    };
    BreakoutGame.gameState.prototype = {
        create: function () {
            //physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            //sprite for bg
            this.game.add.sprite(0, 0, 'bg');

            //create a group for outside walls
            this.walls = this.game.add.group();

            //enable body
            this.walls.enableBody = true;

            //populate it
            for (var i = 0; i < 10; i++) {
                var wall = this.walls.create(i * 70, 0, 'stoneWall');
                wall.body.immovable = true;
                //only collide on bottom side
                wall.body.checkCollision.left = false;
                wall.body.checkCollision.right = false;
            }
            //side walls
            for (var i = 1; i < 10; i++) {
                wall = this.walls.create(0, i * 70, 'stoneWall');
                wall.body.immovable = true;
                wall.body.checkCollision.down = false;
                wall.body.checkCollision.up = false;
                wall = this.walls.create(9 * 70, i * 70, 'stoneWall');
                wall.body.immovable = true;
                wall.body.checkCollision.down = false;
                wall.body.checkCollision.up = false;
            }
            console.log(this.walls.children.length);


            //create the players paddle and set physics
            this.paddle = this.game.add.sprite(280, 600, 'ldbar');
            this.paddle.scale.setTo(0.5);
            this.paddle.anchor.setTo(0.5, 0.5);
            this.game.physics.arcade.enable(this.paddle);
            this.paddle.enableBody = true;
            this.paddle.body.immovable = true;

            //balls group
            this.balls = game.add.group();

            //create the ball and set physics
            this.ball = this.game.add.sprite(100, 450, 'p1');
            this.game.physics.arcade.enable(this.ball);
            this.ball.enableBody = true;
            this.ball.body.bounce.setTo(1, 1);
            this.balls.add(this.ball);

            //create box group
            this.boxes = this.game.add.group();
            this.boxes.enableBody = true;

            //create group for falling items
            this.items = this.game.add.group();
            this.items.enableBody = true;

            //var sets whether or not multiball is in effect
            //first value is this.ball and second is this.ball2
            this.multiball = [1, 0];
            //ball 2 is the multi ball
            this.ball2 = this.game.add.sprite(553, 450, 'p2');
            this.game.physics.arcade.enable(this.ball2);
            this.ball2.enableBody = true;
            this.ball2.body.bounce.setTo(1, 1);
            this.ball2.kill();

            this.balls.add(this.ball2);

            //set the first level
            this.level = 1;
            //number of levels
            this.maxlevel = levels.length;

            //player health
            this.health = 3;

            //player score
            this.score = 0;

            //call the first level
            this.createLevel(this.level);

            //particles group
            this.particles = this.game.add.group();
            this.particles.enableBody = true;

            //ui elements
            this.ui = this.game.add.group();
            this.ui.z = 200;
            this.health1 = this.ui.create(80, 650, 'hudHeartFull');
            this.health2 = this.ui.create(140, 650, 'hudHeartFull');
            this.health3 = this.ui.create(200, 650, 'hudHeartFull');
            this.uicoin = this.ui.create(580, 655, 'coin3');

            this.uiscore = this.game.add.text(570, 650, '000', {
                font: '28pt agent_orangeregular',
                fill: 'white',
                align: 'right'
            }, this.ui);
            this.uiscore.anchor.set(1, 0);

            //setup sounds
            this.sounds = {};
            this.sounds.stone = this.game.add.audio('stone');
            this.sounds.stone.volume = 0.2;
            this.sounds.death = this.game.add.audio('death');
            this.sounds.death.volume = 0.8;
            this.sounds.explosion = this.game.add.audio('explosion');
            this.sounds.explosion.volume = 0.8;
            this.sounds.item = this.game.add.audio('item');
            this.sounds.item.volume = 0.8;
            this.sounds.lock = this.game.add.audio('lock');
            this.sounds.bounce = this.game.add.audio('bounce');
            this.sounds.bounce.volume = 0.7;
            this.sounds.victory = this.game.add.audio('victory');
            this.sounds.victory.volume = 0.6;
            this.sounds.wood = this.game.add.audio('wood');
            this.sounds.wood.addMarker('short', 0, 0.8, 0.8);
        },

        update: function () {
            this.updateScore();
            //this.game.debug.body(this.paddle);

            //move paddle with mouse
            var mouseloc = this.game.input.mousePointer.x;
            if (mouseloc > 70 + 75 && mouseloc < 630 - 70) {
                this.paddle.body.x = mouseloc - 85;
            } else if (mouseloc < 70 + 75) {
                this.paddle.body.x = 60;
            } else if (mouseloc > 630 - 70) {
                this.paddle.body.x = 475;
            }

            //bounce ball
            this.game.physics.arcade.overlap(this.paddle, this.balls, function (paddle, ball) {
                if (ball.body.y + ball.body.height < 600) { //make sure ball only bounces off the top of the paddle
                    //get some values
                    var ballX = ball.body.x + ball.body.halfWidth;
                    var paddleX = paddle.body.x + paddle.body.halfWidth;
                    //calculate the point where they collide
                    var diff = ballX - paddleX;
                    //use this to calculate the angle to bounce off at
                    var newSpeed = (diff / paddle.body.halfWidth) * ballSpeed;
                    //bounce
                    ball.body.velocity.x = newSpeed;
                    ball.body.velocity.y = -ballSpeed;
                    this.sounds.bounce.play();
                }
            }, null, this);
            this.game.physics.arcade.collide(this.balls, this.walls, function(ball, wall){
                this.sounds.bounce.play();
            }, null, this);

            //collide ball with boxes
            this.game.physics.arcade.collide(this.balls, this.boxes, this.boxSmash, null, this);

            //check for either ball out of bounds
            if (this.ball.body.y > 700 || this.ball2.body.y > 700) {
                if (this.ball.body.y > 700) {
                    if (this.multiball[0] == 1 && this.multiball[1] == 1) {
                        //reset ball
                        this.ball.body.velocity.x = 0;
                        this.ball.body.velocity.y = 0;
                        this.ball.body.x = 100;
                        this.ball.body.y = 450;
                        //kill
                        this.ball.kill();
                        this.multiball = [0, 1];
                    } else {
                        this.sounds.death.play();
                        this.ball.body.velocity.x = 0;
                        this.ball.body.velocity.y = 0;
                        this.ball.body.x = 100;
                        this.ball.body.y = 450;

                        this.health--;
                        this.updateHealth();

                        //launch ball after a few seconds
                        var timer = this.game.time.create(this.game);
                        timer.add(2000, function () {
                            this.ball.body.velocity.x = ballSpeed;
                            this.ball.body.velocity.y = ballSpeed;
                        }, this);
                        timer.start();
                        this.multiball = [1, 0];
                    }
                } else {
                    if (this.multiball[0] == 1 && this.multiball[1] == 1) {
                        this.ball2.body.velocity.x = 0;
                        this.ball2.body.velocity.y = 0;
                        this.ball2.body.x = 553;
                        this.ball2.body.y = 450;
                        //kill
                        this.ball2.kill();
                        this.multiball = [1, 0];
                    } else {
                        this.sounds.death.play();
                        this.ball.revive();
                        this.ball.body.velocity.x = 0;
                        this.ball.body.velocity.y = 0;
                        this.ball.body.x = 100;
                        this.ball.body.y = 450;

                        this.ball2.body.velocity.x = 0;
                        this.ball2.body.velocity.y = 0;
                        this.ball2.body.x = 553;
                        this.ball2.body.y = 450;
                        //kill
                        this.ball2.kill();

                        this.health--;
                        this.updateHealth();

                        //launch ball after a few seconds
                        var timer = this.game.time.create(this.game);
                        timer.add(2000, function () {
                            this.ball.body.velocity.x = ballSpeed;
                            this.ball.body.velocity.y = ballSpeed;
                        }, this);
                        timer.start();
                        this.multiball = [1, 0];
                    }
                }
            }

            //check for items on paddles
            this.game.physics.arcade.overlap(this.paddle, this.items, function (paddle, item) {
                if (item.body.y + item.body.height < 600) { //only allow items to touch the top
                    this.sounds.item.play();
                    var particleKey = '';
                    if (item.name == 'coin1') {
                        this.score += 1;
                        particleKey = 'coins';
                    } else if (item.name == 'coin2') {
                        this.score += 4;
                        particleKey = 'coins';
                    } else if (item.name == 'coin3') {
                        this.score += 10;
                        particleKey = 'coins';
                    } else if (item.name == 'heart') {
                        this.health++;
                        this.updateHealth();
                        particleKey = 'hearts';
                    } else if (item.name == 'star') {
                        if (this.multiball[1] != 1) {
                            this.ball2.revive();
                            this.multiball = [1, 1];
                            var timer = this.game.time.create(this.game);
                            timer.add(2000, function () {
                                this.ball2.body.velocity.x = -ballSpeed;
                                this.ball2.body.velocity.y = ballSpeed;

                            }, this);
                            timer.start();
                        }
                        particleKey = 'stars';
                    }
                    var particle = this.particles.create((item.body.x + item.body.width/2) - 50, (item.body.y + item.body.height - 2) - 50, particleKey);
                    particle.width = 100;
                    particle.height = 100;
                    particle.animations.add('spark');
                    particle.animations.play('spark', 30, false, true);
                    item.destroy();
                }
            }, null, this);
        },

        createLevel: function (level) {
            var levelArr = getLevel(level);

            //reset ball
            this.ball.revive();
            this.ball.body.velocity.x = 0;
            this.ball.body.velocity.y = 0;
            this.ball.body.x = 100;
            this.ball.body.y = 450;

            this.ball2.body.velocity.x = 0;
            this.ball2.body.velocity.y = 0;
            this.ball2.body.x = 553;
            this.ball2.body.y = 450;
            this.ball2.kill();
            this.multiball = [1, 0];

            this.layout = [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null]
            ];

            //create boxes
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 8; j++) {
                    var box;
                    if (levelArr[i][j] == 1) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'box' + (Math.floor((Math.random() * 3) + 1)));
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'box';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 2) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'boxCoin');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'boxCoin';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 3) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'boxItem');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'boxItem';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 4) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'stone');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'stone';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 5) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'key');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'key';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 6) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'lock');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'lock';
                        box.locationy = i;
                        box.locationx = j;
                    } else if (levelArr[i][j] == 7) {
                        box = this.boxes.create(j * 70 + 70, i * 70 + 70, 'tnt');
                        box.body.immovable = true;
                        this.layout[i][j] = box;
                        box.name = 'tnt';
                        box.locationy = i;
                        box.locationx = j;
                    }
                }
            }

            console.log(this.layout);

            //launch ball after a few seconds
            var timer = this.game.time.create(this.game);
            timer.add(2000, function () {
                //this.particles.removeAll(true);
                //clear items
                //this.items.removeAll(true);
                this.ball.body.velocity.x = ballSpeed;
                this.ball.body.velocity.y = ballSpeed;
            }, this);
            timer.start();
        },

        boxSmash: function (ball, box) {
            if (box.name != 'stone') {
                this.layout[box.locationy][box.locationx] = null;
            }
            //normal boxes
            if (box.name == 'box') {
                box.destroy();
                var i = (Math.floor((Math.random() * 3) + 1));
                if (i == 3) {
                    var coin = this.items.create(box.body.x + 35 - 18, box.body.y + 35 - 18, 'coin1');
                    coin.enableBody = true;
                    this.game.physics.arcade.enable(coin);
                    coin.body.gravity.y = 20;
                    coin.checkWorldBounds = true;
                    coin.outOfBoundsKill = true;
                    coin.name = 'coin1';
                }
            } else if (box.name == 'boxCoin') {
                box.destroy();
                //spawn a coin
                var coin = this.items.create(box.body.x + 35 - 18, box.body.y + 35 - 18, 'coin2');
                coin.enableBody = true;
                this.game.physics.arcade.enable(coin);
                coin.body.gravity.y = 20;
                coin.checkWorldBounds = true;
                coin.outOfBoundsKill = true;
                coin.name = 'coin2';
            } else if (box.name == 'boxItem') {
                box.destroy();
                //spawn an item
                /*
                 1 = gold coin
                 2 = heart (only if not at full health)
                 3 = star
                 */
                var spawned = false;
                while (!spawned) {
                    var i = (Math.floor((Math.random() * 3) + 1));
                    var item;
                    if (i < 2) {
                        item = this.items.create(box.body.x + 35 - 18, box.body.y + 35 - 18, 'coin3');
                        spawned = true;
                        item.name = ('coin3');
                    } else if (i < 3) {
                        //check if health is full
                        if (this.health != 3) {
                            item = this.items.create(box.body.x + 35 - 26, box.body.y + 35 - 22, 'hudHeartFull');
                            spawned = true;
                            item.name = ('heart');
                        }
                    } else if (i == 3) {
                        if (!(this.multiball[1] == 1)) {
                            item = this.items.create(box.body.x + 35 - 17, box.body.y + 35 - 15, 'star');
                            spawned = true;
                            item.name = ('star');
                        }
                    }
                    if (spawned) {
                        item.enableBody = true;
                        this.game.physics.arcade.enable(item);
                        item.body.gravity.y = 28;
                        item.checkWorldBounds = true;
                        item.outOfBoundsKill = true;
                    }
                }
            } else if (box.name === 'stone') {
                if (ball != null) {
                    box.name = 'stone1';
                    box.loadTexture('stone1');
                } else {
                    box.destroy();
                    var i = (Math.floor((Math.random() * 3) + 1));
                    if (i === 3) {
                        var coin = this.items.create(box.body.x + 35 - 18, box.body.y + 35 - 18, 'coin2');
                        coin.enableBody = true;
                        this.game.physics.arcade.enable(coin);
                        coin.body.gravity.y = 20;
                        coin.checkWorldBounds = true;
                        coin.outOfBoundsKill = true;
                        coin.name = 'coin2';
                    }
                }
                this.sounds.stone.play();
            } else if (box.name === 'stone1') {
                box.destroy();
                this.sounds.stone.play();
                var i = (Math.floor((Math.random() * 3) + 1));
                if (i === 3) {
                    var coin = this.items.create(box.body.x + 35 - 18, box.body.y + 35 - 18, 'coin2');
                    coin.enableBody = true;
                    this.game.physics.arcade.enable(coin);
                    coin.body.gravity.y = 20;
                    coin.checkWorldBounds = true;
                    coin.outOfBoundsKill = true;
                    coin.name = 'coin2';
                }
            } else if (box.name === 'key') {
                box.destroy();
                //remove all locks
                var destroy = [];
                this.boxes.forEach(function (child) {
                    if (child.name === 'lock') {
                        destroy.push(child);
                    }
                }, this);
                var i = destroy.length - 1;
                while (i > -1) {
                    var getItem = destroy[i];
                    getItem.destroy();
                    i--;
                }
            } else if (box.name == 'tnt') {
                box.destroy();
                for (var x = -1; x < 2; x++) {
                    for (var y = -1; y < 2; y++) {
                        if (box.locationx + x > -1 && box.locationx + x < this.layout[0].length) {
                            if (box.locationy + y > -1 && box.locationy + y < this.layout.length) {
                                if (!(x == 0 && y == 0)) {
                                    if (this.layout[box.locationy + y][box.locationx + x] != null) {
                                        this.boxSmash(null, this.layout[box.locationy + y][box.locationx + x]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //make some particles
            var part1;
            var part2;
            if (box.name == 'stone1' || box.name == 'stone') {
                part1 = 'particleS1';
                part2 = 'particleS2';
            } else if (box.name == 'key'){
                this.sounds.lock.play();
            } else if (box.name == 'lock') {
                this.sounds.bounce.play();
            } else if (box.name == 'tnt') {
                var explosion = this.particles.create(box.body.x - 65, box.body.y - 65, 'explosion');
                //explosion.anchor.setTo(0.5, 0.5);
                explosion.width = 200;
                explosion.height = 200;
                //explosion.angle = Math.floor(Math.random()*360);
                explosion.animations.add('explode');
                explosion.animations.play('explode', 30, false, true);
                this.sounds.explosion.play();
            } else {
                part1 = 'particleW1';
                part2 = 'particleW2';
                this.sounds.wood.play('short');
            }
            //make between 8 and 12
            var x = Math.floor((Math.random() * 12) + 8);
            for (var i = 0; i < x; i++) {
                var part = this.particles.create(Math.floor((Math.random() * 70) + box.body.x), Math.floor((Math.random() * 70 + box.body.y)), i % 2 == 1 ? part1 : part2);
                this.game.physics.arcade.enable(part);
                part.body.velocity.x = Math.floor((Math.random() * 100) - 50);
                part.body.velocity.y = Math.floor((Math.random() * 50) - 25);
                part.body.angularVelocity = Math.floor((Math.random() * 80) - 40);
                part.body.gravity.y = 150;
                part.checkWorldBounds = true;
                part.outOfBoundsKill = true;
            }

            //check if there are any boxes left
            if (this.boxes.children.length == 0) {
                    this.sounds.victory.play();
                    //if not on the last level
                    if (this.level < this.maxlevel) {
                        this.level++;
                        this.createLevel.call(this, this.level);
                    } else {
                        //check highscore
                        if (this.score > highscore){
                            highscore = this.score;
                            localStorage.setItem('highscore', highscore.toString());
                        }
                        //return to menu
                        this.game.state.start('menuState');
                    }
            }
        },

        updateHealth: function () {
            console.log(this.health);
            if (this.health === 3) {
                this.health1.loadTexture('hudHeartFull');
                this.health2.loadTexture('hudHeartFull');
                this.health3.loadTexture('hudHeartFull');
            } else if (this.health === 2) {
                this.health1.loadTexture('hudHeartFull');
                this.health2.loadTexture('hudHeartFull');
                this.health3.loadTexture('hudHeartEmpty');
            } else if (this.health === 1) {
                this.health1.loadTexture('hudHeartFull');
                this.health2.loadTexture('hudHeartEmpty');
                this.health3.loadTexture('hudHeartEmpty');
            } else if (this.health === 0) {
                this.health1.loadTexture('hudHeartEmpty');
                this.health2.loadTexture('hudHeartEmpty');
                this.health3.loadTexture('hudHeartEmpty');
                //check highscore
                if (this.score > highscore){
                    highscore = this.score;
                    localStorage.setItem('highscore', highscore.toString());
                }
                //lose
                game.state.start('menuState');
            } else if (this.health > 3) {
                this.health = 3;
                this.health1.loadTexture('hudHeartFull');
                this.health2.loadTexture('hudHeartFull');
                this.health3.loadTexture('hudHeartFull');
            }
        },

        updateScore: function () {
            var scoreStr = this.score.toString();
            if (scoreStr.length == 1) {
                scoreStr = '00' + scoreStr;
            } else if (scoreStr.length == 2) {
                scoreStr = '0' + scoreStr;
            }
            this.uiscore.setText(scoreStr)
        }
    };

    //defining the game state

    //module pattern
    var pub = {};
    pub.game = function () {
        if (typeof(Storage) !== "undefined"){
            var retrieved = parseInt(localStorage.getItem('highscore'));
            if (typeof(retrieved) === "undefined"){
                console.log('nothing stored');
                localStorage.setItem('highscore', '0');
                retrieved = 0;
            }
            highscore = retrieved;
            console.log(localStorage.getItem('highscore'));
        } else {
            console.log("No LocalStorage support");
            highscore = 0;
        }
        game = new Phaser.Game(700, 700, Phaser.AUTO, 'canvas', null, true);
        game.state.add('boot', BreakoutGame.bootState);
        game.state.add('preloader', BreakoutGame.preloader);
        game.state.add('menuState', BreakoutGame.menuState);
        game.state.add('game', BreakoutGame.gameState);
        game.state.start('boot');
    };
    return pub;

}());

$(document).ready(Breakout.game);