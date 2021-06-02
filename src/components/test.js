const  ffi = require('ffi-napi');
// console.log(ffi)



var lib = ffi.Library('SPdbUSBm', {
    'spGetModel': [ 'short', [ 'short' ] ]
});
const arr = [1];
const arr2 = [[1]];
console.log(arr.length);
console.log(arr[0].length);
console.log(arr2.length);
console.log(arr2[0].length);
console.log(arr2[0][0].length);
// console.log(lib.spGetModel(2));
// console.log(libm.retHello());

switch (arr2.length) {
    case 3:
        console.log(arr2[2]);
    case 2:
        console.log(arr2[1]);
    case 1:
        console.log(arr2[0]);
    default:
        break;
}