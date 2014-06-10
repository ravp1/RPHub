var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  mongoose = require('mongoose'),
  mailer=require("nodemailer"),
  crypto=require("crypto"),
	admin=require("./custom_modules/admin"),
	profile=require("./custom_modules/profile"),
	search=require("./custom_modules/search"),
	messaging=require("./custom_modules/messaging");

/* Setup the server to listen on port 80 (Web traffic port), allow it to parse POSTED body data, and let it render EJS pages */
server.listen(80);
app.use(express.bodyParser());
app.set('view engine', 'ejs');


/*http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080, '127.0.0.1');*/
app.get('/', function(req, res){
	  res.send('Hello World');
	});

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
	
	
});
console.log('Server running at http://127.0.0.1:8080/');