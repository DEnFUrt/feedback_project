<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

//
//json_decode($_POST);
//

// обработка только ajax запросов (при других запросах завершаем выполнение скрипта)
if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    header('HTTP/1.0 403 Forbidden');
    echo "Сообщение не было отправлено. Сервер принимает только AJAX запрос";
    exit();
}

// обработка данных, посланных только методом POST (при остальных методах завершаем выполнение скрипта)
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header('HTTP/1.0 403 Forbidden');
    echo "Сообщение не было отправлено. Сервер принимает только метод POST";
    exit();
}

const
    //UPLOAD_NAME = 'uploads', // имя директории для загрузки файлов
    MAX_FILE_SIZE = 10240, // максимальный размер файла (в байтах)
    ALLOWED_EXTENSIONS = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'), // разрешённые расширения файлов
    MAIL_FROM = 'Shelest.ckcco@gmail.com', // от какого email будет отправляться письмо
    MAIL_FROM_NAME = 'Cайт СК ССО Шелест', // от какого имени будет отправляться письмо
    MAIL_FROM_SITE = 'ск-шелест72.рф',
    MAIL_FROM_HOST = 'http://ск-шелест72.рф',
    MAIL_SUBJECT = 'Сообщение с формы обратной связи', // тема письма
    MAIL_ADDRESS =  array('musorov@gmail.com'), // кому необходимо отправить письмо, адреса необходимо перечислять через запятую
    MAIL_SMTP_HOST = 'ssl://smtp.gmail.com', // SMTP-хост
    MAIL_SMTP_PORT = '465', // SMTP-порт
    MAIL_SMTP_USERNAME = 'Shelest.ckcco@gmail.com', // SMTP-пользователь
    MAIL_SMTP_PASSWORD = 'Ljr72vip'; // SMTP-пароль
//$uploadPath = dirname(dirname(__FILE__)) . '/' . UPLOAD_NAME . '/'; // директория для хранения загруженных файлов
//$startPath = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . '/';


// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['personalPhone'];
$theme = $_POST['theme'];
$text = $_POST['message'];
$mail = new PHPMailer\PHPMailer\PHPMailer();

if (
    !trim($name) or
    (!filter_var(trim($email), FILTER_VALIDATE_EMAIL)) or
    (!trim($text)) or
    (!trim($phone)) or
    (!trim($theme))
) {
    header('HTTP/1.0 403 Forbidden');
    echo "Сообщение не было отправлено. Проверьте заполнение полей и адрес вашей почты";
    exit();
}

try {
    $msg = "ok";

    // Настройки SMTP
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    $mail->SMTPDebug = 3;
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
    /* 
    // Настройки вашей почты
    $mail->Host       = 'ssl://smtp.gmail.com'; // SMTP сервера GMAIL
    $mail->Username   = 'Shelest.ckcco@gmail.com'; // Логин на почте
    $mail->Password   = 'Ljr72vip'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('Shelest.ckcco@gmail.com', 'Поступило обращение'); // Адрес самой почты и имя отправителя

    // Получатель письма
    //$mail->addAddress('name@yandex.ru');  // Ещё один, если нужен
    $mail->addAddress('musorov@gmail.com');
    */
    
    $mail->Host       = MAIL_SMTP_HOST; // SMTP сервера GMAIL
    $mail->Username   = MAIL_SMTP_USERNAME; // Логин на почте
    $mail->Password   = MAIL_SMTP_PASSWORD; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = MAIL_SMTP_PORT;
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME); // Адрес самой почты и имя отправителя

    // Получатель письма
    //$mail->addAddress('name@yandex.ru');  // Ещё один, если нужен
    foreach (MAIL_ADDRESS as $adress) {
        $mail->addAddress($adress);
    }

    // Прикрепление файлов к письму необходимо реализовать на форме обратной связи блок для прикрепление файла

    //file_put_contents("file.txt", $_FILES['userfile']['name'], FILE_APPEND);

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

    //Attach multiple files one by one
    // for ($ct = 0; $ct < count($_FILES['userfile']['tmp_name']); $ct++) {
    //     $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['userfile']['name'][$ct]));
    //     $filename = $_FILES['userfile']['name'][$ct];
    //     if (move_uploaded_file($_FILES['userfile']['tmp_name'][$ct], $uploadfile)) {
    //         $mail->addAttachment($uploadfile, $filename);
    //     } else {
    //         $msg .= 'Failed to move file to ' . $uploadfile;
    //     }
    // }



    if (!empty($_FILES['userfile']['name'][0])) {
        foreach ($_FILES['userfile']['name'] as $key => $value) {
            $out_files[] = array("name" => $_FILES['userfile']['name'][$key], "tmp_name" => $_FILES['userfile']['tmp_name'][$key]);
        }
        $filesSend = true;
    } else {
        $filesSend = false;
    }
    if ($filesSend) {
        foreach ($out_files as $k => $v) {
            $mail->AddAttachment($out_files[$k]['tmp_name'], $out_files[$k]['name']);
        }
    }

    //$mail->addAttachment($_FILES["userfile"]["tmp_name"],$_FILES["userfile"]["name"]);    

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
        Вы оставили обращение на сайте <a href=$site><b>".MAIL_FROM_SITE."</b></a> <br>
        Спасибо за проявленный интерес к нашему сайту.<br>
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: <b>$email</b>,<br>
        или перезвоним по номеру телефона: <b>$phone</b> <br><br>
        С уважением, ".MAIL_FROM_NAME;
        $mail->IsHTML(true);
        $mail->AltBody = "Привет, $name !
        Вы оставили сообщение на сайте ".MAIL_FROM_SITE."
        Спасибо за проявленный интерес к нашему сайту.
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: $email ,
        или по перезвоним по номеру телефона: $phone
        С уважением, ".MAIL_FROM_NAME;
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
