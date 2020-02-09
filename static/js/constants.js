//DOM
// const container = document.querySelector('.container'),
const checkBox = document.querySelector('input[type="checkbox"]'),
  formControls = document.querySelectorAll('.form-control'),
  btnSubmit = document.querySelector('input[type="submit"]'),
  btnFile = document.getElementById('customFile'),
  form = document.querySelector('.form'),
  alertSuccess = document.getElementById('alert-success'),
  alertDanger = document.getElementById('alert-danger'),
  alertSpinner = document.getElementById('alert-spinner'),
  btnCloseAlert = document.querySelector('.alert-block');

//PARAMETERS
const invalidFeedbackVisible = 'd-block',
  labelUp = 'label-custom-up',
  alertUp = 'd-block';
btnSubmitAttr = 'disabled',
  btnSubmitClass = 'btn-secondary';

const regexPhone = /^[0-9]{5,11}$/,
  regexEmail = /^([\w-]+\.)*[\w-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,6}$/,
  regexInput = /[А-Яа-я\w]/;