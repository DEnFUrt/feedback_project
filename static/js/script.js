(function () {

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

  btnSubmit.addEventListener('click', (e) => {
    event.preventDefault();
    
    let form_data = $(form).serialize();
    $.ajax({
      type: "POST",
      url: "send.php",
      data: form_data,
      beforeSend: function() {
        setOnClass(alertSpinner, alertUp);
      },
      complete: function() {
        setOffClass(alertSpinner, alertUp);
      },
      success: function () {
        setOnClass(alertSuccess, alertUp);
        offAlert(alertSuccess);
        formReset();
      },
      error: function(data) {
        if (data.responseText !== '') {
          const alertDangerSpan = alertDanger.querySelector('.alert-danger-span');
          alertDangerSpan.textContent = data.responseText;
        }
        setOnClass(alertDanger, alertUp);
        offAlert(alertDanger);
      }
    });
  });

  btnFile.addEventListener('change', (e) => {
    labelBtnText(e.currentTarget);
  });

  btnCloseAlert.addEventListener('click', handlerAlert);

  // function 

  function handlerAlert(e) {
    const target = e.target;
    if (target.classList.contains('alert-close')) {
      const targetAlert = e.currentTarget.querySelector(`#${target.dataset.alert}`);
      setOffClass(targetAlert, alertUp);
    }
  }

  function focusBind(formControl) {
    formControl.addEventListener('focus', (e) => {
      if (checkValue(e.currentTarget.value)) {
        setOnClass(e.currentTarget.previousElementSibling, labelUp);
      }
    });
  }

  function blurBind(formControl) {
    formControl.addEventListener('blur', (e) => {
      if (checkValue(e.currentTarget.value)) {
        setOffClass(e.currentTarget.previousElementSibling, labelUp);
      }
    });
  }

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

  function setOnAttr(elementTarget, nameAttr) {
    if (!elementTarget.hasAttribute(nameAttr)) {
      elementTarget.setAttribute(nameAttr, true);
    }
  }

  function setOffArrt(elementTarget, nameAttr) {
    if (elementTarget.hasAttribute(nameAttr)) {
      elementTarget.removeAttribute(nameAttr);
    }
  }

  function labelBtnText(elementTarget, clearFile) {
    if (clearFile) {
      elementTarget.nextElementSibling.textContent = 'Загрузить файл';
      return;
    }
    if (elementTarget.files.length === 0) {
      elementTarget.nextElementSibling.textContent = 'Файл не выбран';
    } else {
      elementTarget.nextElementSibling.textContent = Array.from(elementTarget.files, ({name}) => name);
    }
  }

  function controlSuccess () {
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

  function formReset() {
    //возвращаем Label на место
    form.reset();
    for(let formControl of formControls) {
      setOffClass(formControl.previousElementSibling, labelUp);
    }
    setOnAttr(e.currentTarget, btnSubmitAttr);
    setOnClass(e.currentTarget, btnSubmitClass);
    labelBtnText(btnFile, true);
  }

  function offAlert(targetAlert) {
    setTimeout(() => {
      setOffClass(targetAlert, alertUp);
    }, 10000);
  } 

})();
