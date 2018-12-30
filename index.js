const eventemitter3 = require("eventemitter3");

class Shared {

    constructor(name, evcom, obj) {
        this._name = name;
        this._evcom = evcom;
        this._evout = new eventemitter3;
        this._obj = this._ismaster ? obj : null;
        this._rev = 0;
        this._reg = [{}];
        typeof obj === "object" ? this._master() : this._slave();
    }

    on(pos, cb) {
        pos.reduce((o, i) => {
            if(!o[0].hasOwnProperty(i)) {
                o[0][i] = [{}];
            }
            return o[0][i]; 
        }, this._reg).push(cb);
    }

    off(pos, cb) {
        let path = [];
        let cur = this._reg;

        for(let i=0; i<pos.length; i++) {
            if(!cur[0].hasOwnProperty(pos[i])) return false;
            path.push(cur);
            cur = cur[0][pos[i]];
        }

        for(let i=1; i<cur.length;i++) {
            if(cur[i] !== cb) continue;
            if(cur.length>2 || Object.keys(cur[0]).length>0 || path.length===0) {
                cur.splice(i, 1);
            } else {
                let p = path.length-2;
                for(; p>=0;p--) {
                    if(path[p].length>2 || Object.keys(path[p][0].length>0)) break;
                }
                delete path[p][0][pos[p]];
            }
            return true;
        }
        return false;
    }

    _slave() {

    }

    _master() {
        evcom.on(name, (rev, set, pos, data, cb) => {
            if (rev !== this.rev) {
                cb(false);
                return;
            }
            _emit(obj, set, pos, data)
            _apply(obj, set, pos, data);
            cb(true);
        });
    }
}

function _emit(obj, set, pos, data) {
    let pre = pos.slice(0, -1).reduce((o, i) => o[i], obj);

}

function _apply(obj, set, pos, data) {
    let pre = pos.slice(0, -1).reduce((o, i) => o[i], obj);
    set ? pre[pos[pos.length-1]] = data : delete pre[pos[pos.length-1]];
}


exports._apply = _apply;
exports.Shared = Shared;