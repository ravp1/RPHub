$(document).ready(function(){
	
	$.get("/amILoggedIn", function(data){
		//console.log(data);
		if (data =="no") {window.location.href = '/login.html';}
	});
	
	$.get("/categories",function(categories){
		
		categories = $.parseJSON(categories);

		for (var i = 0; i < categories.length; i++)
		{
			var cat = '<li>\
				<a href="#">'+categories[i].name +'</a>\
				<ul>';
			for (var j = 0; j < categories[i].interests.length; j++)
			{
				cat += '<li><a href="/interests/'+ categories[i].interests[j].nickname+'">' + categories[i].interests[j].name + '</a></li>';
			}
			cat += '</ul>\
				</li>';
			$("#menu").append(cat);
			//$('.panel-collapse').collapse('hide');
		}
		
	});
});


/*

*/