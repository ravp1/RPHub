
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
/*
var categorySchema = new Schema({
	name: String,
	
	interests: [{name: String, posts:[{poster:String, content:String, title: String, timePosted:Date}]}],
	meta: {
		following: Number,
	}
	
});

var Category = mongoose.model('Category', categorySchema);

Category.remove({},function(err){
	console.log("removed categories");
});

var engineering = new Category({ name: 'engineering'});
engineering.interests.push({name:'electrical engineering'});
engineering.interests[0].posts.push({poster:'Dr. ABC', content:'For students looking for experience with digital design', title:'VLSI Project'});
engineering.save();

var performance = new Category({name:'performance'});
performance.interests.push({name:'pop music'});
performance.interests[0].posts.push({poster:'Dr. ABC', content:"Performance during my daughter's graduation party. Formal attire requested.", title:'Performance June 21'});
performance.save();
*/
var userSchema = new Schema({
	name: 
	{
		first: String,
		last: String,
	},
	email: String,
	password: String,
	loginTries: Number,
	interests: [interestSchema],
	blocked: Boolean,
	loginFail: Boolean,
});
var interestSchema = new Schema({
	name: String
});

var categorySchema = new Schema({
	name: String,
	
	interests: [interestSchema],
	meta: {
		following: Number,
	}
	
});

var postSchema = new Schema({
	poster: String,
	content: String,
	title: String,
	timePosted: Date,
	tags: [String], //interest 
	fullfilled: Boolean,
	comments: [{name: String, posts:[{poster:String, content:String, timePosted:Date}]}],
});

var Post = mongoose.model('Post', postSchema);

interestSchema.methods.returnPosts = function(){
Post.find({tags:this.name}, function(err, relevantPosts){
	if(err) return console.error(err);
	console.log(relevantPosts);
});
}

userSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

var User = mongoose.model('User', userSchema);

var Category = mongoose.model('Category', categorySchema);

var Interest = mongoose.model('Interest', interestSchema);
/*
User.remove({}, function(err){
	console.log("removed users");
});
*/
Category.remove({},function(err){
	console.log("removed categories");
});

Post.remove({}, function(err){
	console.log("removed posts");
});
/*
var sampleUser = new User({email: 'sample@rpi.edu', password: 'password', blocked: false, loginFail: false});
sampleUser.save();
*/
var engineering = new Category({ name: 'Engineering'});
var eeInterest = new Interest({name:'Electrical Engineering'});
eeInterest.save();
engineering.interests.push(eeInterest);
engineering.save();

var science = new Category({name:'Science'});
var physicsInterest = new Interest({name:'Physics'});
physicsInterest.save();
science.interests.push(physicsInterest);
science.save();

var posts = [];
var post1 = new Post({poster:'Dr. ABC', content:'For students looking for experience with digital design. For credit or salary.', title:'VLSI Project', tags:['Electrical Engineering'], fullfilled:false});
post1.save();
posts.push(post1);
var post2 = new Post({poster:'Dr. DEF', content:"Computational physics research in density functional theory. Must be junior or above with programming experience.", title:'DFT Research', fulfilled:false});
post2.save();
posts.push(post2);
var post3 = new Post({poster:'Dr. GHI', content:"More physics stuff find out more later.", title:'Physics', fulfilled:true});
post3.save();
posts.push(post3);
console.log("engineering: " + JSON.stringify(engineering));
//console.log("first interest posts: " + Interest.findOne().exec().returnPosts());

Interest.findOne({},function(err,result){
	console.log("err is " + err);
	//console.log("first interest posts: " + JSON.stringify(result.returnPosts() ) );
	result.returnPosts()
});

//engineering.interests[0].returnPosts();
//console.log(posts);
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
	  res.redirect('makeTags.js');
	  res.redirect('post.html');
});

/*var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
	
	
});*/
console.log('Server running at http://127.0.0.1:8080/');



app.get("/categories",function(req,res){

	Category.find({},function(err,data){
	
	
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

app.get("/posts", function(req, res){
	Post.find({}, function(err,data){
		res.write(JSON.stringify(data));
		res.end();
	});
});

app.post("/sendMessage",function(req,res){

	subject = req.body.subject;
	message = req.body.message;
	console.log(subject);
	console.log(message);
	if (subject == null || message == null)
	{
		res.redirect("request.html");
		return;
	}
	var post = new Post({content:message, title:subject, fulfilled:false});
	post.save();
	posts.push(post);
	
	res.redirect("request.html");
	//res.end();

});

app.post("/login",function(req,res){

	sentEmail = req.body.email;
	sentPassword = req.body.password;
	console.log(sentEmail);
	console.log(sentPassword);
	
	if (sentEmail == undefined || sentPassword == undefined)
	{
		res.redirect("login.html");
		return;
	}
	User.findOne({email:sentEmail, password:sentPassword}, function(err, loggedUser){
		if(err) return console.error(err);
		console.log(loggedUser);
		if(loggedUser!=null){
			res.redirect("index.html");
		}
		else{
			console.log("Failed login; please try again.");
			res.redirect("login.html");
		}
	});
	/*
	var post = new Post({content:password, title:email, fulfilled:false});
	post.save();
	posts.push(post);
	
	res.redirect("index.html");*/
	//res.end();

});

app.post("/register", function(req, res){
	sentEmail = req.body.email;
	sentPassword = req.body.password;
	sentFirst = req.body.firstName;
	sentLast = req.body.lastName;
	console.log(sentEmail);
	console.log(sentFirst);
	
	User.findOne({email:sentEmail}, function(err, loggedUser){
		if(err) return console.error(err);
		if(loggedUser!=null){
			console.log("There is already an account associated with this email. Please login or click 'Forgot password'");
			res.redirect("register.html");
		}
		else if (sentEmail == "" || sentPassword == "" || sentFirst == "" || sentLast == "")
		{
			console.log("You have left some fields blank. Please try again.");
		}
		else{
			var newUser = new User({email: sentEmail, password: sentPassword, name:{first:sentFirst, last:sentLast}, blocked: false, loginFail: false, loginTries:0});
			newUser.save();
			console.log("Congratulations! You have created a new user!");
			res.redirect('index.html');
		}
	});

});

//db.collection("posts").find({tags:this.name});

/*

interestSchema.methods.returnPosts = function(){
	return Post.find().where(this).in().exec(function(err, relevantPosts){
		if(err) return console.error(err);
		else return relevantPosts;
	}
}

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
	}
});*/

