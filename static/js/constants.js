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
  btnCloseAlert = document.querySelector('.alert-block'),
  captcha = form.querySelector('.refresh-captcha');

//PARAMETERS
const invalidFeedbackVisible = 'd-block',
  labelUp = 'label-custom-up',
  alertUp = 'd-block',
  btnSubmitAttr = 'disabled',
  btnSubmitClass = 'btn-secondary';

const regexPhone = /^[8|7]{1}[0-9]{10}$/,
  regexEmail = /^([\w-]+\.)*[\w-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,6}$/,
  regexInput = /[А-Яа-я\w]/;

const maxFileSize = 2, // максимальный размер файла (в Mb)
  maxFileCount = 5, //максимальное количество файлов
  allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt']; // разрешённые расширения файлов