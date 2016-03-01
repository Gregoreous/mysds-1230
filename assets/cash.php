<?
if (isset($_POST["Trigger"])) {
	$trigger = $_POST["Trigger"];

	$db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
	mysql_select_db("cq58620_sds", $db);

	//$updateStatus = mysql_query("UPDATE process SET status = '$status' WHERE id ='1' ") or die(mysql_error());

	switch ($trigger) {
		case 'get_cash':
			$q = mysql_query("SELECT money FROM user WHERE id = '1'");
			$res = mysql_fetch_array($q);
			$cash1 = "Money: ".$res['money'];
			break;

		case '+':
			$sum = $_POST["Sum"];
			if ($_POST["Schedule"] == '1') {
				$cash1 = '<div class="select_span">Scheduling <span class="sum_cash">'.$sum.'</span> rub of profit</div>
					<div class="name_cash"><span>Name cash flow </span><input required class="black_txt" id="name_cash" type="text"></div>
					<div class="descr_cash"><span>Description </span><textarea required class="black_txt" name="" id="descr_cash" cols="30" rows="2"></textarea></div>
				<span>Cash type </span><select class="black_txt" name="type_cash" id="type_cash">
	 					<option selected value="11">Operating profit</option>
	 					<option value="12">Non-operating profit</option>
	 					<option value="13">Loan</option>
	 					<option value="14">Informal loan</option>
	 				</select> <br><span>Frequency </span>
					<select class="black_txt" id="cash_frequency">
						<option value="3">Every day</option>
						<option value="2">Every week</option>
						<option value="1">Every month</option>
						<option value="5">Every half a year</option>
						<option value="6">Frequency unknown</option>
					</select> <br> <span>Start date </span><input required id="date_start" class="black_txt" type="datetime-local"> <br>
						<span>Expire date </span><input id="date_end" class="black_txt" type="datetime-local"> <br>
	 				<input id="report_cash_btn" class="black_txt" name="cash_flow" type="button" value="next">';
			} else {
				$cash1 = '<div class="select_span">Reporting <span class="sum_cash">'.$sum.'</span> rub of profit</div>
					<div class="name_cash"><span>Name cash flow </span><input required class="black_txt" id="name_cash" type="text"></div>
					<div class="descr_cash"><span>Description </span><textarea required class="black_txt" name="" id="descr_cash" cols="30" rows="2"></textarea></div>
				<span>Cash type </span><select class="black_txt" name="type_cash" id="type_cash">
	 					<option selected value="11">Operating profit</option>
	 					<option value="12">Non-operating profit</option>
	 					<option value="13">Loan</option>
	 					<option value="14">Informal loan</option>
	 				</select> <br> <input id="report_cash_btn" class="black_txt" name="cash_flow" type="button" value="next">';
			}
			break;

		case '-':
			$sum = $_POST["Sum"];
			if ($_POST["Schedule"] == '1') {
				$cash1 = '<div class="select_span">Scheduling <span class="sum_cash">'.$sum.'</span> rub of expense</div>
					<div class="name_cash"><span>Name cash flow </span><input required class="black_txt" id="name_cash" type="text"></div>
					<div class="descr_cash"><span>Description </span><textarea required class="black_txt" name="" id="descr_cash" cols="30" rows="2"></textarea></div>
				<span>Cash type </span><select class="black_txt" name="type_cash" id="type_cash">
	 					<option selected value="213">Transport</option>
	 					<option value="212">Telecommunication</option>
	 					<option value="211">Food</option>
	 					<option value="222">Business lending</option>
	 					<option value="231">Entertainment</option>
	 					<option value="232">Clothing and accessories</option>
	 					<option value="233">Other</option>
	 				</select><br><span>Frequency </span>
					<select class="black_txt" id="cash_frequency">
						<option value="3">Every day</option>
						<option value="2">Every week</option>
						<option value="1">Every month</option>
						<option value="5">Every half a year</option>
						<option value="6">Frequency unknown</option>
					</select> <br><span>Start date </span><input required id="date_start" class="black_txt" type="datetime-local"> <br>
						<span>Expire date </span><input id="date_end" class="black_txt" type="datetime-local"> <br> <br> <input id="report_cash_btn" class="black_txt" name="cash_flow" type="button" value="next">';
			} else {
				$cash1 = '<div class="select_span">Reporting <span class="sum_cash">'.$sum.'</span> rub of expense</div>
					<div class="name_cash"><span>Name cash flow </span><input required class="black_txt" id="name_cash" type="text"></div>
					<div class="descr_cash"><span>Description </span><textarea required class="black_txt" name="" id="descr_cash" cols="30" rows="2"></textarea></div>
				<span>Cash type </span><select class="black_txt" name="type_cash" id="type_cash">
	 					<option selected value="213">Transport</option>
	 					<option value="212">Telecommunication</option>
	 					<option value="211">Food</option>
	 					<option value="222">Business lending</option>
	 					<option value="231">Entertainment</option>
	 					<option value="232">Clothing and accessories</option>
	 					<option value="233">Other</option>
	 				</select> <br> 
	 				<input id="report_cash_btn" class="black_txt" name="cash_flow" type="button" value="next">';
			}
			break;

		case 'clear':
			$cash1 = '<div class="dynamic_cash_cont">
	 				<div class="sum_cash"><input id="sum_cash" class="black_txt" name="sum" type="number"></div> 
	 				<div class="Schedule"><span id="Schedule">Schedule </span><input id="schedule" value="schedule" type="checkbox"></div>
	 				<div class="next_cash_btn"><input id="next_cash_btn" class="black_txt" name="cash_flow" type="button" value="next"></div>
					<div id="div_type_cash"></div>
				</div>';
			break;

		case 'report':
			$sum = $_POST["Sum"];
			$name = $_POST["Name"];
			$description = $_POST["Descr"];
			$type = $_POST["Type"];
			$frequency = $_POST["Freq"];
			$start_date = $_POST["StartD"];
			$end_date = $_POST["EndD"];
			if ($start_date) {
				$status = '0';
			} else {
				$status = '1';
				$add_cash = mysql_query("UPDATE user SET money = money+'$sum' WHERE id = '1'");
			}
			$cash_report = mysql_query("INSERT INTO cash_flow VALUES ('','$name','$description','$sum','$sum','$start_date','$end_date','$frequency','$type',CURDATE(),'','$status','')") or die(mysql_error());
			$cash1 = "Cash added!";
			break;
		
		default:
			$cash1 = "Nothing recieved";
			break;
	}
	echo json_encode($cash1);
} else {
	echo json_encode("Nothing recieved");
};

// if (isset($_POST["Report_cash"])) {
// 	$report_cash = $_POST["Report_cash"];

// };