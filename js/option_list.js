	var statusId_reading;
	var projectId_reading;
	var taskId_reading;
	var default_task_form;
	var current_status;


	function zoom_mnu_status() {
		if ($('#switch_status_icon').data('shown')) {
			$('#switch_status_icon').removeClass('zoomIn');
			$('#switch_status_icon').addClass('zoomOut');
			$('#switch_status_icon').removeClass('hidden');
			setTimeout(addClass_hidden, 500);
			$('#switch_status_icon').data('shown', false);
		} else {
			$('#switch_status_icon').removeClass('zoomOut');
			$('#switch_status_icon').removeClass('hidden');
			$('#switch_status_icon').addClass('zoomIn');
			$('#switch_status_icon').data('shown', true);
		}
	}

	function trigger_status_position(status) {
		if ($(window).width() > 768) {
			switch (status) {
				case '2':
					$('#status_icon_trigger').css({'left':'-12px','top':'0px'});
					break
				case '3':
					$('#status_icon_trigger').css({'left':'-8px','top':'-1px'});
					break
				case '6':
					$('#status_icon_trigger').css({'left':'-1px','top':'-1px'});
					break
				case '4':
					$('#status_icon_trigger').css({'left':'-8px','top':'-1px'});
					break
				case '0':
					$('#status_icon_trigger').css({'left':'-12px','top':'1px'});
					break
				case '5':
					$('#status_icon_trigger').css({'left':'-16px','top':'-4px'});
					break
			}
		}
	}

	function zoom_trigger(status, type){
			
		if (type == 'flash') {
			trigger_status_position(statusId_reading);
			$('#status_button_trigger').removeClass('zoomIn');
			$('#status_button_trigger').addClass('animated zoomOut');
			function show_trigger_again() {
				var lastClass = $('#status_icon_trigger').attr('class').split(' ').pop();
				$('#status_icon_trigger').removeClass(lastClass);
				$('#status_icon_trigger').addClass(status); 
				$('#status_button_trigger').removeClass('zoomOut');
				$('#status_button_trigger').addClass('animated zoomIn');
			}
			setTimeout(show_trigger_again, 300);
			$('#status_button_trigger').data('shown', true);
			return;
		};

		if ($('#status_button_trigger').data('shown')) {
			trigger_status_position(statusId_reading);
			$('#status_button_trigger').removeClass('zoomIn');
			$('#status_button_trigger').addClass('animated zoomOut');

			$('#status_button_trigger').data('shown', false);
		} else {
			if (status) {
				trigger_status_position(statusId_reading);
				var lastClass = $('#status_icon_trigger').attr('class').split(' ').pop();
				$('#status_icon_trigger').removeClass(lastClass);
				$('#status_icon_trigger').addClass(status); 
				$('#status_button_trigger').removeClass('zoomOut');
				$('#status_button_trigger').addClass('animated zoomIn');
				$('#status_button_trigger').data('shown', true);
			} else {
				trigger_status_position(statusId_reading);
				$('#status_button_trigger').removeClass('zoomOut');
				$('#status_button_trigger').addClass('animated zoomIn');
				$('#status_button_trigger').data('shown', true);
			}
		}		
	}

	function addClass_hidden() { 
		$('#switch_status_icon').addClass('hidden'); 
	}

	function get_iconClass_byStatus(statusId) {
		switch (statusId) {
			case "0":
				return 'fa-recycle';
			break

			case "2":
				return 'fa-rocket';
			break

			case "3":
				return 'fa-exclamation-circle';
			break

			case "4":
				return 'fa-clock-o';
			break

			case "5":
				return 'fa-hotel';
			break

			case "6":
				return 'fa-bolt';
			break

			default:
				console.log("statusId: " + statusId);
				return 'fa-times';
			break
		}
	}

	function list_projects(id) {
		if (id == '2' || id == '3' || id == '4' || id == '0') {
			$.ajax ({
				type: "POST",
				data: {
					Status: id,
					sdsId: localStorage.getItem('sds_id')
				},
				url: "/wp-content/themes/sds/assets/get_project_status.php",
				dataType: "json",
				success: function (data) {
					if (data.length <= 4) {
						var add_project_btn = '<td><button id="0" class="p_add_task"><i id="'+id+'" title = "Add project" class="fa fa-plus-circle fa_status_icon p_add_btn"></i></button></td>';
					} else {
						var add_project_btn = '<td></td>';
					}

					switch (id) {
						case '2':
							p_icon = '<td><div class="p_icon"><i class="fa fa-rocket fa_status_icon"></i></div></td>';
							break;

						case '3':
							p_icon = '<td><div class="p_icon"><i class="fa fa-exclamation-circle fa_status_icon"></i></div></td>';
							break;

						case '4':
							p_icon = '<td><div class="p_icon"><i class="fa fa-clock-o fa_status_icon"></i></div></td>';
							break;

						case '0':
							p_icon = '<td><div class="p_icon"><i class="fa fa-recycle fa_status_icon"></i></div></td>';
							break;
					}
					var btn_addTask_title = 'title = "Add task"';
					var project_list = '<table class="project_table"><tbody><tr><th></th><th>Name</th><th>Day P</th><th>Week P</th><th>Month P</th><th>Total P</th><th></th><th style="padding-left: 1px;"><button class="exit_option_bar"><i class="fa exit_option_bar p_icon fa_status_icon fa-times"></i></button></th></tr>';
					for (var i = data.length - 1; i >= 0; i--) {
						//Name
						var p_name = '<td>' + data[i]["name"] + '</td>'; 
						//Button to start
						var p_btn_start = '<td><button id="' + data[i]["id"] + '"class="project_start" >start</button></td>';
						//Day progress count
						if (data[i]["max_daily"] != 0) {
							var p_day_progress0 = Math.round((data[i]["daily_t_spent"]/data[i]["max_daily"])*1000)/10;
							var p_day_progress = '<td>' + p_day_progress0 + '%^ </td>';
						} else if (data[i]["min_daily"] != 0) {
							var p_day_progress0 = Math.round((data[i]["daily_t_spent"]/data[i]["min_daily"])*1000)/10;
							var p_day_progress = '<td>' + p_day_progress0 + '% </td>';
						} else {
							var p_day_progress0 = Math.round((data[i]["daily_t_spent"]/60) * 10)/10 ;
							if (p_day_progress0 >= 2) {
								denotation = ' hours';
							} else {
								denotation = ' hour';
							}
							var p_day_progress = '<td>' + p_day_progress0 + denotation +'</td>';
						}

						//Week progress count
						if (data[i]["max_weekly"] != 0) {
							var p_week_progress0 = Math.round((data[i]["weekly_t_spent"]/data[i]["max_weekly"])*1000)/10;
							var p_week_progress = '<td>' + p_week_progress0 + '% ^ </td>';
						} else if (data[i]["min_weekly"] != 0) {
							var p_week_progress0 = Math.round((data[i]["weekly_t_spent"]/data[i]["min_weekly"])*1000)/10;
							var p_week_progress = '<td>' + p_week_progress0 + '% </td>';
						} else {
							var p_week_progress0 = Math.round((data[i]["weekly_t_spent"]/60) * 10)/10 ;
							if (p_week_progress0 >= 2) {
								denotation = ' hours';
							} else {
								denotation = ' hour';
							}
							var p_week_progress = '<td>' + p_week_progress0 + denotation +'</td>';
						}

						//Month progress count
						if (data[i]["max_monthly"] != 0) {
							var p_month_progress0 = Math.round((data[i]["monthly_t_spent"]/data[i]["max_monthly"])*1000)/10;
							var p_month_progress = '<td>' + p_month_progress0 + '%^ </td>';
						} else if (data[i]["min_monthly"] != 0) {
							var p_month_progress0 = Math.round((data[i]["monthly_t_spent"]/data[i]["min_monthly"])*1000)/10;
							var p_month_progress = '<td>' + p_month_progress0 + '% </td>';
						} else {
							var p_month_progress0 = Math.round((data[i]["monthly_t_spent"]/60) * 10)/10 ;
							if (p_month_progress0 >= 2) {
								denotation = ' hours';
							} else {
								denotation = ' hour';
							}
							var p_month_progress = '<td>' + p_month_progress0 + denotation +'</td>';
						}

						//Total progress
						if (data[i]["total_t_needed"] != null && data[i]["total_t_needed"] != 0) {
							var p_total_progress0 = Math.round((data[i]["total_t_spent"]/data[i]["total_t_needed"])*1000)/10;
							var p_total_progress = '<td>' + p_total_progress0 +'%</td>';
						} else {
							var p_total_progress = '<td>   -</td>';
						}

						//Forecast deadline
						//var forecast_deadline0 = data[i]["forecast_end_date"];
						var forecast_deadline = '<td>' + '-' +'</td>';

						//Add task btn
						//var p_add_task = '<td><button id="' + data[i]["id"] + '"class="p_add_task" >new task</button></td>';
						var p_add_task = '<td><button class="p_add_task" ><i id= ' + data[i]["id"] + ' ' + btn_addTask_title + ' class="fa fa-plus-circle add_task_btn fa_status_icon"></i></button></td>';
						project_list = project_list + '<tr>' + p_icon + p_name + p_day_progress + p_week_progress + p_month_progress + p_total_progress + p_btn_start + p_add_task + '</tr>';
					};
					//Adding 'other' projects
					project_list = project_list + '<tr>' + p_icon + "<td>Other</td>" + '<td></td>' + '<td></td>' + '<td></td>' + '<td></td>' + '<td><button id="0" class="project_start">start</button></td>' + add_project_btn + '</tr>';
					$('.option_list').append(project_list + '</tbody></table>');
					//console.log(data[2]);
					$('.back_option_bar').data('clicked', false);
				}
			});
			$( ".option_blc" ).fadeIn( "slow" );
		} else {
			$.ajax ({
				type: "POST",
				data: {
					Status: id,
					sdsId: localStorage.getItem('sds_id')
				},
				url: "/wp-content/themes/sds/assets/switch_status.php",
				dataType: "json",
				success: function (data) {
					current_status = id;
					zoom_trigger(data);
					zoom_mnu_status();
					$('.charts').css('position', 'relative');
				}
			});
		}
	}

	function project_start() {
		current_status = statusId_reading;
		$.ajax ({
				type: "POST",
				data: {
					Status: statusId_reading,
					Project: projectId_reading,
					sdsId: localStorage.getItem('sds_id')
				},
				url: "/wp-content/themes/sds/assets/switch_status.php",
				dataType: "json",
				success: function (data) {
					if ($('#switch_status_icon').data('shown') && !($('#status_button_trigger').data('shown'))) {
						zoom_mnu_status();
						zoom_trigger(data);
					} else {
						zoom_trigger(data, 'flash');
					}
					$( ".option_blc" ).fadeOut( "slow", function() {
						$( ".option_list" ).empty();
						$('.charts').css('position', 'relative');
					});
				}
			});
	}

	function list_tasks(id) {
		if (id == 0) {
			project_start();
		} else {
			$.ajax ({
				type: "POST",
				data: {
					Status: id,
					//sdsId: localStorage.getItem('sds_id')
				},
				url: "/wp-content/themes/sds/assets/get_task_status.php",
				dataType: "json",
				success: function (data) {
					if (data == null || data == 0) {
						project_start();
					} else {
						var btn_descr_title = 'title = Description';
						var btn_play_title = 'title = Start/Pause task';
						var btn_check_title = 'title = Complete';
						var task_list = '<table class="project_table"><tbody><tr><th></th><th>Name</th><th>Time needed</th><th>Completed</th><th>Reward</th><th></th><th style="padding-left: 1px;"><button class="exit_option_bar"><i class="fa back_option_bar p_icon fa_status_icon fa-chevron-left"></i></button></th><th style="padding-left: 1px;"><button class="exit_option_bar"><i class="fa exit_option_bar p_icon fa_status_icon fa-times"></i></button></th></tr>';
						//Проверка всех задач
						for (var j = data.length - 1; j >= 0; j--) {
							var t_name = '<td>' + data[j]['name'] + '</td>';
							var t_icon = '<td><div class="p_icon"><i class="fa fa-crosshairs fa_status_icon"></i></div></td>';
							if (data[j]['time_needed'] >= 120) {
								var t_tneeded0 = Math.round((data[j]["time_needed"]/60) * 10)/10;
								var t_tneeded = '<td>' + t_tneeded0 + ' hours</td>';
							} else {
								var t_tneeded = '<td>' + data[j]["time_needed"] + ' minutes</td>';
							}
							var t_completed = '<td>' + Math.round((data[j]["time_completed"]/data[j]["time_needed"])*1000)/10 + '%</td>';
							var t_reward = '<td>' + data[j]['dp_gain'] + ' DP</td>';
							var t_btn_descr = '<td><button class="task_desrc outline_none" ><i ' + btn_descr_title + ' id="' + data[j]["id"] + '" class="task_desrc_btn fa fa_status_icon fa-align-justify"></i></button></td>';
							if (data[j]['status'] == 1) {
								var t_btn_start = '<td><button class="task_start outline_none" ><i ' + btn_play_title + ' id="' + data[j]["id"] + '" class="task_start_btn fa fa_status_icon fa-pause-circle-o"></i></button></td>';
								var t_btn_complete = '<td><button class="task_complete outline_none" ><i ' + btn_check_title + ' id="' + data[j]["id"] + '" class="task_complete_btn fa fa_status_icon fa-circle-o"></i></button></td>';
							} else if (data[j]['status'] == 2 || data[j]['status'] == 3 ) {
								var t_btn_start = '<td><button class="task_start outline_none" ><i ' + btn_play_title + ' id="' + data[j]["id"] + '" class="task_start_btn fa fa_status_icon fa-stop-circle-o"></i></button></td>';
								var t_btn_complete = '<td><button class="task_complete outline_none" ><i ' + btn_check_title + ' id="' + data[j]["id"] + '" class="task_complete_btn fa fa_status_icon fa-check-circle-o"></i></button></td>';
							}
							else {
								var t_btn_start = '<td><button class="task_start outline_none" ><i ' + btn_play_title + ' id="' + data[j]["id"] + '" class="task_start_btn fa fa_status_icon fa-play-circle-o"></i></button></td>';
								var t_btn_complete = '<td><button class="task_complete outline_none" ><i ' + btn_check_title + ' id="' + data[j]["id"] + '" class="task_complete_btn fa fa_status_icon fa-circle-o"></i></button></td>';
							};
								
						//Добавление всех элементов задачи в строку
						task_list = task_list + '<tr>' + t_icon +  t_name + t_tneeded + t_completed + t_reward + t_btn_descr + t_btn_start + t_btn_complete + '</tr>' ;
						};
						//Проверка всех задач--/
						$( ".option_list" ).fadeOut( 300, function() {
							$(".option_list").empty();
							$('.option_list').append(task_list + '</tbody></table>');
							$(".option_list").fadeIn(300);
						});
					}
				}
			});
		}
	}

	function task_complete(id) {
		$.ajax ({
			type: "POST",
			data: {
				TaskId: id,
				Request: 'task_complete',
				sdsId: localStorage.getItem('sds_id')
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				var lastClass = $('i#'+id+'.task_complete_btn').attr('class').split(' ').pop();
				$('i#'+id+'.task_complete_btn').removeClass(lastClass);
				$('i#'+id+'.task_complete_btn').addClass(data['icon']);
				if (data['icon'] == 'fa-circle-o') {
					var lastClass = $('i#'+id+'.task_start_btn').attr('class').split(' ').pop();
					$('i#'+id+'.task_start_btn').removeClass(lastClass);
					$('i#'+id+'.task_start_btn').addClass(' fa-play-circle-o');
				} else if (data['icon'] == 'fa-check-circle-o') {
					var lastClass = $('i#'+id+'.task_start_btn').attr('class').split(' ').pop();
					$('i#'+id+'.task_start_btn').removeClass(lastClass);
					$('i#'+id+'.task_start_btn').addClass(' fa-stop-circle-o');
					if (data['statusid_link'] == 'task_completed') {
						alert('Task is completed and DP are added!');
					} else {
						var trigger_icon = get_iconClass_byStatus(data['statusid_link']);
						if ($('#switch_status_icon').data('shown')) {
							zoom_mnu_status();
							zoom_trigger(trigger_icon);
						} else {
							zoom_trigger(trigger_icon, 'flash');
						}
					}
				}
			}
		});
	}

	function task_start(id) {
		var lastClass = $('i#'+id+'.task_start_btn').attr('class').split(' ').pop();
		if (lastClass == 'fa-stop-circle-o') {
			alert('The task is completed');
			return;
		};
		$.ajax ({
			type: "POST",
			data: {
				TaskId: id,
				Request: 'task_start',
				sdsId: localStorage.getItem('sds_id')
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				if (data == 'The task is completed') {
					alert(data);
					return;
				};
				var lastClass = $('i#'+id+'.task_start_btn').attr('class').split(' ').pop();
				$('i#'+id+'.task_start_btn').removeClass(lastClass);
				$('i#'+id+'.task_start_btn').addClass(data['icon']);
				current_status = data['statusid_link'];
				var trigger_icon = get_iconClass_byStatus(data['statusid_link']);
				if ($('#switch_status_icon').data('shown')) {
					zoom_mnu_status();
					zoom_trigger(trigger_icon);
				} else {
					var lastClass = $('#status_icon_trigger').attr('class').split(' ').pop();
					$('#status_icon_trigger').removeClass(lastClass);
					$('#status_icon_trigger').addClass(trigger_icon); 
				}
				var working_id_status = data['working_id_status'];
				if (working_id_status) {
					var lastClass = $('i#'+working_id_status+'.task_start_btn').attr('class').split(' ').pop();
					$('i#'+working_id_status+'.task_start_btn').removeClass(lastClass);
					$('i#'+working_id_status+'.task_start_btn').addClass('fa-play-circle-o');
				};
			}
		});
	}

	function quick_task_start(id) {
		$.ajax ({
			type: "POST",
			data: {
				TaskId: id,
				Request: 'task_start',
				sdsId: localStorage.getItem('sds_id')
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				$( ".option_blc" ).fadeOut( "slow", function() {
					$( ".option_list" ).empty();
					$('.charts').css('position', 'relative');
					if ($('#switch_status_icon').data('shown')) {
						var trigger_icon = get_iconClass_byStatus(statusId_reading);
						zoom_mnu_status();
						zoom_trigger(trigger_icon);
					}
				});
				}
			});
	}

	function add_project_form(statusId) {
		if (statusId == 2) {
			var daily_time_input = '<div class="task_input_div"><input id="daily_time_input" class="task_input" name="task_timing" placeholder="Minimum daily time required (minutes)" type="number" required maxlength="4"></div>';
			var weekly_time_input = '<div class="task_input_div"><input id="weekly_time_input" class="task_input" name="task_timing" placeholder="Minimum weekly time required (hours)" type="number" required maxlength="3"></div>';
			var monthly_time_input = '<div class="task_input_div"><input id="monthly_time_input" class="task_input" name="task_timing" placeholder="Minimum monthly time required (hours)" type="number" required maxlength="3"></div>';
		} else if (statusId == 3 || statusId == 4 || statusId == 0) {
			var daily_time_input = '<div class="task_input_div"><input id="daily_time_input" class="task_input" name="task_timing" placeholder="Maximum daily time required (minutes)" type="number" required maxlength="4"></div>';
			var weekly_time_input = '<div class="task_input_div"><input id="weekly_time_input" class="task_input" name="task_timing" placeholder="Maximum weekly time required (hours)" type="number" required maxlength="3"></div>';
			var monthly_time_input = '<div class="task_input_div"><input id="monthly_time_input" class="task_input" name="task_timing" placeholder="Maximum monthly time required (hours)" type="number" required maxlength="3"></div>';
		}
		var icon_class = get_iconClass_byStatus(statusId_reading);
		var form_heading = '<i class="fa ' + icon_class + ' fa_status_icon form_title_icon"></i> <br> <span>Adding a new project </span> <br>';
		var name_input = '<div class="task_input_div"><input id="name_project" class="task_input" name="task_name" placeholder="Project title*" type="text" required maxlength="25"></div>';
		var descr_input = '<div class="task_input_div"><textarea id="descr_project" class="task_input" name="task_descr" placeholder="Project description*" required maxlength="500"></textarea></div>';
		var total_time_input = '<div class="task_input_div"><input id="total_time_input" class="task_input" name="task_timing" placeholder="Total time needed (hours)" type="number" required maxlength="4"></div>';
		
		var form_task_btn = '<button id="' + statusId + '" class="submit_project_btn outline_none" >Create project</button>';
		var task_form = '<div class="form_container">' + form_heading + name_input + descr_input + total_time_input + daily_time_input + weekly_time_input + monthly_time_input + form_task_btn + '</div>';
		$( ".option_list" ).fadeOut( 300, function() {
			$(".option_list").empty();
			$('.option_list').append(task_form);
			$(".option_list").fadeIn(300);
		});
	}

	function save_project(statusId) {
		// console.log('starting to save ' + $('#daily_time_input').val() +' '+  $('#weekly_time_input').val() +' '+ $('#monthly_time_input').val() +' '+ $('#name_project').val() +' '+ $('#descr_project').val() +' '+ $('#total_time_input').val());
		// console.log(statusId);
		$.ajax ({
			type: "POST",
			data: {
				Request: 'save_project',
				sdsId: localStorage.getItem('sds_id'),
				ProjectId: 0,
				status_id: statusId,
				daily_time_input: $('#daily_time_input').val(),
				weekly_time_input: $('#weekly_time_input').val(),
				monthly_time_input: $('#monthly_time_input').val(),
				name_project: $('#name_project').val(),
				descr_project: $('#descr_project').val(),
				total_time_input: $('#total_time_input').val()
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				if (data == 'Project created!') {
					//alert(data);
					$( ".option_list" ).fadeOut( 300, function() {
						$( ".option_list" ).empty();
						list_projects(statusId);
					});
				} else {
					alert('Nothing created');
				}
			}
		});
	}

	function display_task_form(ProjectName) {
		//Getting the heading
		var icon_class = get_iconClass_byStatus(statusId_reading);
		var form_heading = '<i class="fa ' + icon_class + ' fa_status_icon form_title_icon"></i> <br> <span>Adding task for ' + ProjectName + ' </span> <br>';
		var name_input = '<div class="task_input_div"><input id="name_task" class="task_input" name="task_name" placeholder="Task title*" type="text" required maxlength="50"></div>';
		var descr_input = '<div class="task_input_div"><textarea id="descr_task" class="task_input" name="task_descr" placeholder="Task description*" required maxlength="500"></textarea></div>';
		var timing_input = '<div class="task_input_div"><input id="timing_task" class="task_input" name="task_timing" placeholder="Time needed (minutes)*" type="number" required maxlength="3"></div>';
		var form_task_btn = '<button id="' + projectId_reading + '" class="form_task_btn outline_none" >Create task</button>';
		var task_form = '<div class="form_container">' + form_heading + name_input + descr_input + timing_input + form_task_btn + '</div>';
		$( ".option_list" ).fadeOut( 300, function() {
			$(".option_list").empty();
			$('.option_list').append(task_form);
			$(".option_list").fadeIn(300);
		});
	}



	function save_task(){
		var task_name = $('#name_task').val();
		var task_descr = $('#descr_task').val();
		var task_timing = $('#timing_task').val();
		if (default_task_form) {
			$.ajax ({
			type: "POST",
			data: {
				ProjectId: projectId_reading,
				Request: 'save_task_default',
				TaskName: task_name,
				TaskDescr: task_descr,
				TaskTiming: task_timing,
				sdsId: localStorage.getItem('sds_id')
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				var block_header = '<span> Task is successfully saved! </span> <br>'
				var btn_start_task = '<button id="' + data + '" class="q_task_start_btn btn_style_1 outline_none" >Start task</button>'
				var btn_add_another_tsk = '<button id="' + projectId_reading + '" class="add_task_btn btn_style_1 outline_none" >Create another</button>';
				var success_block = '<div class="form_container">' + block_header + btn_start_task + btn_add_another_tsk + '</div>';
				$( ".option_list" ).fadeOut( 300, function() {
					$(".option_list").empty();
					$('.option_list').append(success_block);
					$(".option_list").fadeIn(300);
				});
				}
			});
		} else {
			console.log('Task not saved');
		}
	}

	function update_status() {
		$.ajax ({
			type: "POST",
			data: {
				Request: 'get_progress',
				sdsId: localStorage.getItem('sds_id')
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				$( "#current_task_prgs" ).attr( "stroke-dashoffset", data['task'] );
				$( "#eff_prgs" ).attr( "stroke-dashoffset", data['eff'] );
				$( "#work_count" ).attr( "stroke-dashoffset", data['work_count'] );
				$( "#break_count" ).attr( "stroke-dashoffset", data['break_count'] );
				$( "#day_prgs" ).attr( "stroke-dashoffset", data['day'] );
				trigger_status_position(data['status']);
				if ((current_status !== data['status']) && (current_status !== undefined)) {
					var status = get_iconClass_byStatus(data['status']);
					zoom_trigger(status, 'flash');
					current_status = data['status'];
				} else {
					current_status = data['status'];
				};
				if (data['task_success'] == true) {
					$( "#status_button_trigger .status_icon_trigger" ).css({"text-shadow": "0 2px 19px rgb(215, 2, 6)", "-webkit-animation": "flickerAnimation 1.8s infinite", "-moz-animation": "flickerAnimation 1.8s infinite", "-o-animation": "flickerAnimation 1.8s infinite", "animation": "flickerAnimation 1.8s infinite"});
				} else {
					if ($(window).width() < 763) {
						$( "#status_button_trigger .status_icon_trigger" ).css({"text-shadow": "0 3px 9px rgba(0, 0, 0, 0.5)"," -webkit-animation": "none", "-moz-animation": "none", "-o-animation": "none", "animation": "none"});
					} else {
						$( "#status_button_trigger .status_icon_trigger" ).css({"text-shadow": "0 2px 19px rgba(0, 0, 0, 0.5)"," -webkit-animation": "none", "-moz-animation": "none", "-o-animation": "none", "animation": "none"});
				
					}
				}
			}
		});
	}

	function display_task_description(task_data) {
		var TaskName = task_data[0]['name'];
		var TaskDescr = task_data[0]['description'];
		var icon_class = 'fa-crosshairs';
		var form_heading = '<i class="fa ' + icon_class + ' fa_status_icon form_title_icon"></i> <div class="task_descr_title">' + TaskName + ' </div>';
		var descr_block = '<div class="task_input_div task_descr_div"><br>' + TaskDescr + '</div>';
		var form_task_btn = '<button id="' + projectId_reading + '" class="project_start outline_none" >Back</button>';
		var task_descr = '<div class="form_container">' + form_heading + descr_block + form_task_btn + '</div>';
		$( ".option_list" ).fadeOut( 300, function() {
			$(".option_list").empty();
			$('.option_list').append(task_descr);
			$(".option_list").fadeIn(300);
		});
	}



