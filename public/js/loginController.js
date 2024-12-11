/*
Login Page Controllers
*/

document.querySelector('form').addEventListener('submit', function(event){
    const passwordInput = document.getElementById('password');
    const passwordValue = passwordInput.value;

    const passError = document.getElementById('invalid-pass');

    if(passwordValue === ""){
        event.preventDefault();
        passwordInput.classList.add('is-invalid');
        passError.getAttribute('disabled') = "";
    } else {
        passwordInput.classList.remove('is-invalid');
        passError.setAttribute('disabled', 'disabled');
        }
})

document.querySelector('form').addEventListener('submit', function(event){
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();

    const emailError = document.getElementById('invalid-email');

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    if(!emailRegex.test(emailValue) || emailValue === ""){
        event.preventDefault();
        emailInput.classList.add('is-invalid');
        emailError.getAttribute('disabled') = "";
    } else {
        emailInput.classList.remove('is-invalid');
        emailError.setAttribute('disabled', 'disabled');
        }
})

document.querySelector('form').addEventListener('keypress', function(){
    const emailValue = document.getElementById('email');
    const emailError = document.getElementById('invalid-email');

    const passValue = document.getElementById('password');
    const passError = document.getElementById('invalid-pass');

    if(emailValue.value){
        emailValue.classList.remove('is-invalid');
        emailError.setAttribute('disabled', 'disabled');
    }

    if(passValue.value){
        passValue.classList.remove('is-invalid');
        passError.setAttribute('disabled', 'disabled');
    }
})
//------------ End of Login --------------