$(document).ready(function(){
	
		console.log("about to try to get categories");
		$.get("/categories",function(categories){
			
			categories = $.parseJSON(categories);
			var cat 
			for (var i = 0; i < categories.length; i++)
			{
				/*var cat  = '<div class="list-group">\n' +
						'<a href="#" class="list-group-item active">' + names[i] + '</a>\n' +	
					 '</div>\n'*/
				var cat = '<div class="list-group">\n' + 
					'<a href="#" class="list-group-item active">' + categories[i].name + '</a>\n';
				for (var j = 0; j < categories[i].interests.length; j++)
				{
					cat += '<a href="#" class="list-group-item">' + categories[i].interests[j].name + '</a>';
				}
				cat += "</div>";
				$("#categoriesListGroup").append(cat);
			}
			
		});
		
		/*$('.submit').on('click', function(e) {
			//alert('clicked');
			e.preventDefault();
			
		});*/
	
	});
	