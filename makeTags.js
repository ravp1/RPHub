$(document).ready(function(){
	
	$.get("/amILoggedIn", function(data){
		console.log(data);
		if (data =="no") {window.location.href = '\login.html';}
	});
	
	var tagCollapse = true;
	
	console.log("about to try to get categories");
	$.get("/categories",function(categories){
		
		categories = $.parseJSON(categories);

		for (var i = 0; i < categories.length; i++)
		{
			/*var cat  = '<div class="list-group">\n' +
					'<a href="#" class="list-group-item active">' + names[i] + '</a>\n' +	
				 '</div>\n'*/
			var cat = '<div class="list-group">\n' + 
				'<a href="#" class="list-group-item active" style="background-color:#2d946c">' + categories[i].name + '</a>\n';
			var manyInterest = (categories[i].interests.length>2);
			console.log(manyInterest);
			for (var j = 0; j < categories[i].interests.length; j++)
			{
				cat += '<a href="#" class="list-group-item">' + categories[i].interests[j].name + '</a>';
				if (j===1 && manyInterest){
					cat +='<div id="collapse' + i +'" class="panel-collapse collapse in">'
				}
			}
			if(manyInterest){
				cat += '</div>\n'+
					'<div class="more-button">\n'+
						'<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + i +'" class="list-group-item more"> more...</a>\n'+
					'</div>\n'
			}
			cat += "</div>";
			$("#categoriesListGroup").append(cat);
			$('.panel-collapse').collapse('hide');
		}
		
			//$('.panel-collapse').collapse('hide');
			$('.more').on('click', function(e) {
				e.preventDefault();
				if(tagCollapse){
					$(this).html('less');
					tagCollapse = false;
				}
				else{
					$(this).html('more...');
					tagCollapse = true;
				}
				//$(this).hide();
			});
		
	});
});


/*

<div class="list-group">
		<a class="list-group-item active">Popular</a>
	
		<a href="#" class="list-group-item">Textbooks</a>
		<a href="#" class="list-group-item">asdfasdf</a>
		<a href="#" class="list-group-item">asdfasdf</a>
		
	<div id="collapse0" class="panel-collapse collapse in">
		<a href="#" class="list-group-item">asdfasdf</a>
		<a href="#" class="list-group-item">asdfasdf</a>
		<a href="#" class="list-group-item">asdfasdf</a>
	</div>
	<div class="more-button">
		<a data-toggle="collapse" data-parent="#accordion" href="#collapse0" class="list-group-item more"> more...</a>
	</div>
</div>
*/