<?
	if (isset($_POST["Request"])) {
		$request = $_POST["Request"];
		$sdsId = $_POST["sdsId"]; 

		$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
		mysql_select_db ("cq58620_sds", $db);

		switch ($request) {
			case 'get_user':
				$output = array();
				$getData0 = mysql_query("SELECT name, level, email, skills FROM user WHERE id='$sdsId'", $db);
				$getData10 = mysql_fetch_array($getData0);
				$getData1 = mysql_query("SELECT daily_work_eff, max_work_time, min_break_time FROM process WHERE user_id='$sdsId'", $db);
				$getData11 = mysql_fetch_array($getData1);
				$output[0]['daily_work_eff'] = $getData11['daily_work_eff']/60;
				$output[0]['user_name'] = $getData10['name'];
				$output[0]['level'] = $getData10['level'];
				$output[0]['email'] = $getData10['email'];
				$output[0]['max_work_time'] = $getData11['max_work_time'];
				$output[0]['min_break_time'] = $getData11['min_break_time'];
				break;

			case 'save_option':
				$Edit_cell = $_POST["Edit_cell"]; 
				$Edit_value = $_POST["Edit_value"]; 
				$output = array();
				switch ($Edit_cell) {
					case 'daily_work_eff':
						$Edit_value = (int)$Edit_value;
						$Edit_value = $Edit_value*60;
						$updateStatus = mysql_query("UPDATE process SET $Edit_cell = '$Edit_value' WHERE user_id ='$sdsId'");
						$getData0 = mysql_query("SELECT $Edit_cell FROM process WHERE user_id='$sdsId'", $db);
						$getData10 = mysql_fetch_array($getData0);
						$output[0]['response'] = $getData10[$Edit_cell]/60; 
						break;
					
					case 'max_work_time':
						$Edit_value = (int)$Edit_value;
						$updateStatus = mysql_query("UPDATE process SET $Edit_cell = '$Edit_value' WHERE user_id ='$sdsId'");
						$getData0 = mysql_query("SELECT $Edit_cell FROM process WHERE user_id='$sdsId'", $db);
						$getData10 = mysql_fetch_array($getData0);
						$output[0]['response'] = $getData10[$Edit_cell]; 
						break;

					case 'min_break_time':
						$Edit_value = (int)$Edit_value;
						$updateStatus = mysql_query("UPDATE process SET $Edit_cell = '$Edit_value' WHERE user_id ='$sdsId'");
						$getData0 = mysql_query("SELECT $Edit_cell FROM process WHERE user_id='$sdsId'", $db);
						$getData10 = mysql_fetch_array($getData0);
						$output[0]['response'] = $getData10[$Edit_cell]; 
						break;

					default:
						# code...
						break;
				}
				
				break;

			default:
				$output = "No data. Error code 27";
				break;
		}
} else {
		$output = "No data. Error code 26";
	}

echo json_encode($output);