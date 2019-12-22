function _write(obj, data, cb) {
    if (typeof cb === "function")
        cb(data.key, obj[data.key], data.value);
    obj[data.key] = data.value;
}

function _remove(obj, data, cb) {
    if (typeof cb === "function")
        cb(data.key, obj[data.key]);
    delete obj[data.key];
}

function _load(obj, data, cb) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(data.obj, key))
            continue;
        _remove(obj, {key: key}, cb);
    }
    for (let key in data.obj) {
        _write(obj, {key : key, value : data.obj[key]}, cb)        
    }
}

exports._write = _write;
exports._remove = _remove;
exports._load = _load;