var fs = require('fs');
var js = require('jsonfile');
var ex = require('express');
var bp = require('body-parser');
var pgp = require ('openpgp');

var app = ex();

app.use(bp.json());

/*
	Edit Password
*/
var pass = 'david_doolan';


var pgpOpt = {
	numBits: 2048,
	userId: 'Dan Dooley <dan@dooley.ac.nz>',
	passphrase: Date.now()
};
var privkey;
var pubkey;

pgp.generateKeyPair(pgpOpt).then(function(keypair){
	privkey = keypair.privateKeyArmored;
	pubkey = keypair.publicKeyArmored;

	app.listen(3443);

	console.log(pubkey);
	console.log("Running on port: 3443");
}).catch(function(error){
	console.log(error);
	process.exit(1);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/edit/getkey', function(req, res){
  	var response = {};
	response.key = pubkey;
	res.send(response);
});

app.post('/edit/save', function(req, res){
	var private = pgp.key.readArmored(privkey).keys[0];
	private.decrypt(pgpOpt.passphrase);

	var message = pgp.message.readArmored(req.body.password);

	pgp.decryptMessage(private, message).then(function(password){
		if (password === pass){
			var both = false;
			js.writeFile('/dooleynz/www/json/cv.json', req.body.cv, function(err){
				if (err){
					console.error(err);
					res.status(500).send("Error saving CV");
				}
				if (!both){
					both = true;
				} else {
					res.send('success');
				}
			});
			js.writeFile('/dooleynz/www/json/portfolio.json', req.body.portfolio, function(err){
				if (err){
					console.error(err);
					res.status(500).send("Error saving Portfolio");
				}
				if (!both){
						both = true;
				} else {
						res.send('success');
				}
			});
		} else {
			res.status(500).send("Incorrect Password");
		}
	}).catch(function(error){
		console.log(error);
		res.status(500).send(error);
	});
});




