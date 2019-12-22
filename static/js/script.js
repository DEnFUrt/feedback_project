(function () {

  for (let formControl of formControls) {
        focusBind(formControl);
        blurBind(formControl);
        inputBind(formControl);
  }

  // Enable BtnSubmit

  container.addEventListener('input', () => {
    if (controlSuccess()) {
      setOffArrt(btnSubmit, btnSubmitAttr);
      setOffClass(btnSubmit, btnSubmitClass);
    } else {
      setOnAttr(btnSubmit, btnSubmitAttr);
      setOnClass(btnSubmit, btnSubmitClass);
    }
  });

  btnSubmit.addEventListener('click', (e) => {
    
    // вставить код отправки формы

    //заглушка, перегружает форму 
    event.preventDefault();
    setOffClass(alertSuccess, alertSuccessUnvisible);
    form.reset();
    
    for(let formControl of formControls) {
      setOffClass(formControl.previousElementSibling, labelUp);
    }
    setOnAttr(e.currentTarget, btnSubmitAttr);
    setOnClass(e.currentTarget, btnSubmitClass);
    labelBtnText(btnFile, true);
  });

  btnFile.addEventListener('change', (e) => {
    labelBtnText(e.currentTarget);
  });

  // function 

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

      case 'personalAccount':
        regexTemp = regexAccount;
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
    let arrDivInvalidFeedbackVisible = document.querySelectorAll(`.invalid-feedback.${invalidFeedbackVisible}`);
    let FormControlsValues = Array.from(formControls, ({value}) => value).filter(Boolean);

    if (!checkBox.checked ||
      FormControlsValues.length !== formControls.length ||
      arrDivInvalidFeedbackVisible.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

})();