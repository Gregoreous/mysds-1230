<?
	if (isset($_POST["Request"])) {
		$request = $_POST["Request"];
		$project_id = $_POST["ProjectId"]; 
		$sdsId = $_POST["sdsId"]; 

		$db = mysql_connect("92.53.96.101", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
		mysql_select_db ("cq58620_sds", $db);

		switch ($request) {
			case 'task_complete':
				$task_id = $_POST["TaskId"];
				$get_task = mysql_query("SELECT status, statusid_link FROM tasks WHERE id = '$task_id' ", $db);
				$row = mysql_fetch_array($get_task);
				$current_status = $row['status'];
				$statusid_link = $row['statusid_link'];
				if ($current_status == '2') {
					$updateStatus = mysql_query("UPDATE tasks SET status = 0 WHERE id ='$task_id' ") or die(mysql_error());
					$output = array('icon' => 'fa-circle-o');
				} else if ($current_status == '1') {
					$updateStatus = mysql_query("UPDATE tasks SET status = 2 WHERE id ='$task_id' ") or die(mysql_error());
					$updateStatus = mysql_query("UPDATE process SET project_status = 0, task_status = 0 WHERE user_id = '$sdsId' ") or die(mysql_error());
					$output = array('icon' => 'fa-check-circle-o', 'statusid_link' => $statusid_link);
				} else if ($current_status == '3') {
					$output = array('icon' => 'fa-check-circle-o', 'statusid_link' => 'task_completed');
				} else {
					$updateStatus = mysql_query("UPDATE tasks SET status = 2 WHERE id ='$task_id' ") or die(mysql_error());
					$getData = mysql_query("SELECT status FROM process WHERE user_id = '$sdsId'", $db);
					$row = mysql_fetch_array($getData);

					$output = array('icon' => 'fa-check-circle-o', 'statusid_link' => $row["status"]);
				}
				break;

			case 'task_start':
				
				$task_id = $_POST["TaskId"];
				$get_task = mysql_query("SELECT status, project_id, statusid_link FROM tasks WHERE id = '$task_id' ", $db);
				$row = mysql_fetch_array($get_task);
				$current_status = $row['status'];
				$statusid_link = $row['statusid_link'];
				$project_id = $row['project_id'];
				if ($current_status == '2' || $current_status == '3') {
					$output = 'Task is completed';
				} else if ($current_status == '0') {
					$get_working_task = mysql_query("SELECT id FROM tasks WHERE status = 1 ", $db);
					$row1 = mysql_fetch_array($get_working_task);
					$working_id_status = $row1['id'];
					if ($working_id_status) {
						$updateWStatus = mysql_query("UPDATE tasks SET status = 0 WHERE id ='$working_id_status' ") or die(mysql_error());
					} 
					$updateStatus = mysql_query("UPDATE tasks SET status = 1 WHERE id ='$task_id' ") or die(mysql_error());
					$updateStatus = mysql_query("UPDATE process SET status = '$statusid_link', project_status = '$project_id', task_status = '$task_id' WHERE user_id = '$sdsId'") or die(mysql_error());
					$output = array('icon' => 'fa-pause-circle-o', 'statusid_link' => $statusid_link, 'working_id_status' => $working_id_status);

				} else if ($current_status == '1') {
					$updateStatus = mysql_query("UPDATE tasks SET status = 0 WHERE id ='$task_id' ") or die(mysql_error());
					$updateStatus = mysql_query("UPDATE process SET status = 4, project_status = 0, task_status = 0 WHERE user_id = '$sdsId' ") or die(mysql_error());
					$output = array('icon' => 'fa-play-circle-o', 'statusid_link' => '4');
				}
				break;

			case 'get_project_name': 
				$get_project = mysql_query("SELECT name FROM projects WHERE id = '$project_id' ", $db);
				$row = mysql_fetch_array($get_project);
				$output = $row['name'];
				break;
 
			case 'save_task_default': 
				$getData5 = mysql_query("SELECT work_day_end, work_day_start FROM process WHERE user_id='$sdsId'", $db);
				$getData15 = mysql_fetch_array($getData5);
				$work_day_end = $getData15['work_day_end'];
				$work_day_start = $getData15['work_day_start'];

				$task_name = $_POST["TaskName"];
				$task_descr = $_POST["TaskDescr"];
				$task_timing = $_POST["TaskTiming"];
				$get_project = mysql_query("SELECT statusid_link FROM projects WHERE id = '$project_id' ", $db);
				$row = mysql_fetch_array($get_project);
				$statusid_link = $row['statusid_link'];
				//Creating DP value
				if ($statusid_link == 2) {
					$dp_gain = ($task_timing/2) + mt_rand(round($task_timing/5), round($task_timing/3));
				} else if ($statusid_link == 3) {
					$dp_gain = ($task_timing/3) + mt_rand(round($task_timing/6), round($task_timing/4));
				} else {
					$dp_gain = ($task_timing/5) + mt_rand(round($task_timing/7), round($task_timing/5));
				}
				$new_task = mysql_query("INSERT INTO tasks VALUES ('$dp_gain', '$task_timing', '$work_day_start', '$work_day_end', '',CURDATE() ,CURDATE() + INTERVAL 90 DAY, '$project_id', '', '', '$task_name', '$task_descr', '', '0', '$statusid_link', '$sdsId', '')") or die(mysql_error());
				
				$get_task = mysql_query("SELECT id FROM tasks WHERE project_id = '$project_id' and name = '$task_name' ", $db);
				$row = mysql_fetch_array($get_task);
				$output = $task_id = $row['id'];
				break;
			
			case 'get_progress':
				$getData5 = mysql_query("SELECT min_break_time, max_work_time, auto_sleep_time, work_day_end, work_day_start, daily_work_eff FROM process WHERE user_id='$sdsId'", $db);
				$getData15 = mysql_fetch_array($getData5);
				$min_break_time = $getData15['min_break_time'];
				$max_work_time = $getData15['max_work_time'];
				$auto_sleep_time = $getData15['auto_sleep_time'];
				$work_day_end = $getData15['work_day_end'];
				$work_day_start = $getData15['work_day_start'];
				$daily_work_eff = $getData15['daily_work_eff'];

				//task progress
				$get_task_prgrs = mysql_query("SELECT time_needed, id, time_completed, name FROM tasks WHERE status = '1' and user_id = '$sdsId' ", $db);
				$row = mysql_fetch_array($get_task_prgrs);
				$time_needed = $task_id = $row['time_needed'];
				$time_completed = $task_id = $row['time_completed'];
				$output = array();
				$output['task'] = round(($time_completed/$time_needed)*6300)/10;
				$output['task_first'] = $output['task'];
				if ($output['task'] <= 756 and $output['task'] >= 504) {
					$output['task_success'] = true;
				} else {
					$output['task_success'] = false;
				}
				if ($output['task'] >= 630) {
					$output['task'] = 630;
				}



				//effeciency progress
				$getData = mysql_query("SELECT time_total, time_assets, time_current FROM day_reports WHERE this_date = CURDATE() AND user_id = '$sdsId'", $db);
				$getData1 = mysql_fetch_array($getData);
				$time_eff1 = $getData1['time_assets'];
				$time_eff2 = $getData1['time_current'];
				$output['eff'] = round((($time_eff1 + $time_eff2)/$daily_work_eff)*6300)/10;
				if ($output['eff'] >= 630) {
					$output['eff'] = 630;
				}
				$time_total = $getData1['time_total'];
				if ($time_total < $work_day_end and $time_total > $work_day_start ) {
					$output['day'] = round((($time_total-$work_day_start)/($work_day_end - $work_day_start))*630);
				} else {
					$output['day'] = 0;
				};

				//user level
				$getData = mysql_query("SELECT work_count, break_count, status FROM users WHERE user_id = '$sdsId'", $db);
				$getData1 = mysql_fetch_array($getData);
				$user_level = $getData1['work_count'];

				//wor count progress
				$getData = mysql_query("SELECT work_count, break_count, status FROM process WHERE user_id = '$sdsId'", $db);
				$getData1 = mysql_fetch_array($getData);
				$work_count1 = $getData1['work_count'];
				$break_count = $getData1['break_count'];
				$output['status'] = $getData1['status'];
				$output['work_count'] = round(($work_count1/$max_work_time)*6300)/10;
				$output['break_count'] = round(($break_count/$min_break_time)*6300)/10;
				if ($output['work_count'] >= 630) {
					$output['work_count'] = 630;
				} if ($output['break_count'] >= 630) {
					$output['break_count'] = 630;
				}
				break;

			case 'get_task_descr':
				$task_id = $_POST["TaskId"]; 
				$get_project = mysql_query("SELECT description, dp_gain, name FROM tasks WHERE id = '$task_id' ", $db);
				while ($row = mysql_fetch_array($get_project)) {
					$output[] = $row;
				}
				break;

			case 'save_project':
				$output = 'Something wrong';

				$daily_time_input = $_POST["daily_time_input"]; 
				$weekly_time_input = $_POST["weekly_time_input"]*60; 
				$monthly_time_input = $_POST["monthly_time_input"]*60; 
				$name_project = $_POST["name_project"]; 
				$descr_project = $_POST["descr_project"]; 
				$total_time_input = $_POST["total_time_input"]*60; 
				$status_id = $_POST["status_id"]; 

				if ($status_id == 2) {
					$new_task = mysql_query("INSERT INTO projects VALUES ('', '$name_project', '0', '0', '0', '0' , '0', '$weekly_time_input', '0', '$daily_time_input', '0', '$monthly_time_input', '$status_id', '$total_time_input', '$descr_project', '' , '$sdsId', '')") or die(mysql_error());
				
				} else {
					$new_task = mysql_query("INSERT INTO projects VALUES ('', '$name_project', '0', '0', '0', '0', '$weekly_time_input', '0', '$daily_time_input', '0', '$monthly_time_input', '0', '$status_id', '$total_time_input', '$descr_project', '' , '$sdsId', '')") or die(mysql_error());
				}
				
				if ($new_task) {
					$output = 'Project created!';
				} else {
					$output = 'Something wrong';
				}

				break;

			default:
				$output = "No data2";
				break;
		}

	} else {
		$output = "No data1";
	}

	echo json_encode($output);
	