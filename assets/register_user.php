<?php
    if (isset($_POST['request'])) { 
        $request = $_POST['request'];
        switch ($request) {
            case 'save_user':
                $e_login = $_POST['sds_email'];
                $e_password = $_POST['sds_pass'];
                $sds_key = $_POST['sds_key'];
                $sds_name = $_POST['sds_name'];

                $e_login = stripslashes($e_login);
                $e_login = htmlspecialchars($e_login);
                $sds_key = htmlspecialchars($sds_key);
                $sds_key = stripslashes($sds_key);
                $e_password = stripslashes($e_password);
                $e_password = htmlspecialchars($e_password);
                $e_login = trim($e_login);
                $e_password = trim($e_password); 
                $sds_key = trim($sds_key); 

                $output = array();

                $db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
                mysql_select_db("cq58620_sds", $db);

                $result = mysql_query("SELECT password, id FROM user WHERE email='$e_login'",$db); //извлекаем из базы все данные о пользователе с введенным логином
                $myrow = mysql_fetch_array($result);

                if ($myrow['id'] == undefined) {
                    $output[0]['error'] = "Введённый вами электронный адрес уже зарегистрирован.".$myrow['id'];
                } elseif (!$myrow['id']) {
                    $result2 = mysql_query("SELECT id, status FROM eff_key WHERE eff_key = '$sds_key'",$db); //извлекаем из базы все данные о пользователе с введенным логином
                    $myrow2 = mysql_fetch_array($result2);
                    $key_id = $myrow2['id'];
                    $output[0]['key'] = $key_id;

                    if (!preg_match("/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/",$e_login)) {    
                    
                        $output[0]['error'] = "Извините, Вы ввели некорректную почту ".$e_login;
                    
                    } else {

                        if ($myrow2['status'] == 1) {
                            
                            $e_password    = md5($e_password);        
                            $e_password    = strrev($e_password);        
                            $e_password    = $e_password."q462df";

                            $result2 = mysql_query("INSERT INTO user VALUES('', '$sds_name', '0', '0', '0', '0', '', '$e_login', '$e_password', '')") or die(mysql_error());
                            
                            if ($result2) {
                                $updateStatus = mysql_query("UPDATE eff_key SET status = 0 WHERE id ='$key_id' ") or die(mysql_error());
                                $result3 = mysql_query("SELECT id FROM user WHERE email ='$e_login'",$db); //извлекаем из базы все данные о пользователе с введенным логином
                                $myrow3 = mysql_fetch_array($result3);
                                $sds_id = $myrow3['id'];
                                $output[0]['sds_id'] = $myrow3['id'];
                                $output[0]['sds_pass'] = $e_password;
                                $output[0]['success'] = true;

                                $result3 = mysql_query("INSERT INTO day_reports VALUES('', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1440', '0', '0', '0', '0', '$sds_id', '1','','0')") or die(mysql_error());
                                $result4 = mysql_query("SELECT time_total FROM day_reports WHERE user_id =1 ORDER BY id_count_user DESC",$db); //извлекаем из базы все данные о пользователе с введенным логином
                                $myrow4 = mysql_fetch_array($result4);
                                $time_total = $myrow4['time_total'];
                                $result6 = mysql_query("INSERT INTO day_reports VALUES('', CURDATE(), '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '$time_total', '0', '0', '0', '0', '$sds_id', '2','','0')") or die(mysql_error());

                                $result5 = mysql_query("SELECT this_date FROM week_reports WHERE user_id =1 ORDER BY id_count_user DESC",$db); //извлекаем из базы все данные о пользователе с введенным логином
                                $myrow5 = mysql_fetch_array($result5);
                                $this_date = $myrow5['this_date'];
                                $result7 = mysql_query("INSERT INTO week_reports VALUES('', '$this_date', '0', '0', '0', '0', '0', '0', '0', '0', '0', '$sds_id', '1','0')") or die(mysql_error());
                                
                                $result8 = mysql_query("INSERT INTO process VALUES('2', '0', '0', '0', '0', '0', '', '0', '0', '250', '1', '4', '0', '0', '0', '$sds_id', '480' , '300', '1260', '1320', '50', '15')") or die(mysql_error());       
                
                                
                            } 
                        } else {
                            $output[0]['error'] = 'No such effiency key available';
                        };

                    };
                }
                break;

            case 'create_process':
                $sds_id = $_POST['sds_id'];
                $Eff_hour = $_POST['Eff_hour'];
                $eff_hour = $Eff_hour*60;
                $Work_hour = $_POST['Work_hour'];
                $Break_hour = $_POST['Break_hour'];

                $db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
                mysql_select_db("cq58620_sds", $db);

                $result = mysql_query("UPDATE process SET min_break_time = '$Break_hour', max_work_time = '$Work_hour', daily_work_eff = '$eff_hour'  WHERE user_id = '$sds_id'") or die(mysql_error());       
                if ($result) {
                    $output[0]['success'] = true;
                } else {
                    $output[0]['error'] = 'No data3';
                }
                break;

            default:
                $output[0]['error'] = 'No data2';
                break;
        }
    } else {
        $output[0]['error'] = 'No data1';
    }

    echo json_encode($output);