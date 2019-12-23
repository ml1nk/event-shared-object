const expect = require('chai').expect;
const path = require('path');
const eso = require(path.resolve(__dirname, "..", "index.js"));
const h = require("./helper.js");

describe('base', ()=>{
 
    it('init', async () => {
        const socket = h.socket();
        const master = eso.master("channel1", socket.s0.emit, { "test" : 42});

        master.register(socket.s0);
        master.register(socket.s0); // unique test

        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        await h.timeout(10);

        expect(slave.obj.test).equal(42);
    });

    it('load', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        await h.timeout(10);

        await slave.load({ "test" : 43});

        expect(slave.obj.test).equal(43);

        await slave.load({ "test" : 44});

        expect(slave.obj.test).equal(44);
    });

    it('write', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        await h.timeout(10);

        await slave.write("test", 43);

        expect(slave.obj.test).equal(43);

        await slave.write("test", 44);

        expect(slave.obj.test).equal(44);
    });

    it('unregister', async () => {
        const socket = h.socket();
        const master = eso.master("channel1", socket.s0.emit, { "test" : 42});
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);
        master.register(socket.s0);
        
        await h.timeout(10);

        await slave.write("test", 43);

        expect(slave.obj.test).equal(43);
        master.unregister(socket.s0);
        master.unregister(socket.s0); // unique test

        slave.write("test", 44);
        await h.timeout(10);

        expect(slave.obj.test).equal(43);
    });

    it('dispose-master', async () => {
        const socket = h.socket();
        const master = eso.master("channel1", socket.s0.emit, { "test" : 42});
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);
        master.register(socket.s0);
        
        await h.timeout(10);

        await slave.write("test", 43);

        expect(slave.obj.test).equal(43);
        master.dispose();

        slave.write("test", 44);
        await h.timeout(10);

        expect(slave.obj.test).equal(43);
    });

    it('dispose-slave', async () => {
        const socket = h.socket();
        const master = eso.master("channel1", socket.s0.emit, { "test" : 42});
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);
        master.register(socket.s0);
        
        await h.timeout(10);

        slave.dispose();
        slave.write("test", 44);

        await h.timeout(10);

        expect(slave.obj.test).equal(42);
    });
    
    it('reinit', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0);

        let i=0;
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);
        slave.register((key, last, current)=>{
            switch(i) {
                case 0:
                    expect(key).equal("test");
                    expect(last).equal(undefined);
                    expect(current).equal(42);
                break;
                case 1:
                    expect(key).equal("test");
                    expect(last).equal(42);
                    expect(current).equal(42);
                break;
            }
            i++;
        });

        await h.timeout(10);

        socket.s0.emit("channel1", {
            op : "w", // master write
            rev : 5, 
            key : "test",
            value : -42
        });

        await h.timeout(10);

        expect(slave.obj.test).equal(42);
        expect(i).equal(2);

    });

    it('rev-1', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        socket.s0.emit("channel1", {
            op : "w", // master write
            rev : 0, 
            key : "test",
            value : -42
        });

        await h.timeout(10);

        expect(slave.obj.test).equal(42);
    });

    it('remove', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        await h.timeout(10);

        expect(
            Object.prototype.hasOwnProperty.call(slave.obj, "test")
        ).to.be.true;

        await slave.remove("test");


        expect(
            Object.prototype.hasOwnProperty.call(slave.obj, "test")
        ).to.be.false;

        await slave.write("test", 44);

        expect(slave.obj.test).equal(44);
    });


    it('rev', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42, "testB": 43 }).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        await h.timeout(10);

        slave.remove("test");
        await slave.remove("testB");

        expect(slave.obj.test).equal(undefined);
        expect(slave.obj.testB).equal(43);

    });

    it('return', async () => {
        const socket = h.socket();
        eso.master("channel1", socket.s0.emit, { "test" : 42 }).register(socket.s0);
        const slave = eso.slave("channel1", socket.s1, socket.s1.emit);

        expect(await slave.load({ "testC" : 22})).to.be.false;
        expect(await slave.remove("test")).to.be.false;
        expect(await slave.write("test")).to.be.false;

        await h.timeout(10);

        expect(await slave.load({ "testC" : 22})).to.be.true;
        expect(slave.obj.test).equal(undefined);
        expect(slave.obj.testC).equal(22);
        expect(await slave.remove("testC")).to.be.true;
        expect(slave.obj.testC).equal(undefined);
        expect(await slave.write("test",23)).to.be.true;
        expect(slave.obj.test).equal(23);
    });

});