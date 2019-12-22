const expect = require('chai').expect;
const path = require('path');
const eso = require(path.resolve(__dirname, "..", "index.js"));
const h = require("./helper.js");
const socket = h.socket();

describe('base', ()=>{
 
    it('init', async () => {

        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        await h.timeout(2);

        expect(slave.obj().test).equal(42);
    });

    it('load', async () => {
        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        await h.timeout(5);

        slave.load({ "test" : 43});

        await h.timeout(5);

        expect(slave.obj().test).equal(43);

        slave.load({ "test" : 44});

        await h.timeout(5);

        expect(slave.obj().test).equal(44);
    });


    it('write', async () => {
        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        await h.timeout(5);

        slave.write("test", 43);

        await h.timeout(5);

        expect(slave.obj().test).equal(43);

        slave.write("test", 44);

        await h.timeout(5);

        expect(slave.obj().test).equal(44);
    });


    it('reinit', async () => {
        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        await h.timeout(5);

        socket.s0.emit("channel1", {
            op : "mw", // master write
            rev : 5, 
            key : "test",
            value : -42
        });

        await h.timeout(5);

        expect(slave.obj().test).equal(42);
    });

    it('rev-1', async () => {

        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        socket.s0.emit("channel1", {
            op : "mw", // master write
            rev : 0, 
            key : "test",
            value : -42
        });

        await h.timeout(5);

        expect(slave.obj().test).equal(42);
    });

    it('remove', async () => {
        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1);

        await h.timeout(5);

        expect(
            Object.prototype.hasOwnProperty.call(slave.obj(), "test")
        ).to.be.true;

        slave.remove("test");

        await h.timeout(5);

        expect(
            Object.prototype.hasOwnProperty.call(slave.obj(), "test")
        ).to.be.false;

        slave.write("test", 44);

        await h.timeout(5);

        expect(slave.obj().test).equal(44);
    });


    it('rev', async () => {
        eso("channel1", socket.s0, { "test" : 42, "testB" : 43 });
        const slave = eso("channel1", socket.s1);

        await h.timeout(5);

        slave.remove("test");
        slave.remove("testB");

        await h.timeout(5);

        expect(slave.obj().test).equal(undefined);
        expect(slave.obj().testB).equal(43);

    });

});