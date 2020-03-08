<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

function sendError($echoResult)
{
    header('HTTP/1.0 403 Forbidden');
    echo $echoResult;
    exit();
}

// обработка только ajax запросов (при других запросах завершаем выполнение скрипта)
if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    sendError("Сообщение не было отправлено. Сервер принимает только AJAX запрос");
}

// обработка данных, посланных только методом POST (при остальных методах завершаем выполнение скрипта)
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    sendError("Сообщение не было отправлено. Сервер принимает только метод POST");
}

const
    MAX_FILE_SIZE = 2097152, // максимальный размер файла (в байтах)
    MAX_FILE_COUNT = 5, //максимальное количество файлов
    ALLOWED_EXTENSIONS = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf'), // разрешённые расширения файлов
    MAIL_FROM = '...@gmail.com', // от какого email будет отправляться письмо
    MAIL_FROM_NAME = 'UserName, // от какого имени будет отправляться письмо
    MAIL_FROM_SITE = 'siteName',
    MAIL_FROM_HOST = 'adress site',
    MAIL_SUBJECT = 'Сообщение с формы обратной связи', // тема письма
    MAIL_ADDRESS =  array('username@gmail.com'), // кому необходимо отправить письмо, адреса необходимо перечислять через запятую
    MAIL_SMTP_HOST = 'ssl://smtp.gmail.com', // SMTP-хост
    MAIL_SMTP_PORT = '465', // SMTP-порт
    MAIL_SMTP_USERNAME = 'mail@gmail.com', // SMTP-пользователь
    MAIL_SMTP_PASSWORD = 'password'; // SMTP-пароль

// Переменные, которые отправляет пользователь
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = $_POST['email'];
$phone = preg_replace('/\D/', '', $_POST['personalPhone']);
$theme = filter_var($_POST['theme'], FILTER_SANITIZE_STRING);
$text = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

$nameLength = iconv_strlen($name, 'UTF-8');
$themeLength = iconv_strlen($theme, 'UTF-8');
$textLength = iconv_strlen($text, 'UTF-8');

$mail = new PHPMailer\PHPMailer\PHPMailer();

session_start();

//Валидация данных формы

$validate = 'success'; //создаем переменную флаг, результата валидации
$resultMessage = ''; //создаем переменную лог результата валидации

//Проверяем поле name, оно должно быть не пустым и не больше 30 символов
if (!trim($name) or $nameLength > 30) {
    $validate = 'error';
    $resultMessage .= "Не пройдена проверка поля: Имя! Поле должно быть не пустым и не больше 30 символов. <br>";
}

//Проверяем поле email, оно должно быть не пустым и корректным
if (!filter_var(trim($email), FILTER_VALIDATE_EMAIL)) {
    $validate = 'error';
    $resultMessage .= "Не пройдена проверка поля: email! Поле должно быть не пустым и корректным. <br>";
}

//Проверяем поле phone, оно должно быть не пустым и и состоять из 5-11 символов
if (!trim($phone) or !preg_match('/^(8|7)(\d{10})$/', $phone)) {
    $validate = 'error';
    $resultMessage .= "Не пройдена проверка поля: телефон! Поле Телефон содержит не корректный номер! <br>";
}

//Проверяем поле theme, оно должно быть не пустым и не больше 100 символов
if (!trim($theme) or $themeLength > 100) {
    $validate = 'error';
    $resultMessage .= "Не пройдена проверка поля: Тема! Поле должно быть не пустым и не больше 100 символов. <br>";
}

//Проверяем поле text, оно должно быть не пустым и не больше 500 символов
if (!trim($text) or $textLength > 500) {
    $validate = 'error';
    $resultMessage .= "Не пройдена проверка поля: Сообщение! Поле должно быть не пустым и не больше 500 символов. <br>";
}

//Проверка капчи
if (isset($_POST['captcha']) && isset($_SESSION['captcha'])) {
    $captcha = filter_var($_POST['captcha'], FILTER_SANITIZE_STRING); // защита от XSS
    if ($_SESSION['captcha'] != $captcha) { // проверка капчи
        $validate = 'error';
        $resultMessage .= "Не пройдена проверка поля: captcha! Указанный код $captcha не соответствует сгенерированному на сервере <br>";
    }
} else {
    $validate = 'error';
    $resultMessage .= "Произошла ошибка при проверке captcha! <br>";
}

//print_r ($_FILES);

