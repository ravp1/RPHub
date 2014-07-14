
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

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){

});

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
	interests: [interestSchema],
	blocked: Boolean,
	loginFail: Boolean,
});
var interestSchema = new Schema({
	name: String,
	nickname: String
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
//}

app.use(session({secret: 'monkey wizard'}))

/*REMOVE CATEGORIES, POSTS, INTERESTS, USERS (NO LONGER PART OF PROCESS)
User.remove({}, function(err){
	console.log("removed users");
});

Category.remove({},function(err){
	console.log("removed categories");
});

Post.remove({}, function(err){
	console.log("removed posts");
});

Interest.remove({}, function(err){
	console.log("removed interests");
});
*/

/* CREATE SAMPLE USER (ALREADY DONE)
var sampleUser = new User({email: 'sample@rpi.edu', password: 'password', blocked: false, loginFail: false});
sampleUser.save();
*/

/* CREATE DEFAULT CATEGORIES, INETERESTS, POSTS (ALREADY CREATED; NO NEED TO RUN EVERY TIME)
//{ SETUP ENGINEERING CATEGORY
var engineering = new Category({ name: 'Engineering'});

engineering.interests[engineering.interests.length] = new Interest({name:'Aeronautical Engineering', nickname:"Aero"});
engineering.interests[engineering.interests.length] = new Interest({name:'Biomedical Engineering', nickname:"BME"});
engineering.interests[engineering.interests.length] = new Interest({name:'Chemical Engineering', nickname:"ChemE"});
engineering.interests[engineering.interests.length] = new Interest({name:'Civil Engineering', nickname:"Civil"});
engineering.interests[engineering.interests.length] = new Interest({name:'Computer & Systems Engineering', nickname:"CSE"});
engineering.interests[engineering.interests.length] = new Interest({name:'Electrical Engineering', nickname:"EE"});
engineering.interests[engineering.interests.length] = new Interest({name:'Environmental Engineering', nickname:"EnvE"});
engineering.interests[engineering.interests.length] = new Interest({name:'Industrial & Management Engineering', nickname:"IME"});
engineering.interests[engineering.interests.length] = new Interest({name:'Materials Engineering', nickname:"MatSci"});
engineering.interests[engineering.interests.length] = new Interest({name:'Mechanical Engineering', nickname:"MechE"});
engineering.interests[engineering.interests.length] = new Interest({name:'Nuclear Engineering', nickname:"NucE"});
for (var i =0; i< engineering.interests.length; i++){
	engineering.interests[i].save();
}
console.log(engineering.interests[3]);
engineering.save();
//}

//{ SETUP SCIENCE CATEGORY
var science = new Category({name:'Science'});
science.interests[science.interests.length] = new Interest({name:'Biology', nickname:"Bio"});
science.interests[science.interests.length] = new Interest({name:'Biochemistry & Biophysics', nickname:"BCBP"});
science.interests[science.interests.length] = new Interest({name:'Bioinformatics & Molecular Biology', nickname:"BIMB"});
science.interests[science.interests.length] = new Interest({name:'Chemistry', nickname:"Chem"});
science.interests[science.interests.length] = new Interest({name:'Computer Science', nickname:"CompSci"});
science.interests[science.interests.length] = new Interest({name:'Environmental Science', nickname:"EnvSci"});
science.interests[science.interests.length] = new Interest({name:'Geology', nickname:"Geo"});
science.interests[science.interests.length] = new Interest({name:'Hydrogeology', nickname:"Hydrogeo"});
science.interests[science.interests.length] = new Interest({name:'Mathematics', nickname:"Math"});
science.interests[science.interests.length] = new Interest({name:'Physics & Applied Physics', nickname:"Phys"});
for (var i =0; i< science.interests.length; i++){
	science.interests[i].save();
}
science.save();
//}

//{ SETUP MANAGEMENT CATEGORY
var management = new Category({ name: 'Management'});

management.interests[management.interests.length] = new Interest({name:'Business & Management', nickname:"MGMT"});
management.interests[management.interests.length] = new Interest({name:'Financial Engineering', nickname:"Finance"});
for (var i =0; i< management.interests.length; i++){
	management.interests[i].save();
}

management.save();
//}

//{ SETUP HASS CATEGORY
var hass = new Category({ name: 'Humanities, Arts, & Soc. Sciences'});

hass.interests[hass.interests.length] = new Interest({name:'Cognitive Science', nickname:"CogSci"});
hass.interests[hass.interests.length] = new Interest({name:'Communication', nickname:"Comm"});
hass.interests[hass.interests.length] = new Interest({name:'Design, Innovation, and Society', nickname:"DIS"});
hass.interests[hass.interests.length] = new Interest({name:'Economics', nickname:"Econ"});
hass.interests[hass.interests.length] = new Interest({name:'Electronic Arts', nickname:"EA"});
hass.interests[hass.interests.length] = new Interest({name:'Electronic Media, Arts, & Communication', nickname:"EMAC"});
hass.interests[hass.interests.length] = new Interest({name:'Games & Simulation Arts and Sciences', nickname:"GSAS"});
hass.interests[hass.interests.length] = new Interest({name:'Philosophy', nickname:"Phil"});
hass.interests[hass.interests.length] = new Interest({name:'Psychology', nickname:"Psych"});
hass.interests[hass.interests.length] = new Interest({name:'Science, Technology & Society', nickname:"STS"});
hass.interests[hass.interests.length] = new Interest({name:'Sustainability Studies', nickname:"SuS"});

for (var i =0; i< hass.interests.length; i++){
	hass.interests[i].save();
}

hass.save();


//}

//{ SETUP ARCHITECTURE CATEGORY
var arch = new Category({ name: 'Architecture'});

arch.interests[arch.interests.length] = new Interest({name:'Architecture', nickname:"ARCH"});
arch.interests[arch.interests.length] = new Interest({name:'Lighting', nickname:"LGHT"});
for (var i =0; i< arch.interests.length; i++){
	arch.interests[i].save();
}

arch.save();
//}

//{ SETUP IT & WS CATEGORY
var itws = new Category({ name: 'Information Technology & Web Science'});

itws.interests[itws.interests.length] = new Interest({name:'Information Technology & Web Science', nickname:"ITWS"});
for (var i =0; i< itws.interests.length; i++){
	itws.interests[i].save();
}

itws.save();
//}

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
server.listen(8080);
app.use(bodyParser());
//app.set('view engine', 'ejs');

app.use(express.static(__dirname));

//http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World\n');
//}).listen(8080, '127.0.0.1');
app.get('/', function(req, res){
	console.log("redirecting to login page");
	  res.redirect('login.html');

});

/*var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
	
	
});*/
console.log('Server running at http://127.0.0.1:8080/');


/*app.get("/index",function(req,res){

	console.log("trying to get index.html");
	if (req.session.user){
		res.redirect("index.html");
	}
	else{
		res.redirect("login.html");
	}

});*/


app.get("/categories",function(req,res){

	//console.log("req.session.user is " + req.session.user);
	if (req.session.user == null){
		res.end("[]");
		return;
	}

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


app.get('/c', function(req, res) {
	console.log("With invalid url, I made it here before crashing!");
  if (!req.query.cat){
	res.end();
	return;
  }
  var cat = req.query.cat;
  console.log("the url for this request is" + req.url);
  console.log("the path for this request is" + req.path);
  console.log("the pathname for this request is" + req.pathname);
  Interest.findOne({nickname:cat},function(err,interest){
	  if (interest == null){
		res.end();
		return;
	  }
	  var interestName = interest.name;
	  var posts = interest.returnPosts();
	  res.render('interests2', { name: interestName, posts: posts });
	  console.log("posts are: " + posts);
	});
});

app.get('/c/:intName', function(req, res) {
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
	  var interestName = interest.name;
	  var posts = interest.returnPosts();
	  res.render('interests2', { name: interestName, posts: posts });
	  console.log("posts are: " + posts);
	});
});

app.get('/c/:intName/:post', function(req, res) {
  if (!req.params.intName){
	res.end();
	return;
  }
  var intName = req.params.intName;
  Interest.findOne({nickname:intName},function(err,interest){
	  if (interest == null){
		res.end();
		return;
	  }
	  var interestName = interest.name;
	  var posts = interest.returnPosts();
	  res.render('posts', { name: interestName, posts: posts });
	  console.log("posts are: " + posts);
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
	
	var count = message.match(/\n/g);  
	console.log(count.length);
	if (subject == null || message == null)
	{
		res.redirect("request.html");
		return;
	}
	var post = new Post({content:message, title:subject, fulfilled:false});
	post.save();
	console.log(post);
	res.redirect("index.html");
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
			res.redirect("index.html");
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

app.post('/interestInfo', function(req,res){
	var queryName = req.body.name;
	Interest.findOne({nickname:queryName},function(err,result){
		console.log("err is " + err);
		res.write(JSON.stringify(result) );
		res.end();
	});

});
/*
app.post("/unloadError",function(req, res){
	console.log("The request is: " +req.body.unload);
	if(req.body.unload==='true'){
		app.get("/loginError", function(req, res){
				res.write('false');
				res.end();
		});
	}
});

//db.collection("posts").find({tags:this.name});



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
}
*/
