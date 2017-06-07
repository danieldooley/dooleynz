var nm = require('nodemailer');
var ex = require('express');
var bp = require('body-parser');

var transporter = nm.createTransport();
var app = ex();

app.use(bp.json());
app.use(bp.urlencoded({extended:true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/contact', function(req, res){
    var subject = req.body.subject;
    var message = req.body.message;
    var sender = req.body.sender;
    
    console.log(sender + ': ' + subject + ' - ' + message);
    
    transporter.sendMail({
	from: sender,
	to: 'dan@dooley.ac.nz',
	subject: '[Contact Form] - ' + subject,
	text: message
    });
    
    res.send('{"success" : "Updated Successfully", "status" : 200}');
});

var port = 3002;
app.listen(port);
console.log('Listening on port: ' + port);
