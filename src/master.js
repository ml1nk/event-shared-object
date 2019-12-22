const s = require("./shared.js");

function master(name, emit, obj, cb) {

    let rev = 0;

    function _on(data, _cb) {
        if (data.op == "i") {
            _cb(rev, obj);
            return;
        }
        if (data.rev != rev) {
            _cb(false);
            return;
        }

        rev++;

        switch (data.op) {
            case "l": // load
                s._load(obj, data, cb);
                emit(name, {
                    op: "l",
                    rev: rev,
                    obj: data.obj
                });
                break;
            case "w": // write
                s._write(obj, data, cb);
                emit(name, {
                    op: "w",
                    rev: rev,
                    key: data.key,
                    value: data.value
                });
                break;
            case "r": // remove
                s._remove(obj, data, cb);
                emit(name, {
                    op: "r",
                    rev: rev,
                    key: data.key
                });
                break;
        }
        _cb(true);
    }

    return {
        register: (on)=>on(name, _on)
    }
}

module.exports = master;