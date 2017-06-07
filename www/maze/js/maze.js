/**
 * Created by daniel on 3/09/15.
 */

var Maze = (function(){

    var game;

    var mazeWidth;
    var mazeHeight;

    var maze;

    var scale;

    var offsetX;
    var offsetY;

    var startX;
    var startY;

    var shuffleFunction;

    //groups
    var cells;

    function preload(){
        game.load.image('E', 'assets/E.png');
        game.load.image('ES', 'assets/ES.png');
        game.load.image('ESW', 'assets/ESW.png');
        game.load.image('EW', 'assets/EW.png');
        game.load.image('N', 'assets/N.png');
        game.load.image('NE', 'assets/NE.png');
        game.load.image('NES', 'assets/NES.png');
        game.load.image('NESW', 'assets/NESW.png');
        game.load.image('NEW', 'assets/NEW.png');
        game.load.image('NS', 'assets/NS.png');
        game.load.image('NSW', 'assets/NSW.png');
        game.load.image('NW', 'assets/NW.png');
        game.load.image('S', 'assets/S.png');
        game.load.image('SW', 'assets/SW.png');
        game.load.image('W', 'assets/W.png');
    }

    function create(){
        //get values from inputs
        mazeWidth = $('#xsize').val();
        mazeHeight = $('#ysize').val();
        startX = parseInt($('#xstart').val()) - 1;
        startY = parseInt($('#ystart').val()) - 1;
        //Work out some scaling in here
        //100 is the size of each image
        var scaleWidth = game.width / mazeWidth; //The size each square needs to be to fit width wise.
        var scaleHeight = game.height / mazeHeight; //The size each square needs to be to fit height wise.



        console.log($('#shuffle').val());

        switch ($('#shuffle').val()){
            case 'randShuffle':
                shuffleFunction = randShuffle;
                break;
            case 'horizBiasShuffle':
                shuffleFunction = horizBiasShuffle;
                break;
            case 'extraHorizBiasShuffle':
                shuffleFunction = extraHorizBiasShuffle;
                break;
            case 'vertBiasShuffle':
                shuffleFunction = vertBiasShuffle;
                break;
            case 'extraVertBiasShuffle':
                shuffleFunction = extraVertBiasShuffle;
                break;
            case 'noShuffle':
                shuffleFunction = noShuffle;
                break;
            case 'revShuffle':
                shuffleFunction = revShuffle;
                break;
            default:
                shuffleFunction = randShuffle;
                break;
        }

        scale = Math.floor(scaleWidth < scaleHeight ? scaleWidth : scaleHeight); //pick the smaller of the two.
        //console.log('Square Size: ' + scale); //This will be the size of each square

        //work out the offset to centre maze
        offsetX = Math.floor((game.width - (mazeWidth * scale)) / 2);
        offsetY = Math.floor((game.height - (mazeHeight * scale)) / 2);

        //console.log('OffsetX: ' + offsetX + " OffsetY: " + offsetY);


        //Get the maze
        maze = MazeGenerator.getMazeRB(mazeWidth, mazeHeight , startX, startY, shuffleFunction);

        //Build the maze as sprites into the game.

        cells = game.add.group();
        for (var x = 0; x < mazeWidth; x++){
            for (var y = 0; y < mazeHeight; y++){
                //generate the name from the cell
                var gfx = '';
                if (maze[y][x][0] == 1){
                    gfx += 'N';
                }
                if (maze[y][x][1] == 1){
                    gfx += 'E';
                }
                if (maze[y][x][2] == 1){
                    gfx += 'S';
                }
                if (maze[y][x][3] == 1){
                    gfx += 'W';
                }
                var cell = cells.create(x * scale + offsetX, y * scale + offsetY, gfx);
                cell.width = scale;
                cell.height = scale;
            }
        }


        //let's test some image loading


    }

    function update(){

    }

    //module pattern
    var pub = {};
    pub.game = function(){
        $('#gen').click(function(){
            game.state.start(game.state.current);
        });
        $('#xsize').change(function(){
           if ($('#xsize').val() < 1){
               $('#xsize').val(1);
           } else if ($('#xsize').val() > 100){
               $('#xsize').val(100);
           }
            $('#xstart').change();
        });
        $('#ysize').change(function(){
            if ($('#ysize').val() < 1){
                $('#ysize').val(1);
            } else if ($('#ysize').val() > 100){
                $('#ysize').val(100);
            }
            $('#ystart').change();
        });
        $('#xstart').change(function(){
            if ($('#xstart').val() < 1){
                $('#xstart').val(1);
            } else if (parseInt($('#xstart').val()) > parseInt($('#xsize').val())){
                $('#xstart').val($('#xsize').val());
            }
        });
        $('#ystart').change(function(){
            if ($('#ystart').val() < 1){
                $('#ystart').val(1);
            } else if (parseInt($('#ystart').val()) > parseInt($('#ysize').val())){
                $('#ystart').val($('#ysize').val());
            }
        });
        $('#algorithm').change(function(){
            $('.option').each(function(){
                if ($(this).hasClass($('#algorithm').val())){
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                }
            });
        });
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', {preload: preload, create: create, update: update});
    };
    return pub;
}());

$(document).ready(Maze.game);