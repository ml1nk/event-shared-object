class Shared {

    constructor(name, evcom, evout, data) {
        this.name = name;
        this.evcom = evcom;
        this.evout = evout;
        this.master = typeof data === "object";
        this.data = master ? data : null;
        this.rev = 0;
        master ? _master() : _slave();
    }

    _slave() {

    }

    _master() {
        evcom.on(name, (rev, set, pos, data, cb) => {
            if (obj.rev !== rev) {
                cb(false);
                return;
            }


        });
    }


}

function _apply(obj, set, pos, data) {
    let pre = pos.slice(0, -1).reduce((o, i) => o[i], obj);
    set ? pre[pos.slice(-1)[0]] = data : delete pre[pos.slice(-1)[0]];
}


exports._apply = _apply;