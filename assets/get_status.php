<?
	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	$q = mysql_query("SELECT status FROM process WHERE id = '1'");
	$res = mysql_fetch_array($q);
	$status1 = $res['status'];

	switch ($status1) {
		case '1':
			$status = "Current status: Developing SDS";
			break;

		case '2':
			$status = "fa-rocket";
			break;

		case '3':
			$status = "fa-cog";
			break;

		case '4':
			$status = "fa-clock-o";
			break;

		case '5':
			$status = "fa-hotel";
			break;

		case '6':
			$status = "fa-bolt";
			break;
		
		default:
			$status = "fa-recycle";
			break;
	}
	echo json_encode($status);
