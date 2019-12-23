const s = require("./shared.js");

function slave(name, receiver, emit, cb) {

    let rev;
    let obj = {};

    receiver.on(name, _on);
    _init();

    function _on(data) {
        if (rev == -1)
            return; // init pending
        if (rev + 1 != data.rev) {
            _init(); // reinit
            return
        }
        rev++;

        switch (data.op) {
            case "l": // load
                s._load(obj, data, cb);
                break;
            case "w": // write
                s._write(obj, data, cb);
                break;
            case "r": // remove
                s._remove(obj, data, cb);
                break;
        }
    }

    function _init() {
        rev = -1;
        emit(name, {
            op: "i"
        }, (r, o) => {
            rev = r;
            s._load(obj, {
                obj: o
            }, cb);
        });
    }

    function write(key, value) {
        return new Promise((resolve)=>{
            if(rev == -1)
                resolve(false);
            emit(name, {
                op: "w", // write
                rev: rev,
                key: key,
                value: value
            },(result)=>resolve(result));
        });
    }

    function remove(key) {
        return new Promise((resolve)=>{
            if(rev == -1)
                resolve(false);
            emit(name, {
                op: "r", // remove
                rev: rev,
                key: key
            },(result)=>resolve(result));
        });
    }

    function load(obj) {
        return new Promise((resolve)=>{
            if(rev == -1)
                resolve(false);
            emit(name, {
                op: "l", // load
                rev: rev,
                obj: obj
            },(result)=>resolve(result));
        });
    }

    function dispose() {
        receiver.off(name, _on);
    }

    return {
        write: write,
        remove: remove,
        obj: obj,
        load: load,
        dispose : dispose
    }
}

module.exports = slave;