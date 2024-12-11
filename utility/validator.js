
export function isNonNegavtive (num){
    if (num <= 0){
        return false;
    } else return true
}

export function ausPhoneNumberCheck (str){
    var phoneRegEx = /^\(?(\d{2})\)?[\s-]?\d{4}[\s-]?\d{4}$/;

    if (!phoneRegEx.test(str)){return false} else return true;
}

export function emailCheck (str){
    var emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    if(!emailRegEx.test(str)){return false} else return true;
}