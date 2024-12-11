/* 
Registration Page Controllers
*/
document.querySelector('form').addEventListener('submit', function(event){

    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();
    const emailError = document.getElementById('invalid-email');

    const fnameInput = document.getElementById('fname');
    const fnameValue = fnameInput.value;
    const fnameError = document.getElementById('invalid-fname')

    const lnameInput = document.getElementById('lname');
    const lnameValue = lnameInput.value.trim();
    const lnameError = document.getElementById('invalid-lname')

    const phoneNoInput = document.getElementById('phoneNo');
    const phoneNoValue = phoneNoInput.value.trim();
    const phoneNoError = document.getElementById('invalid-phone');
    const phoneRegex = /^\(?(\d{2})\)?[\s-]?\d{4}[\s-]?\d{4}$/;

    const addressInput = document.getElementById('address');
    const addressValue = addressInput.value;
    const addressError = document.getElementById('invalid-address');

    const passInput = document.getElementById('password');
    const passValue = passInput.value;
    const passError = document.getElementById('invalid-pass')

    const cfnPassInput = document.getElementById('cfn-password');
    const cfnPassValue = cfnPassInput.value;
    const cfnPassError = document.getElementById('invalid-cfn-pass');

    if(emailValue === ""){
        event.preventDefault();
        emailInput.classList.add('is-invalid');
        emailError.getAttribute('disabled') = "";
    } else {
        emailInput.classList.remove('is-invalid');
        emailError.setAttribute('disabled', 'disabled');
    }

    if(fnameValue === ""){
        event.preventDefault();
        fnameInput.classList.add('is-invalid');
        fnameError.getAttribute('disabled') = "";
    } else {
        fnameInput.classList.remove('is-invalid');
        fnameError.setAttribute('disabled', 'disabled');
    }

    if(lnameValue === ""){
        event.preventDefault();
        lnameInput.classList.add('is-invalid');
        lnameError.getAttribute('disabled') = "";
    } else {
        lnameInput.classList.remove('is-invalid');
        lnameError.setAttribute('disabled', 'disabled');
    }

    if(phoneNoValue === ""){
        event.preventDefault();
        phoneNoInput.classList.add('is-invalid');
        phoneNoError.getAttribute('disabled') = "";
    } 
    else {
        phoneNoInput.classList.remove('is-invalid');
        phoneNoError.setAttribute('disabled', 'disabled')
    }

    if(addressValue === ""){
        event.preventDefault();
        addressInput.classList.add('is-invalid');
        addressError.getAttribute('disabled') = "";
    } else {
        addressInput.classList.remove('is-invalid');
        addressError.setAttribute('disabled', 'disabled');
    }

    if(passValue === ""){
        event.preventDefault();
        passInput.classList.add('is-invalid');
        passError.getAttribute('disabled') = "";
    } else {
        passInput.classList.remove('is-invalid');
        passError.setAttribute('disabled', 'disabled');
    }

    if(cfnPassValue === ""){
        event.preventDefault();
        cfnPassInput.classList.add('is-invalid');
        cfnPassError.getAttribute('disabled') = "";
    } else {
        cfnPassInput.classList.remove('is-invalid');
        cfnPassError.setAttribute('disabled', 'disabled');
    }
})

document.querySelector('form').addEventListener('keypress', function(){
const emailValue = document.getElementById('email');
const emailError = document.getElementById('invalid-email');

const fnameValue = document.getElementById('fname');
const fnameError = document.getElementById('invalid-fname');

const lnameValue = document.getElementById('lname');
const lnameError = document.getElementById('invalid-lname');

const phoneNoValue = document.getElementById('phoneNo');
const phoneNoError = document.getElementById('invalid-phone');

const addressValue = document.getElementById('address');
const addressError = document.getElementById('invalid-address');

const passValue = document.getElementById('password');
const passError = document.getElementById('invalid-pass');

const cfnPassValue = document.getElementById('cfn-password');
const cfnPassError = document.getElementById('invalid-cfn-pass')

if(emailValue.value){
    emailValue.classList.remove('is-invalid');
    emailError.setAttribute('disabled', 'disabled');
}

if(fnameValue.value){
    fnameValue.classList.remove('is-invalid');
    fnameError.setAttribute('disabled', 'disabled');
}

if(lnameValue.value){
    lnameValue.classList.remove('is-invalid');
    lnameError.setAttribute('disabled', 'disabled');
}

if(phoneNoValue.value){
    phoneNoValue.classList.remove('is-invalid');
    phoneNoError.setAttribute('disabled', 'disabled');
}

if(addressValue.value){
    addressValue.classList.remove('is-invalid');
    addressError.setAttribute('disabled', 'disabled');
}

if(passValue.value){
    passValue.classList.remove('is-invalid');
    passError.setAttribute('disabled', 'disabled');
}

if(cfnPassValue.value){
    cfnPassValue.classList.remove('is-invalid');
    cfnPassError.setAttribute('disabled', 'disabled')
}
})
//------------ End of Registration --------------