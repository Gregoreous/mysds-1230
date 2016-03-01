

$(document).ready(function() {

		//Создание нового финансового потока
		$.listen("click","#submit_cash_btn", function(){
			$.ajax ({
				type: "POST",
				data: {
					Submit_btn: $("#sum_cash").val(),
				},
				url: "/wp-content/themes/sds/assets/gather_points.php",
				dataType: "json",
				success: function (data) {
					alert(data);
				}
			})
		});

	//Этап1 формирование формы cash
	$.listen("click","#next_cash_btn", function(){
		if ($('#schedule').prop('checked')) {
			var schedule = '1';
		} else {
			var schedule = '0';
		};
		if ($("#sum_cash").val() > 0) {
			$.ajax ({
				type: "POST",
				data: {
					Trigger: "+",
					Schedule: schedule,
					Sum: $("#sum_cash").val()
				},
				url: "/wp-content/themes/sds/assets/cash.php",
				dataType: "json",
				success: function (data) {
					$('#next_cash_btn').remove();
					$('.Schedule').remove();
					$('.sum_cash').remove();
					$('#div_type_cash').append(data);
				}
			});
 		} else if ($("#sum_cash").val() < 0) {
 			$.ajax ({
				type: "POST",
				data: {
					Trigger: "-",
					Schedule: schedule,
					Sum: $("#sum_cash").val()
				},
				url: "/wp-content/themes/sds/assets/cash.php",
				dataType: "json",
				success: function (data) {
					$('#next_cash_btn').remove();
					$('.Schedule').remove();
					$('.sum_cash').remove();
					$('#div_type_cash').append(data);
				}
			})
 		}
	});
	//Этап1 формирование формы cash ---/

	//Очистка информации 
	$.listen("click","#clear_cash_btn", function(){
		$.ajax ({
				type: "POST",
				data: {
					Trigger: "clear",
				},
				url: "/wp-content/themes/sds/assets/cash.php",
				dataType: "json",
				success: function (data) {
					$(data).replaceAll('.dynamic_cash_cont');
				}
			})
	});

	//Фиксация денежного потока
	$.listen("click","#report_cash_btn", function(){
		$.ajax ({
				type: "POST",
				data: {
					Trigger: "report",
					Sum: $(".sum_cash").text(),
					Name: $("#name_cash").val(),
					Descr: $("#descr_cash").val(), 
					Type: $("#type_cash").val(),
					Freq: $("#cash_frequency").val(),
					StartD: $("#date_start").val(),
					EndD: $("#date_end").val(),
				},
				url: "/wp-content/themes/sds/assets/cash.php",
				dataType: "json",
				success: function (data) {
					alert(data);
				}
			})
	});
});


	

	