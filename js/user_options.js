function display_user_page() {
	$.ajax ({
			type: "POST",
			data: {
				sdsId: localStorage.getItem('sds_id'),
				Request: 'get_user'
			},
			url: "/wp-content/themes/sds/assets/user_operations.php",
			dataType: "json",
			success: function (data) {
				var user_icon = '<div class="user_icon_page"><span class="fa-stack fa-lg user_icon_page"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-user fa-stack-1x fa-inverse"></i></span></div>';
				var user_email  = '<br><br><span class="user_email_title">Your email</span><br>' +'<div id="email_input" class="user_info_input">' + data[0]['email'] + '</div>';
				var exit_btn = '<i class="fa user_exit_page_btn exit_option_bar p_icon fa_status_icon fa-times"></i>';
				var user_name_level = '<div class="user_name_level"><span class="user_name">' + data[0]['user_name'] + '</span><br>Level: ' + data[0]['level'] + '</div>' + exit_btn;
					var d = new Date();
	    			var today = d.getDay();
	    			if (today) {
	    				var user_eff_edit_btn = '<i title="Available for edit only on Sundays" id="daily_work_eff" class="edit_user_option fa fa-lock"></i>';
	    			} else {
	    				var user_eff_edit_btn = '<i id="daily_work_eff" class="edit_user_option fa fa-pencil"></i>';
	    			}
				var user_eff  = '<br><br><span class="user_email_title">100% efficiency</span><br>' + '<div id="daily_work_eff_input" class="user_info_input">' + data[0]['daily_work_eff'] + '</div>' + ' hours ' + user_eff_edit_btn;
				var user_max_work_time = '<br><br><span class="user_email_title">Work time duration </span><br>' + '<div id="max_work_time_input" class="user_info_input">' + data[0]['max_work_time'] + '</div>' + ' minutes <i id="max_work_time" class="edit_user_option fa fa-pencil"></i>' ;
				var user_min_break_time = '<br><br><span class="user_email_title">Break time duration </span><br>' + '<div id="min_break_time_input" class="user_info_input">' + data[0]['min_break_time'] + '</div>' + ' minutes <i id="min_break_time" class="edit_user_option fa fa-pencil"></i>' ;
				var user_info_block = '<div class="user_info_cont"><div class="user_info_block">' + user_icon +'   '+ user_name_level + user_email + user_eff + user_max_work_time + user_min_break_time+ '</div></div>';
				$('.option_list').append(user_info_block );
    			
			}
			});
	$( ".option_blc" ).fadeIn( "slow" );
	$('.charts').css('position', 'fixed');
}

function save_user_option(input_id, btn_id) {
	if ($( "input#"+input_id).val()) {
		$.ajax ({
				type: "POST",
				data: {
					sdsId: localStorage.getItem('sds_id'),
					Request: 'save_option',
					Edit_cell: btn_id,
					Edit_value: $( "input#"+input_id).val()
				},
				url: "/wp-content/themes/sds/assets/user_operations.php",
				dataType: "json",
				success: function (data) {
					var lastClass = $('#'+btn_id).attr('class').split(' ').pop();
					$('#'+btn_id).removeClass(lastClass);
					$('#'+btn_id).addClass('fa-pencil');
					$( "div#"+input_id).html(data[0]['response']);
				}
		});
	} else {
		var lastClass = $('#'+btn_id).attr('class').split(' ').pop();
		$('#'+btn_id).removeClass(lastClass);
		$('#'+btn_id).addClass('fa-pencil');
		var placeholder = $('input#'+input_id).attr('placeholder');
		$( "div#"+input_id).html(placeholder);
	}
		
}

function edit_user_option(btn_id) {
	var lastClass = $('#'+btn_id).attr('class').split(' ').pop();
	if (lastClass  == 'fa-pencil') {
		var input_id = btn_id+ '_input';
		var div_content = $( "div#"+input_id).html();
		var content = '<input id="'+btn_id+'_input" class="user_info_input user_info_input_edit" type="number" placeholder="'+div_content+'">';
		$('#'+btn_id).removeClass(lastClass);
		$('#'+btn_id).addClass('fa-check-circle');
		$( "div#"+input_id).html(content);
	} else if (lastClass == 'fa-check-circle') {
		var input_id = btn_id+ '_input';
		save_user_option(input_id, btn_id);
	}
}

$(document).ready(function() { 
	//Tracking user button
	$.listen("click",".open_user_btn", function(){
		display_user_page();
	});
	$.listen("click",".edit_user_option", function(){
		var id = this.id;
		edit_user_option(id);
	});
});
