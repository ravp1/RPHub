
var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  mailer=require("nodemailer"),
  crypto=require("crypto"),
  bodyParser = require("body-parser");
var mongoose = require('mongoose');
var session = require('express-session');

var ejs = require("ejs");

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGOLAB_URI 
                || process.env.MONGOHQ_URL 
				|| 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){

});

app.use(session({secret: 'monkey wizard'}));

//{  SCHEMA STUFF
var Schema = mongoose.Schema;

//a category may be, for example, engineering or performance
//a sub-interest may be electrical engineering or guitar

var userSchema = new Schema({
	name: 
	{
		first: String,
		last: String,
	},
	email: String,
	password: String,
	loginTries: Number,
	interests: [String],
	blocked: Boolean,
	loginFail: Boolean,
	posts: [postSchema],
	
});
var interestSchema = new Schema({
	name: String,
	nickname: String,
	noSpace: String,
	relatedInterests: [String],
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
	timeString: String,
	timePosted: Date,
	replyAddress: String,
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
//}

/*//REMOVE CATEGORIES, POSTS, INTERESTS, USERS (NO LONGER PART OF PROCESS)

Category.remove({},function(err){
	console.log("removed categories");
});

Interest.remove({}, function(err){
	console.log("removed interests");
});

User.remove({}, function(err){
	console.log("removed users");
});

Post.remove({}, function(err){
	console.log("removed posts");
});
*/

/*//CREATE SAMPLE USER (ALREADY DONE)
var sampleUser = new User({email: 'sample@rpi.edu', password: 'password', blocked: false, loginFail: false, name:{first:"Sample", last:"User"}});
sampleUser.save();

*/

// CREATE DEFAULT CATEGORIES, INETERESTS, POSTS (ALREADY CREATED; NO NEED TO RUN EVERY TIME)
//{ SETUP ENGINEERING CATEGORY
var engineering = new Category({ name: 'Engineering'});

engineering.interests[engineering.interests.length] = new Interest({name:'Aeronautical Engineering', nickname:"aero"});
engineering.interests[engineering.interests.length] = new Interest({name:'Biomedical Engineering', nickname:"bmed"});
engineering.interests[engineering.interests.length] = new Interest({name:'Chemical Engineering', nickname:"chme"});
engineering.interests[engineering.interests.length] = new Interest({name:'Civil Engineering', nickname:"civl"});
engineering.interests[engineering.interests.length] = new Interest({name:'Computer & Systems Engineering', nickname:"cse"});
engineering.interests[engineering.interests.length] = new Interest({name:'Electrical Engineering', nickname:"ee"});
engineering.interests[engineering.interests.length] = new Interest({name:'Environmental Engineering', nickname:"enve"});
engineering.interests[engineering.interests.length] = new Interest({name:'Industrial & Management Engineering', nickname:"isye"});
engineering.interests[engineering.interests.length] = new Interest({name:'Materials Engineering', nickname:"mtle"});
engineering.interests[engineering.interests.length] = new Interest({name:'Mechanical Engineering', nickname:"mech"});
engineering.interests[engineering.interests.length] = new Interest({name:'Nuclear Engineering', nickname:"nuke"});
for (var i =0; i< engineering.interests.length; i++){
	engineering.interests[i].noSpace = engineering.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	engineering.interests[i].nickname = engineering.interests[i].nickname.toUpperCase();
	engineering.interests[i].save();
}
console.log(engineering.interests[3]);
engineering.save();
//}

//{ SETUP SCIENCE CATEGORY
var science = new Category({name:'Science'});
science.interests[science.interests.length] = new Interest({name:'Biology', nickname:"biol"});
science.interests[science.interests.length] = new Interest({name:'Biochemistry & Biophysics', nickname:"bcbp",});
science.interests[science.interests.length] = new Interest({name:'Bioinformatics & Molecular Biology', nickname:"bimb"});
science.interests[science.interests.length] = new Interest({name:'Chemistry', nickname:"chem"});
science.interests[science.interests.length] = new Interest({name:'Computer Science', nickname:"csci"});
science.interests[science.interests.length] = new Interest({name:'Environmental Science', nickname:"envs",});
science.interests[science.interests.length] = new Interest({name:'Geology', nickname:"geol"});
science.interests[science.interests.length] = new Interest({name:'Hydrogeology', nickname:"hgeo"});
science.interests[science.interests.length] = new Interest({name:'Mathematics', nickname:"math"});
science.interests[science.interests.length] = new Interest({name:'Physics & Applied Physics', nickname:"phys" });
for (var i =0; i< science.interests.length; i++){
	science.interests[i].noSpace = science.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	science.interests[i].nickname = science.interests[i].nickname.toUpperCase();
	science.interests[i].save();
}
science.save();
//}

//{ SETUP MANAGEMENT CATEGORY
var management = new Category({ name: 'Management'});

management.interests[management.interests.length] = new Interest({name:'Business & Management', nickname:"mgmt"});
management.interests[management.interests.length] = new Interest({name:'Financial Engineering', nickname:"fnce"});
for (var i =0; i< management.interests.length; i++){
	management.interests[i].noSpace = management.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	management.interests[i].nickname = management.interests[i].nickname.toUpperCase();
	management.interests[i].save();
}

management.save();
//}

//{ SETUP HASS CATEGORY
var hass = new Category({ name: 'Humanities, Arts, & Soc. Sciences'});

hass.interests[hass.interests.length] = new Interest({name:'Cognitive Science', nickname:"cogs"});
hass.interests[hass.interests.length] = new Interest({name:'Communication', nickname:"comm"});
hass.interests[hass.interests.length] = new Interest({name:'Design, Innovation, and Society', nickname:"dis"});
hass.interests[hass.interests.length] = new Interest({name:'Economics', nickname:"econ"});
hass.interests[hass.interests.length] = new Interest({name:'Electronic Arts', nickname:"ea"});
hass.interests[hass.interests.length] = new Interest({name:'Electronic Media, Arts, & Communication', nickname:"emac"});
hass.interests[hass.interests.length] = new Interest({name:'Games & Simulation Arts and Sciences', nickname:"gsas"});
hass.interests[hass.interests.length] = new Interest({name:'Philosophy', nickname:"phil"});
hass.interests[hass.interests.length] = new Interest({name:'Psychology', nickname:"psyc"});
hass.interests[hass.interests.length] = new Interest({name:'Science, Technology & Society', nickname:"sts"});
hass.interests[hass.interests.length] = new Interest({name:'Sustainability Studies', nickname:"sust"});

for (var i =0; i< hass.interests.length; i++){
	hass.interests[i].noSpace = hass.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	hass.interests[i].nickname = hass.interests[i].nickname.toUpperCase();
	hass.interests[i].save();
}

hass.save();


//}

//{ SETUP ARCHITECTURE CATEGORY
var arch = new Category({ name: 'Architecture'});

arch.interests[arch.interests.length] = new Interest({name:'Architecture', nickname:"arch"});
arch.interests[arch.interests.length] = new Interest({name:'Lighting', nickname:"lght"});
for (var i =0; i< arch.interests.length; i++){
	arch.interests[i].noSpace = arch.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	arch.interests[i].nickname = arch.interests[i].nickname.toUpperCase();
	arch.interests[i].save();
}

arch.save();
//}

//{ SETUP IT & WS CATEGORY
var itws = new Category({ name: 'Information Technology & Web Science'});

itws.interests[itws.interests.length] = new Interest({name:'Information Technology & Web Science', nickname:"itws"});
for (var i =0; i< itws.interests.length; i++){
	itws.interests[i].noSpace = itws.interests[i].name.replace(/ /g, "").replace(/,/g, "").toLowerCase();
	itws.interests[i].nickname = itws.interests[i].nickname.toUpperCase();
	itws.interests[i].save();
}

itws.save();
//}
/*
var timeStamp = new Date();
var timeStr = timeStamp.toDateString();
var posts = [];
var post1 = new Post({poster:'Sample Professor', content:'For students looking for experience with digital design. For credit or salary.', title:'VLSI Project', tags:['Electrical Engineering'], fullfilled:false, replyAddress: 'panser@rpi.edu', timePosted: timeStamp, timeString: timeStr});
post1.save();
posts.push(post1);
var post2 = new Post({poster:'Sample Professor', content:"Computational physics research in density functional theory. Must be junior or above with programming experience.", title:'DFT Research', fulfilled:false, replyAddress: 'panser@rpi.edu', timePosted: timeStamp, timeString: timeStr});
post2.save();
posts.push(post2);
var post3 = new Post({poster:'Sample Professor', content:"More physics stuff find out more later.", title:'Physics', fulfilled:true, replyAddress: 'panser@rpi.edu', timePosted: timeStamp, timeString: timeStr});
post3.save();
posts.push(post3);


//}
//console.log("engineering: " + JSON.stringify(engineering));
//console.log("first interest posts: " + Interest.findOne().exec().returnPosts());

Interest.findOne({name: "Electrical Engineering"},function(err,result){
	console.log("err is " + err);
	//console.log("first interest posts: " + JSON.stringify(result.returnPosts() ) );
	result.returnPosts()
});

*/


//engineering.interests[0].returnPosts();
//console.log(posts);
//Setup the server to listen on port 80 (Web traffic port), allow it to parse POSTED body data, and let it render EJS pages 
server.listen(process.env.PORT || 80);
app.use(bodyParser());
//app.set('view engine', 'ejs');

/*var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
	
	
});*/

console.log('Server running at http://127.0.0.1:8080/');

app.use(express.static(__dirname));

Category.find({},function(err,data){
	app.locals.categories = data;
});

app.locals.user = null;

//http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World\n');
//}).listen(8080, '127.0.0.1');
app.get('/', function(req, res){
	if (app.locals.user == null){
		res.render('login.ejs', {});
	}
	else{
		Post.find({},function(err,data){
			res.render('index', {posts:data});
		});
	}
});

app.get('/interests/:intName', function(req, res) {
	if (app.locals.user == null){
		res.redirect('/');
	}
	else{
		if (!req.params.intName){
			res.end();
			return;
		}
		var intName = req.params.intName;
		//console.log("the url for this request is" + req.url);
		//console.log("the path for this request is" + req.path);
		Interest.findOne({nickname:intName},function(err,interest){
			if (interest == null){
				res.end();
				return;
			}
			Post.find({tags:interest.name}, function(err, relevantPosts){
				if(err) return console.error(err);
				res.render('interests3', { interest: interest, posts: relevantPosts });
			});
		});
	}
});

app.get('/request', function(req, res){
	if (app.locals.user == null){
		res.redirect('/');
	}
	else{
		res.render('request',{});
	}
});

app.get('/register', function(req, res){
	res.render('register',{});
});

var findTags = function(message){
	var tags = message.split("#");
	tags.shift();
	for (var i =0; i< tags.length; i++){
		var endTag = tags[i].search(" ");
		if (endTag !== -1){
			tags[i] = tags[i].slice(0,endTag);
		}
		tags[i] = tags[i].toUpperCase();
	}
	return tags;
}

app.post("/sendMessage",function(req,res){

	subject = req.body.subject;
	message = req.body.message;
	var tags = findTags(message);
	var date = new Date();
	var timeS = date.toDateString();
	var currentUser = req.session.user.name.first + " " + req.session.user.name.last;
	var sentEmail = req.session.user.email;
	if (subject == null || message == null)
	{
		res.redirect("request.html");
		return;
	}
	var post = new Post({content:message, title:subject, fulfilled:false, timePosted: date, poster:currentUser, timeString:timeS, replyAddress:sentEmail, tags:[]});
	for (var i =0; i< tags.length; i++){
		Interest.findOne({$or : [{noSpace: tags[i]}, {nickname: tags[i]}]},function(err,result){
			if (result != null){
				post.tags.push(result.name);
				post.save();
			}
		});
	}
	post.save();
	res.redirect("/");
	//res.end();

});

app.post("/login",function(req,res){

	sentEmail = req.body.email;
	sentPassword = req.body.password;
	
	if (sentEmail == undefined || sentPassword == undefined)
	{
		res.redirect("login.html");
		return;
	}
	User.findOne({email:sentEmail, password:sentPassword}, function(err, loggedUser){
		if(err) return console.error(err);
		req.session.user = loggedUser;
		if(loggedUser!=null){
			app.locals.user = loggedUser;
			res.redirect("/");
		}
		else{
			console.log("Failed login; please try again.");
			res.redirect("login.html");
			app.get("/loginError", function(req, res){
				res.write('true');
				res.end();
			});
		}
	});

});

app.post("/registerUser", function(req, res){
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
			res.redirect("/");
		}
	});

});

app.get('/amILoggedIn', function(req, res){
	if(req.session.user){
		res.end("yes");
		return;
	}
	else{
		res.end("no");
		return;
	}
});
/*  All the old stuff (may be useful later)
app.get("/categories",function(req,res){

	//console.log("req.session.user is " + req.session.user);
	if (req.session.user == null){
		res.end("[]");
		return;
	}
	console.log("This doesn't happen by default, does it?");
	Category.find({},function(err,data){
		res.write(JSON.stringify(data) );
		res.end();
	});

});

app.post('/interestInfo', function(req,res){
	var queryName = req.body.name;
	Interest.findOne({nickname:queryName},function(err,result){
		console.log("err is " + err);
		res.write(JSON.stringify(result) );
		res.end();
	});

});

app.post("/unloadError",function(req, res){
	console.log("The request is: " +req.body.unload);
	if(req.body.unload==='true'){
		app.get("/loginError", function(req, res){
				res.write('false');
				res.end();
		});
	}
});

*/
