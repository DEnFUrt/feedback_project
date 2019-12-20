(function() {

  for(let i = 0; i < formControls.length; i++) {
    formControlBind(formControls[i]);
  }

  function formControlBind(formControl) {
    switch (formControl.nodeName) {
      case 'INPUT':
        formControl.addEventListener('focus', (e) => {
          if (checkValue(e.currentTarget.value)) {
            setOnClass(e.currentTarget.previousElementSibling, labelUp);
          }
        });
        formControl.addEventListener('blur', (e) => {
          if (checkValue(e.currentTarget.value)) {
            setOffClass(e.currentTarget.previousElementSibling, labelUp);
          }
        });
        formControl.addEventListener('input', (e) => {
          // let targetDivInvalidFeedback = e.currentTarget.nextElementSibling;
        
          checkValue(e.currentTarget.value) ? setOnClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible) :
            setOffClass(e.currentTarget.nextElementSibling, invalidFeedbackVisible);
        });
        break;
    
      default:
        break;
    }
  }

  //name

/* inputName.addEventListener('focus', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOnClass(e.currentTarget.previousElementSibling, labelUp);
  }
});

inputName.addEventListener('blur', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOffClass(e.currentTarget.previousElementSibling, labelUp);
  }
});

inputName.addEventListener('input', (e) => {
  let targetDivInvalidFeedback = document.querySelector(`#${e.currentTarget.id} + div`);

  checkValue(e.currentTarget.value) ? setOnClass(targetDivInvalidFeedback, invalidFeedbackVisible) :
    setOffClass(targetDivInvalidFeedback, invalidFeedbackVisible);
}); */

//email

inputEmail.addEventListener('focus', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOnClass(labelEmail, labelUp);
  }
});

inputEmail.addEventListener('blur', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOffClass(labelEmail, labelUp);
  }
});

inputEmail.addEventListener('input', (e) => {
  let targetDivInvalidFeedback = document.querySelector(`#${e.currentTarget.id} + div`);

  checkRegExValue(e.currentTarget.value, regexEmail) ? setOnClass(targetDivInvalidFeedback, invalidFeedbackVisible) :
    setOffClass(targetDivInvalidFeedback, invalidFeedbackVisible);
});

// personal account

inputAccount.addEventListener('focus', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOnClass(labelAccount, labelUp);
  }
});

inputAccount.addEventListener('blur', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOffClass(labelAccount, labelUp);
  }
});

inputAccount.addEventListener('input', (e) => {
  let targetDivInvalidFeedback = document.querySelector(`#${e.currentTarget.id} + div`);

  checkRegExValue(e.currentTarget.value, regexAccount) ? setOnClass(targetDivInvalidFeedback, invalidFeedbackVisible) :
    setOffClass(targetDivInvalidFeedback, invalidFeedbackVisible);
});

// theme

select.addEventListener('focus', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOnClass(labelSelect, labelUp);
  }
});

select.addEventListener('blur', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOffClass(labelSelect, labelUp);
  }
});

//message

message.addEventListener('focus', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOnClass(labelMessage, labelUp);
  }
});

message.addEventListener('blur', (e) => {
  if (checkValue(e.currentTarget.value)) {
    setOffClass(labelMessage, labelUp);
  }
});

message.addEventListener('input', (e) => {
  let targetDivInvalidFeedback = document.querySelector(`#${e.currentTarget.id} + div`);

  checkValue(e.currentTarget.value) ? setOnClass(targetDivInvalidFeedback, invalidFeedbackVisible) :
    setOffClass(targetDivInvalidFeedback, invalidFeedbackVisible);
});

// Enable BtnSubmit

container.addEventListener('input', () => {
  let flagSuccess = true;
  let arrDivInvalidFeedbackVisible = document.querySelectorAll(`div .${invalidFeedbackVisible}`);
  let FormControlsValues = Array.from(formControls, ({value}) => value).filter(Boolean);
  
  if (!checkBox.checked ||
    FormControlsValues.length !== formControls.length ||
    arrDivInvalidFeedbackVisible.length !== 0) {
    flagSuccess = false;
  }

  if (flagSuccess) {
    if (btnSubmit.hasAttribute('disabled')) {
      btnSubmit.removeAttribute('disabled');
    }
    setOffClass(btnSubmit, 'btn-secondary');
  } else {
    if (!btnSubmit.hasAttribute('disabled')) {
      btnSubmit.setAttribute('disabled', true);
    }
    setOnClass(btnSubmit, 'btn-secondary');
  }
});

btnSubmit.addEventListener('click', () => {
  event.preventDefault();
  setOffClass(alertSuccess, alertSuccessUnvisible);
  form.reset();
  for(let i = 0; i < formControls.length; i++) {
    setOffClass(formControls[i].previousElementSibling, labelUp);
  }
  
});

// function 

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

}) ();