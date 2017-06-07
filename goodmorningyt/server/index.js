//Server Entry Point for GoodMorningYT
/*
  Project by Dan Dooley - 3/6/2016
  - Email: dan@dooley.ac.nz
  - Website: dooley.ac.nz
 */

 var express = require("express");
 var passport = require("passport");
 var mongoose = require("mongoose");

 var cookie_parser = require("cookie-parser");
 var body_parser = require("body-parser");
 var express_session = require("express-session");

 var google_strategy = require("passport-google-oauth").OAuth2Strategy;

 var web_server = express();

 /*
#####################################################
			        Initial Setup
#####################################################
 */

//set directory to the project root
 process.chdir('..');
 console.log("goodmorningyt running from " + process.cwd());


 /*
#####################################################
			        Mongoose Setup
#####################################################
 */

var db = mongoose.connection;

var User;
var Morning;
var Subscription;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	//Connected!
	console.log("Connected to MongoDB");

	var subSchema = mongoose.Schema({
		name: String,
		channelId: String
	});

	Subscription = mongoose.model('Subscription', subSchema);

	var morningSchema = mongoose.Schema({
		subs: [subSchema]
 	});

	Morning = mongoose.model('Morning', morningSchema)

 	var userSchema = mongoose.Schema({
 		name: String,
 		google: {
 			id: String,
 			token: String,
 			displayName: String,
 			email: String,
 			picture: String
 		},
 		morning: morningSchema
 	});

 	User = mongoose.model('User', userSchema);

});

 mongoose.connect('mongodb://localhost:27017/goodmorningyt');


/*
#####################################################
				   Passport Setup
#####################################################
*/

var auth = {
	googleAuth: {
		'clientID': '399939770634-rbrbqtu434j3ajfttj200si30pna5bup.apps.googleusercontent.com',
		'clientSecret': 'nWjywySgfS_nPvR_5ivLL7LF',
		'callbackURL': 'http://dooley.ac.nz/goodmorningyt/auth/callback'
	}
}

passport.use(new google_strategy(auth.googleAuth, function(token, refreshToken, profile, done){

	//Make code async
	process.nextTick(function(){
		User.findOne({"google.id": profile.id}, function(err, user){
			if (err){
				return done(err);
			}
			if (user){
				user.google.token = token;
				user.save(function(err){
					if (err){
						throw err;
					}
					return done(null, user);
				});
			} else {
				var newUser = new User();

				newUser.google.id = profile.id;
				newUser.google.token = token;
				newUser.google.displayName = profile.displayName;
				newUser.google.email = profile.emails[0].value;
				newUser.google.picture = profile.photos[0].value;

				newUser.name = profile.displayName;

				newUser.morning = {
						subs: []
					};
				newUser.save(function(err){
					if (err){
						throw err;
					}
					return done(null, newUser);
				})
			}
		})
	})

}));

passport.serializeUser(function(user, done){
	done(null, user._id);
})

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		return done(err, user);
	})
})



/*
#####################################################
			      Express Webserver
#####################################################
*/

//setup default paths
web_server.use('/goodmorningyt', express.static('www'));
web_server.use(cookie_parser());
web_server.use(body_parser.json());
web_server.use(express_session({secret: Math.random().toString(36).substr(2), resave: false, saveUninitialized: false}));
web_server.use(passport.initialize());
web_server.use(passport.session());


//Authentication paths
web_server.get('/goodmorningyt/logout', function(req, res){
	req.logout();
	res.redirect('/goodmorningyt');
});

web_server.get('/goodmorningyt/auth', passport.authenticate('google', {scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly']}));

web_server.get('/goodmorningyt/auth/callback', passport.authenticate('google', {
		successRedirect: '/goodmorningyt',
		failureRedirect: '/goodmorningyt'
	}));


function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	} else {
		res.send({err: "Not Logged In!"});
	}
}

//API Paths

web_server.get('/goodmorningyt/api/getUser', isLoggedIn, function(req, res){
	res.send(req.user);
});

web_server.post('/goodmorningyt/api/saveUser', isLoggedIn, function(req, res){
	var userSave = req.body;
	if (userSave._id = req.user._id){
		User.findOne({_id:userSave._id}, function(err, user){
			if (err) {
				res.status(500).send({err: "Error retrieving user", trace: err});
			}
			user.morning = userSave.morning;
			user.save(function(err){
				if (err){
					res.status(500).send({err: "Error saving user", trace: err});
				}
				res.send();
			});
		});
	} else {
		res.status(500).send({err: "Logged in user does not match user being saved!", trace: err});
	}
})

web_server.listen(3500, function(){
	console.log('Web Server listening on port 3500.');
})
