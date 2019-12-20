//DOM
const container = document.querySelector('.container');
const checkBox = document.querySelector('input[type="checkbox"]')
const alertSuccess = document.querySelector('.alert');
const formControls = document.querySelectorAll('.form-control');
const btnSubmit = document.querySelector('input[type="submit"]');
const btnFile = document.querySelector('input[type="file"]');
const form = document.querySelector('.form');

const inputName = document.getElementById('inputName');
const inputEmail = document.getElementById('inputEmail');
const inputAccount = document.getElementById('inputAccount');
const select = document.getElementById('select');
const message = document.getElementById('message');

/* const labelName = document.querySelector('label[for="inputName"]');
const labelEmail = document.querySelector('label[for="inputEmail"]');
const labelAccount = document.querySelector('label[for="inputAccount"]');
const labelSelect = document.querySelector('label[for="select"]');
const labelMessage = document.querySelector('label[for="message"]'); */

//PARAMETERS
const invalidFeedbackVisible = 'd-block';
const alertSuccessUnvisible = 'd-none';
const labelUp = 'label-custom-up';

const regexAccount = /^\d{5,}$/;
const regexEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;