if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["require","deepjs/deep", "deepjs/lib/unit"], function (require, deep, Unit) {
    
    //_______________________________________________________________ GENERIC STORE TEST CASES
    var postTest = {
        id:"id123",
        title:"hello",
        order:2
    };
    var putTest = {
        id:"id123",
        order:2,
        otherVar:"yes"
    };
    var patchTest = {
        id:"id123",
        order:4,
        otherVar:"yes",
        newVar:true
    };

    var unit = {
        title:"deep-local-storage",
        setup:function(){
            return require("deep-local-storage/index").Collection.create("jstoragetest", []);
        },
        tests : {
            post:function(){
                return deep.rest(this)
                //.log("chain store init in test")
                .post( postTest )
                .equal( postTest )
                .get("id123")
                .equal(postTest);
            },
            postWithSameID:function(){
                return deep.rest(this)
                //.log("chain store init in test")
                .post( postTest )
                .fail(function(error){
                    if(error && error.status == 409)
                        return true;
                });
            },
            put:function(){
                // post
                return deep.rest(this)
                // put
                .put(putTest)
                .equal( putTest )
                .get("id123")
                .equal( putTest );
            },
            patch:function(){
                // post
                return deep.rest(this)
                .patch({
                    order:4,
                    newVar:true,
                    id:"id123"
                })
                .equal(patchTest)
                //.log("patch")
                .get("id123")
                .equal(patchTest);
            },
            query:function(){
                // post
                return deep.rest(this)
                // query
                .get("?order=4")
                .equal([patchTest]);
            },
            del:function () {
                var delDone = false;
                return deep.rest(this)
                .del("id123")
                .done(function (argument) {
                    delDone = true;
                })
                .get("id123")
                .fail(function(error){
                    if(delDone && error.status == 404)
                        return true;
                });
            }
        }
    };



/*
deep.rest("myobjects")
.patch({
    id:"id1381690769563",
    test:"hello",
    fdfsdfsddsfsdfsfdfsd:"11111111111"
})
.rpc("first", ["hhhhh","gggggg"], "id1381690769563")
.get()
.bulk([
    {to:"id1381690769563", method:"patch", body:{name:"updated 2"}},
    {to:"id1381690769563", method:"get"},
    {to:"id1381690769563", method:"rpc", body:{ args:["hello","blkrpc"], method:"first" }}
])
.log();
*/
	return unit;
});
