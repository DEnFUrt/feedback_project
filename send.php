<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['personalPhone'];
$theme = $_POST['theme'];
$text = $_POST['message'];
$mail = new PHPMailer\PHPMailer\PHPMailer();

if (!trim($name) or
    (!filter_var(trim($email), FILTER_VALIDATE_EMAIL)) or
    (!trim($text)) or
    (!trim($phone)) or
    (!trim($theme))) {
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
    // Настройки вашей почты
    $mail->Host       = 'ssl://smtp.gmail.com'; // SMTP сервера GMAIL
    $mail->Username   = 'Shelest.ckcco@gmail.com'; // Логин на почте
    $mail->Password   = 'Ljr72vip'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('Shelest.ckcco@gmail.com', 'Поступило обращение'); // Адрес самой почты и имя отправителя

    // Получатель письма
    //$mail->addAddress('Nevrolog.pav@yandex.ru');  // Ещё один, если нужен
    $mail->addAddress('musorov@gmail.com');

    // Прикрепление файлов к письму необходимо реализовать на форме обратной связи блок для прикрепление файла
    if (!empty($_FILES['file']['name'][0])) {
        for ($ct = 0; $ct < count($_FILES['file']['tmp_name']); $ct++) {
            $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['file']['name'][$ct]));
            $filename = $_FILES['file']['name'][$ct];
            if (move_uploaded_file($_FILES['file']['tmp_name'][$ct], $uploadfile)) {
                $mail->addAttachment($uploadfile, $filename);
            } else {
                $msg .= 'Неудалось прикрепить файл ' . $uploadfile;
            }
        }
    }

    // -----------------------
    // Само письмо
    // -----------------------
    $mail->Subject = 'Обращение с сайта';
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

    // Проверяем отравленность сообщения
    if ($mail->send()) {
        echo "$msg";
        //Чистим переменные перед отправкой подтверждения о доставке отравителю
        $mail->ClearAddresses();
        $mail->ClearAttachments();
        $mail->IsHTML(false);
        $mail->Subject = 'Обратная связь сайта бла бла';
        $mail->Body    = "Добрый день, $name ! <br>
        Вы оставили обращение на сайте <a href=''><b>имя сайта</b></a> <br>
        Спасибо за проявленный интерес к нашему сайту.<br>
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: <b>$email</b>,<br>
        или перезвоним по номеру телефона: <b>$phone</b> <br><br>
        С уважением, команда сайта.";
        $mail->IsHTML(true);
        $mail->AltBody = "Привет, $name !
        Вы оставили сообщение на сайте бла бла
        Спасибо за проявленный интерес к нашему сайту.
        В ближайшее время мы с Вами свяжемся по адресу электронной почты: $email ,
        или по перезвоним по номеру телефона: $phone
        С уважением, команда сайта.";
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
