/**
 * Created by daniel on 5/11/15.
 */


var json;

var chars;

var playing = false;

var currentChar;

var streak = 0;

// from: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function removeSelections(){
    $('#wordrow').children().removeClass('selection');
}

function removeUsed(){
    $('#letters1').children().removeClass('used').data('used', '');
    $('#letters2').children().removeClass('used').data('used', '');
}

function clearLetters(){
    $('#wordrow').html('');
    var wordArray = json.word.split('');
    for (var i = 0; i < wordArray.length; i++) {
        $('#wordrow').html($('#word').html() + '<td data-char="' + wordArray[i] + '">_</td>');
    }
}

function keypress(event){
    //insert char
    var char = String.fromCharCode(event.which).toLowerCase();
    console.log(char);

    if (chars.indexOf(char) !== -1) {
        //check used chars
        var found = false;
        for (var i = 0; i < chars.length; i++){
            if (i < 9){
                if ($('#letters1 :nth-child(' + (i + 1) + ')').html() === char
                    && $('#letters1 :nth-child(' + (i + 1) + ')').data('used') !== 'used'){
                    found = true;
                    break;
                }
            } else {
                var q = i - 9;
                if ($('#letters2 :nth-child(' + (q + 1) + ')').html() === char
                    && $('#letters2 :nth-child(' + (q + 1) + ')').data('used') !== 'used'){
                    found = true;
                    break;
                }
            }
        }

        if (found) {
            $('#wordrow :nth-child(' + (currentChar + 1) + ')').html(char);
            currentChar++;
            removeSelections();
            $('#wordrow :nth-child(' + (currentChar + 1) + ')').addClass('selection');

            for (var j = 0; j < chars.length; j++){
                if (i < 9){
                    if ($('#letters1 :nth-child(' + (j + 1) + ')').html() === char
                        && $('#letters1 :nth-child(' + (j + 1) + ')').data('used') !== 'used'){
                        $('#letters1 :nth-child(' + (j + 1) + ')').data('used', 'used');
                        $('#letters1 :nth-child(' + (j + 1) + ')').addClass('used');
                        break;
                    }
                } else {
                    var q = i - 9;
                    if ($('#letters2 :nth-child(' + (q + 1) + ')').html() === char
                        && $('#letters2 :nth-child(' + (q + 1) + ')').data('used') !== 'used'){
                        $('#letters2 :nth-child(' + (q + 1) + ')').data('used', 'used');
                        $('#letters2 :nth-child(' + (q + 1) + ')').addClass('used');
                        break;
                    }
                }
            }
        }

        //do game stuff
        if (currentChar === json.word.length){

            var word = "";
            for (var x = 0; x < json.word.length; x++){
                word += $('#wordrow :nth-child(' + (x + 1) + ')').html();
            }
            console.log(word);

            if (word === json.word){
                $('#wordrow').children().addClass('win');
                streak++;
                $('#streak').html(streak);
                setTimeout(play, 1500);
            } else {
                $('#wordrow').children().addClass('lose');
                setTimeout(function() {
                    clearLetters();
                    removeSelections();
                    removeUsed();
                    currentChar = 0;
                    $('#wordrow :nth-child(' + (currentChar + 1) + ')').addClass('selection');

                }, 1000);
            }
        }
    }
}

function letterClick(event){
    var e = $.Event("keypress");
    e.which = $(this).html().toLowerCase().charCodeAt(0);
    $(document).trigger(e);
}

function play(){
    if (!playing) {
        $(document).off('keypress');
        $.ajax('http://dooley.ac.nz/dict/random').done(function (data) {
            $('#play').css('display', 'none');
            $('#clear').removeClass('hide');
            $('#reset').removeClass('hide');
            $('#wordrow').children().removeClass('win');
            //setup stuff
            json = data; //JSON.parse(data);
            json.def = json.definitions[0];
            console.log(json.word + ' - ' + json.def.definition);


            chars = [];
            usedChars = [];
            var possible = "abcdefghijklmnopqrstuvwxyz";

            $('#wordrow').html('');
            var wordArray = json.word.split('');
            for (var i = 0; i < wordArray.length; i++) {
                $('#wordrow').html($('#word').html() + '<td data-char="' + wordArray[i] + '">_</td>');
                chars.push(wordArray[i]);
            }

            for (var i = 0; i < 19 - json.word.length; i++){
                chars.push(possible.charAt(Math.floor(Math.random() * possible.length)));
            }
            shuffle(chars);
            console.log(chars);

            $('#letters1').html('');
            $('#letters2').html('');
            for (var i = 0; i < chars.length; i++){
                if (i < 9){
                    $('#letters1').html($('#letters1').html() + '<td class="click">' + chars[i] + '</td>');
                } else {
                    $('#letters2').html($('#letters2').html() + '<td class="click">' + chars[i] + '</td>');
                }
            }
            $('#letters1').children().click(letterClick);
            $('#letters2').children().click(letterClick);

            $('#pos').html('- ' + json.def.partOfSpeech);
            $('#def').html(json.def.definition);
            currentChar = 0;

            //playing stuff
            $('#wordrow :nth-child(1)').addClass('selection');
            $(document).keypress(keypress);
        });
    }
}


function setup(){
    $('#play').click(play);
    $('#clear').click(function(){
            clearLetters();
            removeSelections();
            removeUsed();
            currentChar = 0;
            $('#wordrow :nth-child(' + (currentChar + 1) + ')').addClass('selection');
    });
    $('#reset').click(function(){
        streak = 0;
        $('#streak').html(streak);
        play();
    });
}


$(document).ready(setup);