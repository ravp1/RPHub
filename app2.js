// Load the http module to create an http server.
var http = require('http');
var express = require('express');
var app = express();


var MongoClient = require('mongodb').MongoClient;
 
var pizzaToppings;
var db = MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {

if(err)
	throw err;
console.log("connected to the mongoDB !");
//myCollection = db.collection('test_collection');
//if (db.getCollection("pizzaToppings") == null)
//{
	//console.log("checked 2");
	db.createCollection("pizzaToppings",{strict:true}, function(err2,collection){
		if (err2) console.log("err is " + err2);
		console.log("Created collection");
		//pizzaToppings = collection;
	});
//}
console.log("checked if pizzaToppings exists");


// Configure our HTTP server to respond with Hello World to all requests.
/*var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  //db.collection("pizzaToppings",function(err,coll){
	pizzaToppings = db.collection("pizzaToppings");
	// db.find({},function(err2,toppings){
		// console.log("toppings is " + JSON.stringify(toppings) );
		// response.write("number of pizza toppings in existence: " + toppings.length);
		// response.end("Hello World\n");
	// });
	console.log("theres 2 of me");
	pizzaToppings.find().toArray(function(err2,toppings){
		console.log("toppings is " + JSON.stringify(toppings) );
		response.write("number of pizza toppings in existence: " + toppings.length);
		response.end("Hello World\n");
	});
	
  //});
});*/
pizzaToppings = db.collection("pizzaToppings");
	
app.get("/",function(req,response){
	// db.find({},function(err2,toppings){
		// console.log("toppings is " + JSON.stringify(toppings) );
		// response.write("number of pizza toppings in existence: " + toppings.length);
		// response.end("Hello World\n");
	// });
	console.log("theres 1 of me");
	pizzaToppings.find().toArray(function(err2,toppings){
		console.log("toppings is " + JSON.stringify(toppings) );
		response.write("number of pizza toppings in existence: " + toppings.length);
		response.end("Hello World\n");
	});
});

// Listen on port 8000, IP defaults to 127.0.0.1
//server.listen(8000);
var server = app.listen(8000, function() {
    console.log('Listening on port %d', server.address().port);
});

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

});