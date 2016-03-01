<?
	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	if (isset($_POST["Type"])) {
		$type = $_POST["Type"];
		$sdsId = $_POST["sdsId"]; 
	};

	switch ($type) {
		case 'main':
			$n = mysql_query("SELECT id_count_user FROM day_reports WHERE this_date = CURDATE() and user_id = '$sdsId'");
			$now = mysql_fetch_array($n);
			$todayId = $now['id_count_user'];
			$weekIds = $todayId - 8; 
			$result = mysql_query("SELECT time_health, time_assets, time_current, time_daily, this_date, efficiency, efficiency_depth_percent, time_waste, time_sleep FROM day_reports WHERE id_count_user > '$weekIds' and user_id = '$sdsId' ORDER by id_count_user LIMIT 7 ");
			$ountput = array();
			while ($row = mysql_fetch_array($result)) {
				$output[] = $row;
			}
			break;

		case 'week_comprsn':
			$weekday = date("w");

			$n = mysql_query("SELECT id_count_user FROM week_reports WHERE this_date = DATE_SUB(CURDATE(), INTERVAL '$weekday' DAY) and user_id = '$sdsId' ");
			$now = mysql_fetch_array($n);
			$last5Weeks = $now['id_count_user'] - 8;
			$result = mysql_query("SELECT this_date, av_efficiency FROM week_reports WHERE id_count_user > '$last5Weeks' and user_id = '$sdsId' ORDER by id_count_user");

			$output = array();
			while ($row = mysql_fetch_array($result)) {
				$output[] = $row;
			}
			break;
		
		default:
			$output = "No data";
			break;
	}
	echo json_encode($output);
	

