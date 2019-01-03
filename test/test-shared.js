const expect = require('chai').expect;
const path = require('path');
const api = require(path.resolve(__dirname, "..", "index.js"));


/**
 * Applying a change (set/del) to an object
 */
it('apply', () => {
    let obj = {
        "a": "b",
        "c": {
            "d": "e",
            "e": "f"
        }
    }

    api._apply(obj, true, ["a"], "g");

    expect(obj).to.deep.equal({
        "a": "g",
        "c": {
            "d": "e",
            "e": "f"
        }
    });

    api._apply(obj, false, ["a"]);

    expect(obj).to.deep.equal({
        "c": {
            "d": "e",
            "e": "f"
        }
    });

    api._apply(obj, false, ["c", "d"]);

    expect(obj).to.deep.equal({
        "c": {
            "e": "f"
        }
    });

    api._apply(obj, true, ["c", "e"], {
        "z": "h"
    });

    expect(obj).to.deep.equal({
        "c": {
            "e": {
                "z": "h"
            }
        }
    });
});

it('_reg', () => {
    let sh = new api.Shared();
    let a = () => {};
    let b = () => {};
    let c = () => {};
    let d = () => {};

    expect(sh._reg).to.deep.equal([{}]);

    sh.on(["a", "b"], a);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }]);

    expect(sh.off(["a", "b"], a)).to.be.true;

    expect(sh._reg).to.deep.equal([{}]);

    sh.on([], b);

    expect(sh._reg).to.deep.equal([{}, b]);

    sh.on([], c);

    expect(sh._reg).to.deep.equal([{}, b, c]);

    expect(sh.off([], b)).to.be.true;

    expect(sh._reg).to.deep.equal([{}, c]);

    expect(sh.off([], c)).to.be.true;

    expect(sh._reg).to.deep.equal([{}]);

    sh.on(["a", "b"], a);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }]);

    sh.on([], b);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }, b]);

    sh.on([], c);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }, b, c]);

    expect(sh.off([], b)).to.be.true;

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }, c]);

    expect(sh.off([], c)).to.be.true;

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a]
        }]
    }]);

    sh.on(["a", "b"], c);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, a, c]
        }]
    }]);

    expect(sh.off([], c)).to.be.false;
    expect(sh.off(["a"], c)).to.be.false;
    expect(sh.off(["a", "b", "c"], c)).to.be.false;
    expect(sh.off(["a", "c"], c)).to.be.false;
    expect(sh.off(["a", "b"], b)).to.be.false;
    expect(sh.off(["a", "b"], a)).to.be.true;
    expect(sh.off(["a", "b"], a)).to.be.false;
    expect(sh.off(["a", "b"], c)).to.be.true;
    expect(sh.off(["a", "b"], c)).to.be.false;

    expect(sh._reg).to.deep.equal([{}]);

    sh.on(["a", "b"], c);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{}, c]
        }]
    }]);

    sh.on(["a", "b", "c"], a);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{
                c: [{}, a]
            }, c]
        }]
    }]);

    sh.on(["a", "b", "d"], b);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{
                c: [{}, a],
                d: [{}, b]
            }, c]
        }]
    }]);

    sh.on(["a", "b", "d", "e"], d);

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{
                c: [{}, a],
                d: [{ e : [{}, d]}, b]
            }, c]
        }]
    }]);

    expect(sh.off(["a", "b", "c"], a)).to.be.true;

    expect(sh._reg).to.deep.equal([{
        a: [{
            b: [{
                d: [{ e : [{}, d]}, b]
            }, c]
        }]
    }]);


});