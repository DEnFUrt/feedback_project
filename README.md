# Feedback /Форма обратной связи для сайта/

Модуль обратной связи с функцией отправки файлов,
с использованием PHP, Bootstrap и jQuery. 

Написана по мотивам формы 
<https://itchief.ru/php/feedback-form-for-website> (в проекте использована структура
констант в send.php и модуль капча)
В форме реализована капча, проверка формы на стороне клиента и сервера. 
Для подгрузки файлов можно использовать Drag'n'Drop.
Серверная часть тестировалась на php v.7.x 

Буду рад замечаниям и предложениям по доработке формы.

## Installation

Установка формы обратной связи на сервер осуществляется путём копирования каталога
*feedback_project* в корневую директорию сайта. 
При необходимости переименуйте каталог *feedback_project* для большего удобства.
После копирования форма будет доступна адресу http://sitename.ru/feedback_project/
или https://sitename.ru/feedback_project/ в зависимости от используемого протокола.

## Usage

Для инициализации формы выполните следующие действия:
1. В index.html настройте элемент 
    ```html
    <input type="file" class="input-file custom-file-input" id="customFile" name=""
          accept=".jpg, .jpeg, .png, .pdf, .doc*, .xls*, .txt, .rtf" multiple>
    ```
для работы с нужными вам типами файлов.

В элементе 

```html
    <!-- Согласие на обработку ПДн -->
      <div class="form-check">
        <label class="form-check-label">
          <input type="checkbox" class="form-check-input">
          Нажимая кнопку, я принимаю условия <a href="#">Пользовательского
            соглашения</a> и даю своё согласие на обработку моих персональных данных, в соответствии с
          Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных».
        </label>
      </div>
```
пропишите ссылку на пользовательское соглашение размещенное на сайте.

2. В send.php настройте константы для отправки почты (по умолчанию настроена на gmail.com, при необходимости
измените настройки ssl сервера):
```php
    const
      MAX_FILE_SIZE = 2097152, // максимальный размер файла (в байтах)
      MAX_FILE_COUNT = 5, //максимальное количество файлов
      ALLOWED_EXTENSIONS = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf'), // разрешённые расширения файлов
      MAIL_FROM = '...@gmail.com', // от какого email будет отправляться письмо
      MAIL_FROM_NAME = 'UserName', // от какого имени будет отправляться письмо
      MAIL_FROM_SITE = 'SiteName',// Сайт, используется для шаблона сообщения
      MAIL_FROM_HOST = 'url', //URL сайта, используется для шаблона сообщения о доставке
      MAIL_SUBJECT = 'Сообщение с формы обратной связи', // тема письма
      MAIL_ADDRESS =  array('...@gmail.com'), // кому необходимо отправить письмо, адреса необходимо перечислять через запятую
      MAIL_SMTP_HOST = 'ssl://smtp.gmail.com', // SMTP-хост
      MAIL_SMTP_PORT = '465', // SMTP-порт
      MAIL_SMTP_USERNAME = 'UserName@gmail.com', // SMTP-пользователь
      MAIL_SMTP_PASSWORD = 'password'; // SMTP-пароль 
```
Так же, если необходимо отредактируйте шаблоны сообщений обратной связи.

3. В файле constants.js настройте константы для проверки файлов на стороне клиента
```js
    //PARAMETERS
    const maxFileSize = 2097152, // максимальный размер файла (в байтах)
      maxFileCount = 5, //максимальное количество файлов
      allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf'];
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

v. 1.0.0

## License

MIT
