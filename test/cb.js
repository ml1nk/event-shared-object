const expect = require('chai').expect;
const path = require('path');
const eso = require(path.resolve(__dirname, "..", "index.js"));
const h = require("./helper.js");

describe('cb', ()=>{

    it('init', async () => {
        const socket = h.socket();

        let i = 0;

        eso.master("channel1", socket.s0.emit, { "test" : 42}).register(socket.s0.on);
        const slave = eso.slave("channel1", socket.s1.on, socket.s1.emit, (key, last, current)=>{
            switch(i) {
                case 0:
                    expect(key).equal("test");
                    expect(last).equal(undefined);
                    expect(current).equal(42);
                break;
                case 1:
                    expect(key).equal("test");
                    expect(last).equal(42);
                    expect(current).equal(44);
                break;
                case 2:
                    expect(key).equal("testA");
                    expect(last).equal(undefined);
                    expect(current).equal(46);
                break;
                case 3:
                    expect(key).equal("test");
                    expect(last).equal(44);
                    expect(current).equal(46);
                break;
                case 4:
                    expect(key).equal("testB");
                    expect(last).equal(undefined);
                    expect(current).equal(47);
                break;
                case 5:
                    expect(key).equal("testB");
                    expect(last).equal(47);
                    expect(current).equal(undefined);
                break;
                case 6:
                    expect(key).equal("testB");
                    expect(last).equal(undefined);
                    expect(current).equal(48);
                break;
                case 7:
                    expect(key).equal("test");
                    expect(last).equal(46);
                    expect(current).equal(undefined);
                break;
                case 8:
                    expect(key).equal("testA");
                    expect(last).equal(46);
                    expect(current).equal(undefined);
                break;
                case 9:
                    expect(key).equal("testB");
                    expect(last).equal(48);
                    expect(current).equal(50);
                break;
            }
            i++;
        });

        await h.timeout(5);

        await slave.write("test", 44);
        await slave.write("testA", 46);
        await slave.write("test", 46);
        await slave.write("testB", 47);
        await slave.remove("testB");
        await slave.write("testB", 48);
        await slave.load({ "testB": 50 });

        expect(i).equal(10);

    });

});