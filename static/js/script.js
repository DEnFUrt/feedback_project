(function () {

  let listFiles = [];

  // создаем экземпляр наблюдателя
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      switch (mutation.type) {
        case 'attributes':
          mutation.target.classList.contains(fileDrop) ?
            btnFileValue.innerHTML = 'Брось файлы здесь.' :
            btnFileValue.innerHTML = defaultFileValue;
          break;
        default:
          break;
      }
    });
  });

  // настраиваем наблюдатель
  const observerConfig = {
    attributes: true,
  }

  // передаем элемент и настройки в наблюдатель
  //отслеживаем появление класса file-drop у кнопки загрузки файлов
  observer.observe(labelBtnFile, observerConfig);

  for (let formControl of formControls) {
    focusBind(formControl);
    blurBind(formControl);
    inputBind(formControl);
  }

  // Enable BtnSubmit
  form.addEventListener('input', () => {
    if (controlSuccess()) {
      setOffArrt(btnSubmit, btnSubmitAttr);
      setOffClass(btnSubmit, btnSubmitClass);
    } else {
      setOnAttr(btnSubmit, btnSubmitAttr);
      setOnClass(btnSubmit, btnSubmitClass);
    }
  });

  //Блок эвентов перетащи и брось файлы
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    setOnClass(labelBtnFile, fileDrop);
  });

  document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    setOffClass(labelBtnFile, fileDrop);
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    setOffClass(labelBtnFile, fileDrop);
  });

  labelBtnFile.addEventListener('drop', (e) => {
    e.preventDefault();
    setOffClass(labelBtnFile, fileDrop);
    if (e.dataTransfer.files.length !== 0) {
      loadFileForm(e.dataTransfer.files);
      eventInput(form);
    }
  });

  //добавляем файл по кнопке 
  btnFile.addEventListener('change', () => {
    if (btnFile.files.length !== 0) {
      loadFileForm(btnFile.files);
      btnFile.value = '';
      eventInput(form);
    }
  });

  //Удаляем загруженный файл
  files.addEventListener('click', deleteFile);

  //Обновлем капчу
  btnCaptcha.addEventListener('click', (e) => {
    e.preventDefault();
    refreshCaptcha();
  });

  //Закрываем алерт
  btnCloseAlert.addEventListener('click', handlerAlert);

  //Отправка формы
  btnSubmit.addEventListener('click', (e) => {
    const currentTarget = e.currentTarget;
    e.preventDefault();

    let form_data = new FormData(form);

    if (listFiles.length > 0) {
      const dataFiles = Array.from(listFiles, ({
        itemFile
      }) => itemFile);

      for (let i = 0; i < dataFiles.length; i++) {
        form_data.append('userfile[]', dataFiles[i]);
      }
    }

    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      cache: false,
      url: 'send.php',
      data: form_data,
      beforeSend: function () {
        setOnClass(alertSpinner, alertUp);
        $("#modalAlert").modal('show');
      },
      complete: function () {
        setOffClass(alertSpinner, alertUp);
      },
      success: function () {
        setOnClass(alertSuccess, alertUp);
        formReset(currentTarget);
      },
      error: function (data) {
        alertDangerSpan.innerHTML = data.responseText;
        setOnClass(alertDanger, alertUp);
      }
    });
  });

  // FUNCTION

  //Генерируем событие input
  function eventInput(elem) {
    const event = new Event('input');
    elem.dispatchEvent(event);
  }

  //Обработчик события загрузка файлов в форму
  function loadFileForm(loadFiles) {
    for (let i = 0; i < loadFiles.length; i++) {
      const file = loadFiles[i];
      //Добавляем файлы в разметку и массив listFiles 
      addItemFile(file, checkFile(file));
      //ПРоверяем количество файлов
      checkCountFile() ?
        setOnClass(countFileError, invalidFeedbackVisible) :
        setOffClass(countFileError, invalidFeedbackVisible);
    }
  }

  //Проверка расширения и размера файлов
  function checkFile(file) {
    let textError = '';
    const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

    //Проверка расширения файла
    if (!allowedExtensions.includes(fileType)) {
      textError += `Тип файла <b>${file.name}</b> не разрешён <br>`;
    }
    //Поверка размера файлов
    if (file.size > maxFileSize) {
      textError += `Размер файла <b>${file.name}</b> больше ${(maxFileSize / 1024 / 1024).toFixed(1)}Мб <br>`;
    }

    return textError;
  }

  //Добавление файлов в список и элемента на форму
  function addItemFile(file, textError) {
    const templateFileItem = templateFilesItem.cloneNode(true),
      fileConatiner = templateFileItem.querySelector('.file-conatiner'),
      fileItem = templateFileItem.querySelector('.file-item'),
      fileName = templateFileItem.querySelector('.file-name'),
      fileSize = templateFileItem.querySelector('.file-size'),
      fileError = templateFileItem.querySelector('div.invalid-feedback'),
      fileClose = templateFileItem.querySelector('.file-close'),
      fileNumber = new Date().getTime(),
      size = (file.size / 1024 / 1024).toFixed(2);
    let name = file.name;
    
    //Добавляем элемент на форму
    fileConatiner.id = `file-${fileNumber}`;
    fileClose.dataset.file = `file-${fileNumber}`;
    fileName.textContent = `${name}, `;
    fileSize.textContent = `${size}Mb`;
    fileName.style.visibility = 'hidden';
    if (textError) {
      setOnClass(fileItem, fileItemError);
      fileError.innerHTML = textError;
      setOnClass(fileError, invalidFeedbackVisible);
    }
    files.appendChild(templateFileItem);
        
    let delCountChar = 2;
    let maxWidthSpan = (fileConatiner.clientWidth / 100 * 70).toFixed(0);
    while (fileName.offsetWidth > maxWidthSpan) {
      name = name.slice(0, name.length - delCountChar);
      fileName.textContent = `${name}~, `;
      delCountChar = 1; 
    }
      fileName.style.visibility = 'visible';
      
      //Добавляем ссылку на файл в массив
    const newItemListFiles = {
      itemNumber: `file-${fileNumber}`,
      itemFile: file
    }
    listFiles = [...listFiles, newItemListFiles];
  }

  //Проверка количества файлов
  function checkCountFile() {
    if (listFiles.length > maxFileCount) {
      return true;
    } else {
      return false;
    }
  }

  // удаление файла из списка и элемента из формы
  function deleteFile(e) {
    if (e.target.classList.contains('file-close')) {
      const itemNumber = e.target.dataset.file;
      const targetFileItem = e.currentTarget.querySelector(`#${itemNumber}`);
      const indexFile = listFiles.findIndex(element => element.itemNumber === itemNumber);
      //Удаляем файл из списка
      if (indexFile !== -1) {
        listFiles.splice(indexFile, 1);
      }

      targetFileItem.remove();
      //ПРоверям количество оставшихся файлов
      checkCountFile() ?
        setOnClass(countFileError, invalidFeedbackVisible) :
        setOffClass(countFileError, invalidFeedbackVisible);
      eventInput(form);
    }
  }

  //Поднимает label при появлении фокуса на поле ввода
  function focusBind(formControl) {
    formControl.addEventListener('focus', (e) => {
      if (checkValue(e.currentTarget.value)) {
        setOnClass(e.currentTarget.previousElementSibling, labelUp);
      }
    });
  }

  //Опускаем label на место при потере фокуса на поле ввода если поле ввода осталось пустым
  function blurBind(formControl) {
    formControl.addEventListener('blur', (e) => {
      if (checkValue(e.currentTarget.value)) {
        setOffClass(e.currentTarget.previousElementSibling, labelUp);
      }
    });
  }

  //Проверяем вводимые данные по маске и если ошибка ввода проявляем div с сообщение об ошибке
  function inputBind(formControl) {
    let regexTemp;

    switch (formControl.name) {
      case 'email':
        regexTemp = regexEmail;
        break;

      case 'personalPhone':
        regexTemp = regexPhone;
        break;

      default:
        regexTemp = regexInput;
        break;
    }

    //Эвент на инпуты
    formControl.addEventListener('input', (e) => {
      checkRegExValue(e.currentTarget.value, regexTemp) ?
        setOnClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible) :
        setOffClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible);
    });
  }

  //ПРоверяем ввод в инпуты по маске
  function checkRegExValue(elementTargetValue, constRegex) {
    if (!constRegex.test(elementTargetValue)) {
      return true;
    } else {
      return false;
    }
  }

  //Функция проверки инпутов на пустоту
  function checkValue(elementTargetValue) {
    if (elementTargetValue === '') {
      return true;
    } else {
      return false;
    }
  };

  // проверяем наличие класса nameClass в элементе elementTarget формы и если класса нет, ставим его
  function setOnClass(elementTarget, nameClass) {
    if (!elementTarget.classList.contains(nameClass)) {
      elementTarget.classList.toggle(nameClass);
    }
  };

  // проверяем наличие класса nameClass в элементе elementTarget формы и если класс есть, удаляем его 
  function setOffClass(elementTarget, nameClass) {
    if (elementTarget.classList.contains(nameClass)) {
      elementTarget.classList.toggle(nameClass);
    }
  };

  // проверяем наличие атрибута nameAttr в элементе elementTarget формы и если атрибута нет, добавляем его его 
  function setOnAttr(elementTarget, nameAttr) {
    if (!elementTarget.hasAttribute(nameAttr)) {
      elementTarget.setAttribute(nameAttr, true);
    }
  }

  // проверяем наличие атрибута nameAttr в элементе elementTarget формы и если атрибут есть, удаляем его его 
  function setOffArrt(elementTarget, nameAttr) {
    if (elementTarget.hasAttribute(nameAttr)) {
      elementTarget.removeAttribute(nameAttr);
    }
  }

  //ПРоверка на валидность формы. Если валидна кнопка submit активна
  function controlSuccess() {
    const arrDivInvalidFeedbackVisible = document.querySelectorAll(`.invalid-feedback.${invalidFeedbackVisible}`);
    const formControlsValues = Array.from(formControls, ({
      value
    }) => value).filter(Boolean);

    if (!checkBox.checked ||
      formControlsValues.length !== formControls.length ||
      arrDivInvalidFeedbackVisible.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  //Ресет формы
  function formReset(currentTarget) {
    //возвращаем Label на место
    form.reset();
    for (let formControl of formControls) {
      setOffClass(formControl.previousElementSibling, labelUp);
    }
    setOnAttr(currentTarget, btnSubmitAttr);
    setOnClass(currentTarget, btnSubmitClass);
    deleteElementFiles();
    listFiles.length = 0;
    refreshCaptcha();
  }

  //Удаление элементов разметки со списком файлов
  function deleteElementFiles() {
    const elementFiles = files.querySelectorAll('.file-conatiner');

    for (let i = 0; i < elementFiles.length; i++) {
      elementFiles[i].remove();
    }
  }

  // обновление капчи
  function refreshCaptcha() {
    const captchaImg = form.querySelector('.img-captcha'),
      captchaSrc = captchaImg.dataset.src,
      captchaPrefix = captchaSrc.indexOf('?id') !== -1 ? '&rnd=' : '?rnd=',
      captchaNewSrc = captchaSrc + captchaPrefix + (new Date()).getTime();
    captchaImg.setAttribute('src', captchaNewSrc);
  }

  //Закрытие алерта при нажатии на крестик
  function handlerAlert(e) {
    let targetAlert = null;
    switch (true) {
      case (e.key === 'Escape'):
        targetAlert = e.currentTarget.querySelector('.alert-block .d-block');
        if (targetAlert !== null) { 
          setOffClass(targetAlert, alertUp);
          $('#modalAlert').modal('hide');
        }
        break;
    
      case (e.target.classList.contains('alert-close')):
        targetAlert = e.currentTarget.querySelector(`#${e.target.dataset.alert}`);
        setOffClass(targetAlert, alertUp);
        $('#modalAlert').modal('hide');
        break;
    }
  }

  $('#modalAlert').on('shown.bs.modal', function () { //функция jquery из пакета bootstrap реагирует на открытие модального окна
    document.addEventListener('keyup', handlerAlert);
  });

  $('#modalAlert').on('hidden.bs.modal', function () { //функция jquery из пакета bootstrap реагирует на закрытие модального окна
    document.removeEventListener('keyup', handlerAlert);
  });

})();