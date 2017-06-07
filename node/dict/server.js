var express = require('express');
var fs = require('fs');

console.log("\n#### Dictionary Server Started ####\n");

var app = express();

console.log("\t- Parsing JSON Content\n");
var content = JSON.parse(fs.readFileSync("1st2000.json"));
console.log("\t- Parsing Complete\n");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/dict', function(req, res){
    res.send(JSON.stringify(content));
});

app.get('/dict/random', function(req, res){
    var result = {};

    var i = Math.floor(Math.random() * content.length);
    var j = Math.floor(Math.random() * content[i].definitions.length);

    result.word = content[i].word;
    result.def = content[i].definitions[j].definition;
    result.pos = content[i].definitions[j].partOfSpeech;

    res.send(JSON.stringify(result));
});

app.get('/dict/define/:word', function(req, res){
    var result = {};
    
    for (var i = 0; i < content.length; i++){
	if (content[i].word === req.params.word){
	    result.word = req.params.word;
	    result.def = content[0].definitions[0].definition;
	    result.pos = content[0].definitions[0].partOfSpeech;
	    break;
	}
    }

    if (result.word !== undefined){
	    res.send(JSON.stringify(result));
    }else{
	    res.send(undefined);
    }
});

var port = 3001;
app.listen(port);
console.log('listening on port '+port);
