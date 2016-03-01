<?php

    $db = mysql_connect("92.53.96.101", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db ("cq58620_sds", $db);

	if (!$db)
	{
    echo "<p>Произошла ошибка при подсоединении к MySQL!</p>".mysql_error();
    } else if (!mysql_select_db("cq58620_sds", $db)) {
    	$response = "Выбранной базы данных не существует!</p>";
	} else {
		$response = "Соединение установлено";
	}

?>