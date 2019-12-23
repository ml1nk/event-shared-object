const s = require("./shared.js");

function master(name, emit, obj) {

    let rev = 0;
    let registered = [];

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
                s._load(obj, data);
                emit(name, {
                    op: "l",
                    rev: rev,
                    obj: data.obj
                });
                break;
            case "w": // write
                s._write(obj, data);
                emit(name, {
                    op: "w",
                    rev: rev,
                    key: data.key,
                    value: data.value
                });
                break;
            case "r": // remove
                s._remove(obj, data);
                emit(name, {
                    op: "r",
                    rev: rev,
                    key: data.key
                });
                break;
        }
        _cb(true);
    }

    function register(receiver) {
        if(registered.indexOf(receiver)>-1)
            return;
        receiver.on(name, _on);
        registered.push(receiver);
    }

    function unregister(receiver) {
        let i = registered.indexOf(receiver);
        if(i===-1)
            return;
        receiver.off(name, _on);
        registered.splice(i,1);
    }

    function dispose() {
        for (const receiver of registered) {
            receiver.off(name, _on);
        }
        registered = [];
    }

    return {
        register: register,
        unregister: unregister,
        dispose : dispose
    }
}

module.exports = master;