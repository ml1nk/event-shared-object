const expect = require('chai').expect;
const path = require('path');
const eso = require(path.resolve(__dirname, "..", "index.js"));
const h = require("./helper.js");
const socket = h.socket();

describe('cb', ()=>{

    it('init', async () => {
        let i = 0;

        eso("channel1", socket.s0, { "test" : 42});
        const slave = eso("channel1", socket.s1, (key, last, current)=>{
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

        slave.write("test", 44);

        await h.timeout(5);

        slave.write("testA", 46);

        await h.timeout(5);

        slave.write("test", 46);

        await h.timeout(5);

        slave.write("testB", 47);

        await h.timeout(5);

        slave.remove("testB");

        await h.timeout(5);

        slave.write("testB", 48);

        await h.timeout(5);

        slave.load({ "testB": 50 });

        await h.timeout(5);

        expect(i).equal(10);

    });

});