//Проверяем прикрепленные файлы
if (!empty($_FILES['userfile']['name'][0])) {

    if (count($_FILES['userfile']['name']) <= MAX_FILE_COUNT) {

        foreach ($_FILES['userfile']['error'] as $key => $error) {

            if ($error == UPLOAD_ERR_OK) {
                // получаем имя файла
                $fileName = $_FILES['userfile']['name'][$key];
                // получаем расширение файла в нижнем регистре
                $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                // получаем размер файла
                $fileSize = $_FILES['userfile']['size'][$key];
                //проверяем расширения файла
                if (!in_array($fileExt, ALLOWED_EXTENSIONS)) {
                    $validate = 'error';
                    $resultMessage .= "Произошла ошибка! Файл $fileName имеет не разрешённый тип! <br>";
                }
                //Проверяем размер файла
                if ($fileSize > MAX_FILE_SIZE) {
                    $validate = 'error';
                    $resultMessage .= "Произошла ошибка! Размер файла $fileName превышает " . MAX_FILE_SIZE / (1024 * 1024) . " Мб! <br>";
                }
                //Создаем массив имени и временного имени загружаемых файлов
                $out_files[] = array("name" => $_FILES['userfile']['name'][$key], "tmp_name" => $_FILES['userfile']['tmp_name'][$key]);
            } else {
                $validate = 'error';
                $resultMessage .= "Произошла ошибка при загрузке файла на сервер! <br>";
            }
        }
    } else {
        $validate = 'error';
        $resultMessage .= "Произошла ошибка! Количество файлов не может быть больше - " . MAX_FILE_COUNT . "! <br>";
    }
} 

//Если проверка не пройдена, возвращаем результат проверки и останавливаем скрипт
if ($validate == 'error') {
    sendError($resultMessage);
}

//Отправка сообщения

try {
    $msg = "ok";

    // Настройки SMTP
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 0;
    $mail->Encoding = 'base64';
    $mail->isHTML(true);

    //Обход проверки CA сертификата отключить на реальном хостинге
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    
    $mail->Host       = MAIL_SMTP_HOST; // SMTP сервера GMAIL
    $mail->Username   = MAIL_SMTP_USERNAME; // Логин на почте
    $mail->Password   = MAIL_SMTP_PASSWORD; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = MAIL_SMTP_PORT;
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME); // Адрес самой почты и имя отправителя

    // Получатель письма
    foreach (MAIL_ADDRESS as $adress) {
        $mail->addAddress($adress);
    }

    // Прикрепление файлов к письму c сохранением на сервере
    // if (!empty($_FILES['userfile']['name'][0])) {
    //     for ($ct = 0; $ct < count($_FILES['userfile']['tmp_name']); $ct++) {
    //         $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['userfile']['name'][$ct]));
    //         $filename = $_FILES['userfile']['name'][$ct];
    //         if (move_uploaded_file($_FILES['userfile']['tmp_name'][$ct], $uploadfile)) {
    //             $mail->addAttachment($uploadfile, $filename);
    //         } else {
    //             $msg .= 'Неудалось прикрепить файл ' . $uploadfile;
    //         }
    //     }
    // }

    //Прикрепляем файлы к письму

    foreach ($out_files as $k => $v) {
        $mail->AddAttachment($out_files[$k]['tmp_name'], $out_files[$k]['name']);
    }

    // -----------------------
    // Само письмо
    // -----------------------
    $mail->Subject = MAIL_SUBJECT;
    $mail->Body    = "<b>Имя:</b> $name <br>
        <b>Почта:</b> $email<br>
        <b>Телефон:</b> $phone<br><br>
        <b>Тема:</b> $theme<br>
        <b>Сообщение:</b><br>$text";
    $mail->AltBody    = "Имя: $name ,
        Почта: $email ,
        Телефон: $phone ,
        Тема: $theme ,
        Сообщение:$text";

    $site = MAIL_FROM_HOST;

    // Проверяем отравленность сообщения
    if ($mail->send()) {
        echo "$msg";
        //Чистим переменные перед отправкой подтверждения о доставке отравителю
        $mail->ClearAddresses();
        $mail->ClearAttachments();
        $mail->IsHTML(false);
        $mail->Subject = MAIL_SUBJECT;
        $mail->Body    = "Добрый день, $name ! <br>
        Вы оставили обращение на сайте <a href=\"$site\"><b>" . MAIL_FROM_SITE . "</b></a> <br>
        Спасибо за проявленный интерес к нашему сайту.<br>
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: <b>$email</b>,<br>
        или перезвоним по номеру телефона: <b>$phone</b> <br><br>
        С уважением, " . MAIL_FROM_NAME;
        $mail->IsHTML(true);
        $mail->AltBody = "Привет, $name !
        Вы оставили сообщение на сайте " . MAIL_FROM_SITE . "
        Спасибо за проявленный интерес к нашему сайту.
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: $email ,
        или по перезвоним по номеру телефона: $phone
        С уважением, " . MAIL_FROM_NAME;
        $mail->addAddress($email);
        $mail->send();
    } else {
        header('HTTP/1.0 403 Forbidden');
        echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }
} catch (Exception $e) {
    header('HTTP/1.0 403 Forbidden');
    echo "Сообщение не было отправлено. Описание ошибки: {$mail->ErrorInfo}";
}
