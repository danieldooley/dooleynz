ex = require('express');
var bp = require('body-parser');
var util = require('util');
var spawnSync = require('child_process').spawnSync;

var app = ex();

app.use(bp.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/terrain', function(req, res){
    var x = req.body.x;
    var y = req.body.y;
    var type = req.body.type;
    var pixel = req.body.pixel;
    var seed = req.body.seed;

    var java;
    if (!seed){
	java = spawnSync('java', ['-jar', 'TerrainGen.jar', x, y, pixel, type]);
    } else {
	java = spawnSync('java', ['-jar', 'TerrainGen.jar', x, y, pixel, type, seed]);
    }

    res.send(java.stdout);
});

var port = 3101;
app.listen(port);
console.log('listening on port ' + port);
