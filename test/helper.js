const eventemitter3 = require("eventemitter3")

function _replace(s, emit) {
    s.emit = (a, b, c) => {
        let d = c;
        if(typeof c === "function")
            d = (a, b) => {
                return c(a,JSON.parse(JSON.stringify(b)));
            }
        b = JSON.parse(JSON.stringify(b));
        setTimeout(()=>emit(a, b, d), 1);
    }
}

exports.timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.socket = ()=>{
    let s0 = new eventemitter3();
    let s1 = new eventemitter3();

    let s0emit = s0.emit.bind(s0);
    let s1emit = s1.emit.bind(s1);

    _replace(s0, s1emit);
    _replace(s1, s0emit);

    return {
        s0 : s0,
        s1 : s1
    }
}