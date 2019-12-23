function _write(obj, data, registered) {
    if (typeof registered !== "undefined")
        registered.forEach(cb=>cb(data.key, obj[data.key], data.value));
    obj[data.key] = data.value;
}

function _remove(obj, data, registered) {
    if (typeof registered !== "undefined")
        registered.forEach(cb=>cb(data.key, obj[data.key]));
    delete obj[data.key];
}

function _load(obj, data, registered) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(data.obj, key))
            continue;
        _remove(obj, {key: key}, registered);
    }
    for (let key in data.obj) {
        _write(obj, {key : key, value : data.obj[key]}, registered)        
    }
}

exports._write = _write;
exports._remove = _remove;
exports._load = _load;