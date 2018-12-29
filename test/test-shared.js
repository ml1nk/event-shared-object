const expect = require('chai').expect;
const path = require('path');
const api = require(path.resolve(__dirname,"..","index.js"));


/**
 * Applying a change (set/del) to an object
 */
it('apply', ()=>{
    let obj = { 
        "a" : "b",
        "c" : { 
            "d" : "e",
            "e" : "f"
        }
    }
    
    api._apply(obj, true, ["a"],"g");
    
    expect(obj).to.deep.equal({
        "a" : "g",
        "c" : { 
            "d" : "e",
            "e" : "f"
        }
    });

    api._apply(obj, false, ["a"]);
    
    expect(obj).to.deep.equal({
        "c" : { 
            "d" : "e",
            "e" : "f"
        }
    });

    api._apply(obj, false, ["c","d"]);
    
    expect(obj).to.deep.equal({
        "c" : { 
            "e" : "f"
        }
    });

    api._apply(obj, true, ["c", "e"], { "z" : "h"});
    
    expect(obj).to.deep.equal({
        "c" : { 
            "e" : { 
                "z" : "h"
            }
        }
    });
});