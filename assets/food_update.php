<?
	if (isset($_POST["Food"])) {
	
	};

	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	$updateStatus = mysql_query("UPDATE process SET food = '0' WHERE id ='1' ") or die(mysql_error());

	echo json_encode("Food updated");