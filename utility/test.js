import { isNonNegavtive, ausPhoneNumberCheck, emailCheck } from "./validator.js";

console.log(isNonNegavtive(-14));
console.log(isNonNegavtive(0));
console.log(isNonNegavtive(14));

console.log(ausPhoneNumberCheck('0429726678'));

console.log(emailCheck('thanhkhiet1803@gmail.com'));
console.log(emailCheck('asjbdjka.gmail.com'));