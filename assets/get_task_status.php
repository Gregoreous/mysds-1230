<?
	if (isset($_POST["Status"])) {
		$status = $_POST["Status"];
		//$sdsId = $_POST["sdsId"]; 
		
	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db ("cq58620_sds", $db);

	$get_projects = mysql_query("SELECT id, name, time_needed, time_completed, dp_gain, status, order_inproject FROM tasks WHERE project_id = '$status'  ORDER BY order_inproject ", $db);
	$output = array();
		while ($row = mysql_fetch_array($get_projects)) {
			$output[] = $row;
		}

	} else {
		$output = "No data";
	}

	echo json_encode($output);
	