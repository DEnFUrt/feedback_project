(function () {

  let listFiles = [];

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

  //Отправка формы
  btnSubmit.addEventListener('click', (e) => {
    const currentTarget = e.currentTarget;
    e.preventDefault();

    let form_data = new FormData(form);
    
    if (listFiles.length > 0) {
      const dataFiles = Array.from(listFiles, ({itemFile}) => itemFile);
      
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
      },
      complete: function () {
        setOffClass(alertSpinner, alertUp);
      },
      success: function () {
        setOnClass(alertSuccess, alertUp);
        offAlert(alertSuccess);
        formReset(currentTarget);
      },
      error: function (data) {
        if (data.responseText !== '') {
          alertDangerSpan.innerHTML = data.responseText;
        }
        setOnClass(alertDanger, alertUp);
        offAlert(alertDanger);
      }
    });
  });

  btnFile.addEventListener('change', (e) => {
    if (btnFile.files.length !== 0) {
      for (let i = 0; i < btnFile.files.length; i++) {
        //Проверка количества файлов
        if (listFiles.length + 1 > maxFileCount) {
          alertDangerSpan.innerHTML = `Файлов не может быть больше ${maxFileCount}. 
            Остальные файлы не будут загружены.`;
          setOnClass(alertDanger, alertUp);
          offAlert(alertDanger);
          break;
        }
        
        const file = btnFile.files[i];


        // let textError = '';
        // const file = btnFile.files[i];
        // const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

        // //Проверка расширения файла
        // if (!allowedExtensions.includes(fileType)) {
        //   textError += `Тип файла <b>${file.name}</b> не разрешён <br>`;
        // }
        // //Поверка размера файлов
        // if (file.size > maxFileSize) {
        //   textError += `Размер файла <b>${file.name}</b> больше ${maxFileSize / 1024 / 1024} Мб <br>`;
        // }
        //Добавляем файлы в разметку и массив listFiles 
        addItemFile(file, checkFile(file));
      }
      
      btnFile.value = '';
    }
    //labelBtnText(e.currentTarget);
  });

  btnCloseAlert.addEventListener('click', handlerAlert);

  captcha.addEventListener('click', (e) => {
    e.preventDefault;
    refreshCaptcha();
  });

  files.addEventListener('click', deleteFile);

  // function 

  function checkFile(file) {
    let textError = '';
    const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

    //Проверка расширения файла
    if (!allowedExtensions.includes(fileType)) {
      textError += `Тип файла <b>${file.name}</b> не разрешён <br>`;
    }
    //Поверка размера файлов
    if (file.size > maxFileSize) {
      textError += `Размер файла <b>${file.name}</b> больше ${maxFileSize / 1024 / 1024} Мб <br>`;
    }

    return textError;
  }

  //Генерируем событие input
  function eventInput(elem) {
    const event = new Event('input');
    elem.dispatchEvent(event);
  }

  //Добавление файлов в список и элемента на форму
  function addItemFile(file, textError) {
    const templateFileItem = templateFilesItem.cloneNode(true),
      fileConatiner = templateFileItem.querySelector('.file-conatiner'),
      fileItem = templateFileItem.querySelector('.file-item'),
      fileName = templateFileItem.querySelector('.file-name'),
      fileError = templateFileItem.querySelector('div.invalid-feedback'),
      fileClose = templateFileItem.querySelector('.file-close'),
      fileNumber = new Date().getTime();
    //Добавляем элемент на форму
    fileConatiner.id = `file-${fileNumber}`;
    fileClose.dataset.file = `file-${fileNumber}`;
    fileName.textContent = file.name;
    if (textError) {
      setOnClass(fileItem, fileItemError);
      fileError.innerHTML = textError;
      setOnClass(fileError, invalidFeedbackVisible);
    }
    files.appendChild(templateFileItem);
    //Добавляем ссылку на файл в массив
    const newItemListFiles = {
      itemNumber: `file-${fileNumber}`,
      itemFile: file
    };
    listFiles = [...listFiles, newItemListFiles];
    eventInput(form);
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
      console.table('listFiles', listFiles);
      eventInput(form);
    }
  }

  //Закрытие алерта при нажатии на крестик
  function handlerAlert(e) {
    if (e.target.classList.contains('alert-close')) {
      const targetAlert = e.currentTarget.querySelector(`#${e.target.dataset.alert}`);
      setOffClass(targetAlert, alertUp);
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

    formControl.addEventListener('input', (e) => {
      checkRegExValue(e.currentTarget.value, regexTemp) ?
        setOnClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible) :
        setOffClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible);
    });
  }

  function checkRegExValue(elementTargetValue, constRegex) {
    if (!constRegex.test(elementTargetValue)) {
      return true;
    } else {
      return false;
    }
  }

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

  // function labelBtnText(elementTarget, clearFile) {
  //   if (clearFile) {
  //     elementTarget.nextElementSibling.textContent = 'Загрузить файл (не более 5 шт. по 2 Мб)';
  //     return;
  //   }
  //   if (elementTarget.files.length === 0) {
  //     elementTarget.nextElementSibling.textContent = 'Файл не выбран';
  //   } else {
  //     elementTarget.nextElementSibling.textContent = Array.from(elementTarget.files, ({
  //       name
  //     }) => name);
  //   }
  // }

  function controlSuccess() {
    const arrDivInvalidFeedbackVisible = document.querySelectorAll(`.invalid-feedback.${invalidFeedbackVisible}`);
    const formControlsValues = Array.from(formControls, ({value}) => value).filter(Boolean);

    if (!checkBox.checked ||
      formControlsValues.length !== formControls.length ||
      arrDivInvalidFeedbackVisible.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  function formReset(currentTarget) {
    //возвращаем Label на место
    form.reset();
    for (let formControl of formControls) {
      setOffClass(formControl.previousElementSibling, labelUp);
    }
    setOnAttr(currentTarget, btnSubmitAttr);
    setOnClass(currentTarget, btnSubmitClass);
    //labelBtnText(btnFile, true);
    deleteElementFiles();
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

  function offAlert(targetAlert) {
    setTimeout(() => {
      setOffClass(targetAlert, alertUp);
    }, 10000);
  }

})();