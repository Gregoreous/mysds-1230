<?
		if (isset($_POST["Gather"])) {
	
	};

	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	$getPoints = mysql_query("SELECT plus_dp FROM process WHERE id = '1'", $db);
	$getPoints1 = mysql_fetch_array($getPoints);
	$plus_dp = $getPoints1['plus_dp'];

	$updatePoints = mysql_query("UPDATE user SET points = points+'$plus_dp' WHERE id ='1' ") or die(mysql_error());
	$updatePoints2 = mysql_query("UPDATE day_reports SET dp_gained = dp_gained+'$plus_dp' WHERE this_date = CURDATE()") or die(mysql_error());
	$updateProcess = mysql_query("UPDATE process SET dp_totally=dp_totally+'$plus_dp', plus_dp = 0 WHERE id ='1' ") or die(mysql_error());

	echo json_encode("Gathered ".$plus_dp." points!");