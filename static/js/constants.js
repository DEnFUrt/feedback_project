//DOM
const container = document.querySelector('.container');
const checkBox = document.querySelector('input[type="checkbox"]')
const alertSuccess = document.querySelector('.alert');
const formControls = document.querySelectorAll('.form-control');
const btnSubmit = document.querySelector('input[type="submit"]');
const btnFile = document.querySelector('input[type="file"]');
const form = document.querySelector('.form');

//PARAMETERS
const invalidFeedbackVisible = 'd-block';
const alertSuccessUnvisible = 'd-none';
const labelUp = 'label-custom-up';
const btnSubmitAttr = 'disabled';
const btnSubmitClass = 'btn-secondary';

const regexAccount = /^\d{5,}$/;
const regexEmail = /^([\w-]+\.)*[\w-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,6}$/;
const regexInput = /[А-Яа-я\w]/;
