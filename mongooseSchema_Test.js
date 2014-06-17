
var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  mailer=require("nodemailer"),
  crypto=require("crypto"),
  bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){

});


var Schema = mongoose.Schema;

//a category may be, for example, engineering or performance
//a sub-interest may be electrical engineering or guitar
var categorySchema = new Schema({
	name: String,
	
	interests: [{name: String, posts:[{poster:String, content:String, title: String, timePosted:Date}]}],
	meta: {
		following: Number,
	}
	
});

var Category = mongoose.model('Category', categorySchema);

Category.remove({},function(err){
	console.log("removed categores");
});

var engineering = new Category({ name: 'engineering'});
engineering.interests.push({name:'electrical engineering'});
engineering.interests[0].posts.push({poster:'Dr. ABC', content:'For students looking for experience with digital design', title:'VLSI Project'});
engineering.save();
//console.log(engineering);

var performance = new Category({name:'performance'});
performance.interests.push({name:'pop music'});
performance.interests[0].posts.push({poster:'Dr. ABC', content:"Performance during my daughter's graduation party. Formal attire requested.", title:'Performance June 21'});
performance.save();
//console.log(performance);


//Setup the server to listen on port 80 (Web traffic port), allow it to parse POSTED body data, and let it render EJS pages 
server.listen(80);
app.use(bodyParser());
//app.set('view engine', 'ejs');

app.use(express.static(__dirname));

//http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World\n');
//}).listen(8080, '127.0.0.1');
app.get('/', function(req, res){
	  res.redirect('index.html');
	  res.redirect('request.html');
});

/*var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
	
	
});*/
console.log('Server running at http://127.0.0.1:8080/');



app.get("/categories",function(req,res){

	Category.find({},function(err,data){
	
		console.log("found categories. data.length is " + data.length);
	
		/*var response = {names:[]};
		for (var i = 0; i < data.length; i++)
		{
			response.names.push(data[i].name);
		}
		console.log(response);
		res.write(JSON.stringify(response) );*/
		res.write(JSON.stringify(data) );
		res.end();
	});

});


/*

function makeNewCategory(name, interests)
{
	var newCat = new Category({name:name, interests:interests});
}

categorySchema.methods.findCommonPosters = function(cb) {
	return this.model('Category').find({interests: [{posts:[{poster: this.interests.posts.poster}] }] }, cb);
}*/
/* example function call:
	engineering.findCommonPosters(function(err, categories){
		console.log(categories);
	});
*/
/*
Category.find({name:"engineering"}, function(err, categories){
	if(err) return console.error(err);
	else
	{
		for (var i =0; i<categories.length; i++)
		{
			resp.write(categories[i].name);
		}
	}*/