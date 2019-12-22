function eso(name, evext, cb, obj) {
 
    let rev;

    // fill obj with cb
    obj = typeof cb === "object" ? cb : obj;

    // check if master
    const master = typeof obj === "object";

    evext.on(name, (data, cb) => {
        if(master) {
            if(data.op == "i") {
                cb(rev, obj);
                return;
            }
            if(data.rev != rev)
                return;
        } else {
            if(rev == -1) 
                return; // init pending
            if(rev+1 != data.rev) {
                _init(); // reinit
                return 
            }
        }
        rev++;

        switch(data.op) {
            case "l": // load
                _load(data);
                if(master) {
                    evext.emit(name, {
                        op : "l",
                        rev : rev, 
                        obj : data.obj
                    });
                }
                break;
            case "w": // write
                _write(data);
                if(master) {
                    evext.emit(name, {
                        op : "w",
                        rev : rev, 
                        key : data.key,
                        value : data.value
                    });
                }
                break;
            case "r": // remove
                _remove(data);
                if(master) {
                    evext.emit(name, {
                        op : "r",
                        rev : rev, 
                        key : data.key
                    });
                }
                break;
        }
    });

    if(master)
        rev = 0;
    else
        _init();
        
    
    // slave function, call for data
    function _init() {
        rev = -1;
        obj = {};
        evext.emit(name,{
            op : "i"
        }, (r, o) => {
            rev = r;
            _load({obj:o});
        });
    }

    function _write(data) {
        if(typeof cb === "function")
            cb(data.key, obj[data.key], data.value);
        obj[data.key] = data.value;
    }

    function _remove(data) {
        if(typeof cb === "function")
            cb(data.key, obj[data.key]);
        delete obj[data.key];
    }

    function _load(data) {
        if(typeof cb === "function") {
            for (let key in obj) {
                if(Object.prototype.hasOwnProperty.call(data.obj, key))
                    continue;
                cb(key, obj[key]);
            }
            for (let key in data.obj) {
                cb(key, obj[key], data.obj[key]);
            }
        }
        obj = data.obj;
    }

    function write(key, value) {
        evext.emit(name,{
            op : "w", // write
            rev : rev,
            key : key,
            value : value
        });
    }

    function remove(key) {
        evext.emit(name,{
            op : "r", // remove
            rev : rev,
            key : key
        });
    }

    function load(obj) {
        evext.emit(name,{
            op : "l", // load
            rev : rev,
            obj : obj
        });
    }

    return {
        write : write,
        remove : remove,
        obj : () => obj,
        load : load
    }
}

module.exports = eso;