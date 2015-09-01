(function() {
	'use strict';

	$('button.generate-btn').click(function() {
		RandomAPI.getRandom(null, function(str) {
			console.log(str);
			$('.generated-number').text(str);
		});
	});
}());