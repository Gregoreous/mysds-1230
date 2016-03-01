function SetCookie(cookieName,cookieValue,nDays) {
    
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";path=/"+ ";expires="+expire.toGMTString();

}

function login_user() {
	$.ajax ({
			type: "POST",
			data: {
				sds_email: $('#sds_email').val(),
				sds_pass: $('#sds_pass').val(),
			},
			url: "/wp-content/themes/sds/assets/login_user.php",
			dataType: "json",
			success: function (data) {
				if (data[0]['success']) {
					if ($('#save_cookie').is(':checked')) {
						localStorage.setItem('sds_email', $('#sds_email').val());
						localStorage.setItem('sds_id', data[0]['sds_id']);
						localStorage.setItem('sds_pass', data[0]['sds_pass']);
						SetCookie('sds_id',data[0]['sds_id'],30);
						SetCookie('sds_pass',data[0]['sds_pass'],30);
					};
					window.location = "http://mysds.ru/main";
				} else {
					alert(data[0]['error']);
					console.log(data);
				}
			}
		});
}

$(document).ready(function() {

	$('#login_btn').on('click', function(e){
   		e.preventDefault();
   		login_user();
	});

});