let str1 = 
`
..o..o.o.o
...o.o.o.o
oo.o.o.o.o
.o.o.o.o.o
`

let str2 = 
`
..o..o.o.
...o.o.o.
oo.o.o.o.
.o.o.o.o.
`

let str3 = 
`
..o..o.o
...o.o.o
oo.o.o.o
.o.o.o.o
`

// console.log(str.split('\n').slice(1,-1));
function convertPattern(str) {
    let patterns = str.split('\n').slice(1,-1)
    let patternArr=[]
    for (let pattern of patterns) {
        patternArr.push(pattern.split('').map(dot=>dot==='.'?0:1));
    }
    return patternArr
}


let pattern1 = convertPattern(str1)
let pattern2 = convertPattern(str2)
let pattern3 = convertPattern(str3)

console.log(pattern1);
console.log(pattern2);
console.log(pattern3);
