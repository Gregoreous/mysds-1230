<?
	if (isset($_POST["Status"])) {
		$status = $_POST["Status"];
		$sdsId = $_POST["sdsId"]; 
		
	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db ("cq58620_sds", $db);

	$get_projects = mysql_query("SELECT forecast_end_date, id, statusid_link,  total_t_spent, total_t_needed, weekly_t_spent, daily_t_spent, weekly_t_spent, monthly_t_spent, min_weekly, max_daily, min_daily, max_monthly, min_monthly, max_weekly, name FROM projects WHERE statusid_link = '$status' and user_id = '$sdsId' ", $db);
	$output = array();
		while ($row = mysql_fetch_array($get_projects)) {
			$output[] = $row;
		}

	} else {
		$output = "No data";
	}

	echo json_encode($output);
	