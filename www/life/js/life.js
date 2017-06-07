/**
 * Created by daniel on 21/10/15.
 */

var Life = (function(){

    function Queue(){

        /*
            An object used for the history
            maxsize defined below
         */
        this.maxSize = 20;

        this.items = [];

        this.push = function(item){
            if (this.items.length > this.maxSize){
                this.items.splice(0, 1);
            }
            this.items.push(item);
        };

        this.pop = function(){
            if (this.items.length > 0) {
                var item = this.items[this.items.length - 1];
                this.items.splice(-1, 1);
                return item;
            } else {
                return undefined
            }
        };

    }

    var pub = {};

    var xsize = 40;
    var ysize = 30;

    /*
        Two dimensional array representing current state
        A 1 = alive, 0 = dead
     */
    var currState = [];

    var playing = 0;

    var history;

    /*
        Prints the current state to the console,
        useful for debugging.
     */
    function printState(){
        for (var y = 0; y < ysize; y++){
            var row  = "[";
            for (var x= 0; x < xsize; x++){
                row += currState[y][x];
                if (x != currState[y].length - 1){
                    row += ", ";
                }
            }
            row += "]";

        }
    }

    function mod(i, shift, size){
        var z = i + shift;
        return ((z % size) + size) % size;
    }

    function next(){
        var nextState = [];
        history.push(currState);
        for (var y = 0; y < ysize; y++){
            var row  = [];
            for (var x= 0; x < xsize; x++){
                var count = 0;
                for (var xshift = -1; xshift < 2; xshift++){
                    for (var yshift = -1; yshift < 2; yshift++){
                        if (xshift != 0 || yshift != 0){
                            count += currState[mod(y, yshift, ysize)][mod(x, xshift, xsize)];
                        }
                    }
                }
                if (currState[y][x] == 0){
                    if (count == 3){
                        row.push(1);
                    } else {
                        row.push(0);
                    }
                } else {
                    if (count > 3 || count < 2){
                        row.push(0);
                    } else {
                        row.push(1);
                    }
                }
            }
            nextState.push(row);
        }
        currState = nextState;
        updateState();
    }

    function updateState(){
        $('tr').each(function(){
            $(this).children().each(function(){
                if (currState[$(this).data('y')][$(this).data('x')] == 0){
                    $(this).css('background-color', 'transparent');
                } else {
                    $(this).css('background-color', 'black');
                }
            });
        });
    }

    function prev(){
        var state = history.pop();
        if (state !== undefined){
            currState = state;
        }
        updateState();
    }


    pub.setup = function(){
        //Set up the array + table
        var html = "";
        for (var y = 0; y < ysize; y++){
            var row  = [];
            html += "<tr>";
            for (var x= 0; x < xsize; x++){
                row.push(0);
                html += "<td data-x='" + x +"' data-y='" + y + "'></td>";
            }
            html += "</td>";
            currState.push(row);
        }
        $("#table").html(html);
        printState();

        //Set up the history
        history = new Queue();

        $('tr').each(function(){
            $(this).children().each(function(){
                $(this).click(function(){
                    if (playing == 0) {
                        if (currState[$(this).data('y')][$(this).data('x')] == 0) {
                            currState[$(this).data('y')][$(this).data('x')] = 1;
                            $(this).css('background-color', 'black');
                        } else {
                            currState[$(this).data('y')][$(this).data('x')] = 0;
                            $(this).css('background-color', 'transparent');
                        }
                    }
                })
            });
        });

        $('#play').click(function(){
           if ($(this).html() == "Play"){
               $(this).html("Pause");
               playing = 1;
           } else {
               $(this).html("Play");
               playing = 0;
           }
        });

        $('#next').click(next);

        $('#prev').click(prev);

        setInterval(function(){
            if (playing == 1){
                next();
            }
        }, 200);
    };

    return pub;

}());

$(document).ready(Life.setup);