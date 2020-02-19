//DOM
// const container = document.querySelector('.container'),
const checkBox = document.querySelector('input[type="checkbox"]'),
  btnFile = document.getElementById('customFile'),  
  alertSuccess = document.getElementById('alert-success'),
  alertDanger = document.getElementById('alert-danger'),
  alertDangerSpan = alertDanger.querySelector('.alert-danger-span'),
  alertSpinner = document.getElementById('alert-spinner'),
  btnCloseAlert = document.querySelector('.alert-block'),
  files = document.getElementById('files'),
  form = document.querySelector('.form'),
  captcha = form.querySelector('.refresh-captcha'),
  formControls = form.querySelectorAll('.form-control'),
  btnSubmit = form.querySelector('input[type="submit"]'),
  templateFilesItem = form.querySelector('#template-files-item').content,
  blockFile = form.querySelector('.custom-file'),
  countFileError = blockFile.querySelector('div.invalid-feedback'),
  btnFileValue = blockFile.querySelector('.js-fileName'),
  labelBtnFile = blockFile.querySelector('.js-labelFile');


//PARAMETERS
const maxFileSize = 2097152, // максимальный размер файла (в байтах)
  maxFileCount = 5, //максимальное количество файлов
  allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'rtf']; // разрешённые расширения файлов

const invalidFeedbackVisible = 'd-block',
  labelUp = 'label-custom-up',
  alertUp = 'd-block',
  btnSubmitAttr = 'disabled',
  btnSubmitClass = 'btn-secondary',
  fileItemError = 'file-item-error',
  fileDrop = 'file-drop',
  defaultFileValue = `Загрузить файл (не более ${maxFileCount}шт и до ${maxFileSize / 1024 / 1024}Мб)`;
  

const regexPhone = /^[8|7]{1}[0-9]{10}$/,
  regexEmail = /^([\w-]+\.)*[\w-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,6}$/,
  regexInput = /[А-Яа-я\w]/;
