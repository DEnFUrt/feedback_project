//DOM
const container = document.querySelector('.container'),
  checkBox = document.querySelector('input[type="checkbox"]'),
  alertSuccess = document.querySelector('.alert'),
  formControls = document.querySelectorAll('.form-control'),
  btnSubmit = document.querySelector('input[type="submit"]'),
  btnFile = document.querySelector('input[type="file"]'),
  form = document.querySelector('.form');

//PARAMETERS
const invalidFeedbackVisible = 'd-block',
  alertSuccessUnvisible = 'd-none',
  labelUp = 'label-custom-up',
  btnSubmitAttr = 'disabled',
  btnSubmitClass = 'btn-secondary';

const regexAccount = /^\d{5,}$/,
  regexEmail = /^([\w-]+\.)*[\w-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,6}$/,
  regexInput = /[А-Яа-я\w]/;