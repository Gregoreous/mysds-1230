$(document).ready(function() {	
	//Вставить статус ajax запросом
		$.ajax({
			type: "POST",
			url: "/wp-content/themes/sds/assets/get_status.php",
			dataType: "json",
			success: function(data)
			{
			$("#status_now").text(data);
			//$("#CompanyID").val(data.CompanyID);
			}
		});

	//Вставить текущие денежные средства
		$.ajax({
			type: "POST",
			data: { Trigger: "get_cash" },
			url: "/wp-content/themes/sds/assets/cash.php",
			dataType: "json",
			success: function(data)
			{
			$("#money_wrap").text(data);
			}
		});

});