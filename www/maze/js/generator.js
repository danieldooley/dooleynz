/**
 * Created by daniel on 3/09/15.
 */

/*
    Mazes are generated and returned as a 2d matrix
    of cell matrices. Each cell has 4 values:
                [1, 1, 1, 1]
    These four values represent the four walls:
                [N, E, S, W]
    A 0 is blocked, a 1 is open.
*/

/* From @Christoph on StackOverflow:
http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
 */
function randShuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}

function noShuffle(array) {
    return array;
}

function revShuffle(array) {
    var narray = [];
    for (var i = array.length - 1; i >= 0; i--){
        narray.push(array[i]);
    }
    return array;
}

function horizBiasShuffle(array){
    //add an extra of each horizontal direction
    array.push(1);
    array.push(3);
    //shuffle randomly
    array = randShuffle(array);
    //from the end remove
    var narray = [];
    for (var i = 0; i < array.length; i++){
        if (narray.indexOf(array[i]) === -1){
            narray.push(array[i]);
        }
    }
    return narray;
}

function extraHorizBiasShuffle(array){
    //add an extra of each horizontal direction
    array.push(1);
    array.push(3);
    array.push(1);
    array.push(3);
    array.push(1);
    array.push(3);
    array.push(1);
    array.push(3);
    //shuffle randomly
    array = randShuffle(array);
    //from the end remove
    var narray = [];
    for (var i = 0; i < array.length; i++){
        if (narray.indexOf(array[i]) === -1){
            narray.push(array[i]);
        }
    }
    return narray;
}

function horizBiasShuffle(array){
    //add an extra of each horizontal direction
    array.push(1);
    array.push(3);
    //shuffle randomly
    array = randShuffle(array);
    //from the end remove
    var narray = [];
    for (var i = 0; i < array.length; i++){
        if (narray.indexOf(array[i]) === -1){
            narray.push(array[i]);
        }
    }
    return narray;
}

function vertBiasShuffle(array){
    //add an extra of each horizontal direction
    array.push(0);
    array.push(2);
    //shuffle randomly
    array = randShuffle(array);
    //from the end remove
    var narray = [];
    for (var i = 0; i < array.length; i++){
        if (narray.indexOf(array[i]) === -1){
            narray.push(array[i]);
        }
    }
    return narray;
}

function extraVertBiasShuffle(array){
    //add an extra of each horizontal direction
    array.push(0);
    array.push(2);
    array.push(0);
    array.push(2);
    array.push(0);
    array.push(2);
    array.push(0);
    array.push(2);
    //shuffle randomly
    array = randShuffle(array);
    //from the end remove
    var narray = [];
    for (var i = 0; i < array.length; i++){
        if (narray.indexOf(array[i]) === -1){
            narray.push(array[i]);
        }
    }
    return narray;
}


var MazeGenerator = (function(){

    var pub = {};

    //this function just checks if a cell is unvisited (i.e) all 0s
    function cellEmpty(cell){
        var sum = 0;
        for (var i = 0; i < cell.length; i++){
            sum += cell[i];
        }
        return sum === 0;
    }

    //Basic idea from: http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
    pub.getMazeRB = function(x, y, sX, sY, shuffleFunction){
        //default value of shuffleFunction
        if(typeof(shuffleFunction) === 'undefined'){
            shuffleFunction = randShuffle;
        }
        // Some constant values to make life easier
        //        [N,  E,  S,  W]
        //        [0,  1,  2,  3]   -   Number representations
        var DX = [ 0,  1,  0, -1];//-   Change in X when moving that way
        var DY = [ -1,  0, 1,  0];//-   Change in Y when moving that way
        var OPP= [ 2,  3,  0,  1];//-   Index that represents opposite direction

        //generate an empty matrix
        var grid = [];
        for(var i = 0; i < y; i++){
            var ri = []; //This will be a row
            for(var j = 0; j < x; j++){
                var cj = [0,0,0,0]; //This is an unvisited cell
                ri.push(cj);
            }
            grid.push(ri);
        }

        //recursive function
        //cx: X of current cell, cy: Y of current cell, grid
        var recursiveMaze = function(cx, cy, grid){
            //define and shuffle directions
            var directions = [0, 1, 2, 3];
            //shuffling can be changed to allow different shaped mazes
            directions = shuffleFunction(directions);

            for (var i = 0; i < directions.length; i++){
                var nx = cx + DX[directions[i]]; //select the coords of the next square
                var ny = cy + DY[directions[i]];
                //if cell exists in grid and is unvisited

                if(nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length){
                    if (cellEmpty(grid[ny][nx])) {
                        grid[cy][cx][directions[i]] = 1;
                        grid[ny][nx][OPP[directions[i]]] = 1;
                        //console.log('Going from: (' + cx + ', ' + cy + ') to (' + nx + ', ' + ny +") direction: " + directions[i]);
                        recursiveMaze(nx, ny, grid);
                    }
                }
            }
        };
        recursiveMaze(sX, sY, grid);
        //console.log(grid);

        return grid;

    };

    return pub;

}());