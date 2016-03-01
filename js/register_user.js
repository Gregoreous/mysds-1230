function SetCookie(cookieName,cookieValue,nDays) {
    
    var today = new Date();
    var expire = new Date();
    if (nDays==null || nDays==0) nDays=1;
    expire.setTime(today.getTime() + 3600000*24*nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";path=/"+ ";expires="+expire.toGMTString();

}

function create_process() {
	var eff_hour = $('#sds_eff_hours').val();
	var work_hour = $('#sds_work_hour').val();
	var break_hour = $('#sds_break_hour').val();

	if (eff_hour && work_hour && break_hour) {
		//alert('Вы заполнили все поля');		

		$.ajax ({
			type: "POST",
			data: {
				request: 'create_process',
				sds_id: localStorage.getItem('sds_id'),
				Eff_hour: eff_hour,
				Work_hour: work_hour,
				Break_hour: break_hour
			},
			url: "/wp-content/themes/sds/assets/register_user.php",
			dataType: "json",
			success: function (data) {
				if (data[0]['success']) {
					window.location = "http://mysds.ru/main";
					//alert('Поздравляю!');
				} else {
					alert('Не поздравляю!' + data[0]['error']);

				}
			}
		});

	} else {
		alert('Вы не заполнили все поля!');
	}

}

function register_user() {
	if ($('#sds_pass').val() == $('#sds_rpass').val()) {
		$.ajax ({
			type: "POST",
			data: {
				request: 'save_user',
				sds_email: $('#sds_email').val(),
				sds_pass: $('#sds_pass').val(),
				sds_key: $('#sds_key').val(),
				sds_name: $('#sds_name').val(),
			},
			url: "/wp-content/themes/sds/assets/register_user.php",
			dataType: "json",
			success: function (data) {
				console.log(data);
				if (data[0]['success']) {
					
					if ($('#save_cookie').is(':checked')) {
						localStorage.setItem('sds_email', $('#sds_email').val());
						localStorage.setItem('sds_id', data[0]['sds_id']);
						localStorage.setItem('sds_pass', data[0]['sds_pass']);
						SetCookie('sds_id',data[0]['sds_id'],30);
						SetCookie('sds_pass',data[0]['sds_pass'],30);
					};
					
					var title = '<span class="register_title">Welcome to MySDS!</span> <br>';
					var eff_hour_title = '<span class="register_text">Введите количество рабочих часов, которое является для вас 100% эффективностью (обычно около 8 часов)</span><br>';
					var eff_hour_input = '<input class="task_input" maxlength="2" id="sds_eff_hours" type="text" name="e_password" placeholder="hours*" data-validation-required-message="Вы не ввели количество часов" required><br>';
					var work_hour_title = '<span class="register_text">Введите количество минут, в течение которых вы можете эффективно работать без перерыва (обычно от 30 до 60 минут)</span><br>';
					var work_hour_input = '<input class="task_input" maxlength="3" id="sds_work_hour" type="text" name="e_password" placeholder="minutes*" data-validation-required-message="Вы не ввели количество минут" required><br>';
					var break_hour_title = '<span class="register_text">Введите количество минут, необходимое для небольшого перерыва между работатой для сохранения максимальной трудоспособности (обычно от 7 до 20 минут)</span><br>';
					var break_hour_input = '<input class="task_input" maxlength="2" id="sds_break_hour" type="text" name="e_password" placeholder="minutes*" data-validation-required-message="Вы не ввели количество минут" required><br>';
					var submit = '<input class="task_input" id="create_process_btn" type="submit" name="enter" value="Register" >';
					
					var process_form = title + eff_hour_title + eff_hour_input + work_hour_title + work_hour_input + break_hour_title + break_hour_input + submit;
					$( ".Content" ).fadeOut( 300, function() {
						$(".Content").empty();
						$('.Content').append(process_form);
						$(".Content").fadeIn(300);
					});

				} else {
					alert(data[0]['error']);
					console.log(data);
				}
			}
		});
	} else {
		alert('Passwords don\'t match');
	}
	
}

$(document).ready(function() {

	$('#login_btn').on('click', function(e){
   		e.preventDefault();
   		register_user();
	});

	$.listen("click","#create_process_btn", function(){
		create_process();
	});

});