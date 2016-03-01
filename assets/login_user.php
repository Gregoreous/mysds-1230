<?php
    if (isset($_POST['sds_pass'])) { 
       
        $e_login = $_POST['sds_email'];
        $e_password = $_POST['sds_pass'];

        $e_login = stripslashes($e_login);
        $e_login = htmlspecialchars($e_login);
        $e_password = stripslashes($e_password);
        $e_password = htmlspecialchars($e_password);
        $e_login = trim($e_login);
        $e_password = trim($e_password); 

        $output = array();

        $db = mysql_connect("localhost", "cq58620_sds","00110011Uh") or die(mysql_error("<p>Произошла ошибка при подсоединении к MySQL!</p>").mysql_error());
        mysql_select_db("cq58620_sds", $db);

        $result = mysql_query("SELECT password, id FROM user WHERE email='$e_login'",$db); //извлекаем из базы все данные о пользователе с введенным логином
        $myrow = mysql_fetch_array($result);
        if (empty($myrow['password'])) {
            $output[0]['error'] = "Извините, введённый вами login или пароль неверный.1";
        } else {
            $e_password    = md5($e_password);//шифруем пароль          
            $e_password    = strrev($e_password);// для надежности добавим реверс          
            $e_password    = $e_password."q462df";

            if ($myrow['password']==$e_password) {
                $output[0]['sds_id'] = $myrow['id'];
                $output[0]['sds_pass'] = $myrow['password'];
                $output[0]['success'] = true;
            } else {
                $output[0]['error'] = "Извините, введённый вами login или пароль неверный.2";
            }
        }
    } else {
        $output[0]['error'] = 'Nop data';
    }

    echo json_encode($output);