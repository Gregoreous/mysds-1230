	function login_check() {
		if (localStorage.getItem('sds_pass')) {
			$.ajax ({
				type: "POST",
				data: {
					sds_pass: localStorage.getItem('sds_pass'),
					sds_email: localStorage.getItem('sds_email'),
					sds_id: localStorage.getItem('sds_id'),
				},
				url: "/wp-content/themes/sds/assets/login_check.php",
				dataType: "json",
				success: function (data) {
					if (!data[0]['success']) {
						window.location = "http://mysds.ru/login";
					};
				}
			});
		} else {
			window.location = "http://mysds.ru/login";
		}
	}


$(document).ready(function() {
	
	login_check();

});