$(document).ready(function() {



	$(function(){
		var btnUpload=$('#upload');
		var status=$('#status');
		new AjaxUpload(btnUpload, {
			// action: '/wp-content/themes/sds/assets/upload_avatar.php',
			action: '/wp-content/themes/sds/upload_avatar.php',
			name: 'uploadfile',
			onSubmit: function(file, ext){
				if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){ 
				// extension is not allowed 
				status.text('Supported formats JPG, PNG or GIF');
				return false;
				}
				status.text('Downloading...');
			},
			onComplete: function(file, response){
				//On completion clear the status
				status.text('');
				//Add uploaded file to list
				if(response==="success"){
					$('<li></li>').appendTo('#files').html('<img src="http://mysds.ru/wp-content/themes/sds/uploads/profile_image/'+file+'" alt="" /><br />'+file).addClass('success');
				} else{
					$('<li></li>').appendTo('#files').text(file).addClass('error');
				}
			}
		}); 
});

	update_status();
	window.setInterval(update_status, 4000);

	$('#status_button_trigger').data('shown', true);
	$('#switch_status_icon').data('shown', false);

	$.listen("click","#status_icon_trigger", function(){
		zoom_trigger();
		zoom_mnu_status();
	});

	$.listen("click",".dark_bocks", function(){
		$( ".option_blc" ).fadeOut( "slow", function() {
			$( ".option_list" ).empty();
			$('.charts').css('position', 'relative');
		});
	});


	//Tracking project form buttons
	$.listen("click",".p_add_btn", function(){
		var status_id = this.id;
		statusId_reading = status_id;
		add_project_form(status_id);
	});

	//Tracking project save buttons
	$.listen("click",".submit_project_btn", function(){
		var status_id = this.id;
		statusId_reading = status_id;
		save_project(status_id);
	});

	//Tracking status buttons
	$.listen("click",".fa_group_style", function(){
		var status_id = this.id;
		statusId_reading = status_id;
		$('.charts').css('position', 'fixed');
		list_projects(status_id);
	});

	//Tracking project start buttons
	$.listen("click",".project_start", function(){
		var project_id = this.id;
		projectId_reading = project_id;
		list_tasks(project_id);

	});

	//Tracking exit option buttons
	$.listen("click",".exit_option_bar", function(){
		$( ".option_blc" ).fadeOut( "slow", function() {
			$( ".option_list" ).empty();
			$('.charts').css('position', 'relative');
		});
	});

	//Tracking back option buttons
	$.listen("click",".back_option_bar", function(){
		if ($('.back_option_bar').data('clicked')) {
			return;
		} else {
			$('.back_option_bar').data('clicked', true);
			$( ".option_list" ).fadeOut( 300, function() {
				$( ".option_list" ).empty();
				list_projects(statusId_reading);
			});
		}
		
	});

	//Tracking check task buttons
	$.listen("click",".task_complete_btn", function(){
		var task_id = this.id;
		task_complete(task_id);
	});

	//Tracking play/pause task buttons
	$.listen("click",".task_start_btn", function(){
		var task_id = this.id;
		task_start(task_id);
	});

	//Tracking start task button (after saving)
	$.listen("click",".q_task_start_btn", function(){
		var task_id = this.id;
		quick_task_start(task_id);
	});

	//Tracking Add task buttons (in project list)
	$.listen("click",".add_task_btn", function(){
		var project_id = this.id;
		projectId_reading = project_id;
		$.ajax ({
			type: "POST",
			async: false,
			data: {
				Request: 'get_project_name', 
				ProjectId: projectId_reading
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				display_task_form(data);
			}
			});
	});

	//Tracking Show description buttons (in task list)
	$.listen("click",".task_desrc_btn", function(){
		var task_id = this.id;
		taskId_reading = task_id;
		$.ajax ({
			type: "POST",
			async: false,
			data: {
				Request: 'get_task_descr', 
				TaskId: taskId_reading
			},
			url: "/wp-content/themes/sds/assets/task_operations.php",
			dataType: "json",
			success: function (data) {
				display_task_description(data);
			}
			});
	});

	//Tracking Add task buttons (sending request for saving task)
	$.listen("click",".form_task_btn", function(){
		var task_id = this.id;
		projectId_reading = task_id;
		default_task_form = 1;
		save_task();
	});

});