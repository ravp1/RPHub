$(document).ready(function(){
	var someDiv = "<div>Hey look what just worked! I just loaded <%= name %></div>"
	$("#sidebar").append(someDiv);
});