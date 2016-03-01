<?
	if (isset($_POST["Status"])) {
		$status = $_POST["Status"];
		$project = $_POST["Project"];
		$sdsId = $_POST["sdsId"]; 
	};

	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	$updateStatus = mysql_query("UPDATE process SET status = '$status', project_status = '$project', task_status = 0 WHERE user_id ='$sdsId' ") or die(mysql_error());
	$get_working_task = mysql_query("SELECT id FROM tasks WHERE status = 1 and user_id = '$sdsId' ", $db);
	$row1 = mysql_fetch_array($get_working_task);
	$working_id_status = $row1['id'];
	if ($working_id_status) {
		$updateWStatus = mysql_query("UPDATE tasks SET status = 0 WHERE id ='$working_id_status' and user_id = '$sdsId' ") or die(mysql_error());
	}
	switch ($status) {
		case '1':
			$status1 = "Current status: Developing SDS";
			break;

		case '2':
			$status1 = "fa-rocket";
			break;

		case '3':
			$status1 = "fa-exclamation-circle";
			break;

		case '4':
			$status1 = "fa-clock-o";
			break;

		case '5':
			$status1 = "fa-hotel";
			break;

		case '6':
			$status1 = "fa-bolt";
			break;
		
		default:
			$status1 = "fa-recycle";
			break;
	}

	echo json_encode($status1);