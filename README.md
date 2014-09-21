# deep-local-storage


local storage driver (store) for deepjs (based on [jstorage](http://www.jstorage.info/)) 

## install

```shell
bower install deep-local-storage
```

You should also have [jstorage](http://www.jstorage.info/) loaded in your page.

## Collection store Usage 

```javascript 
var deep = require("deepjs/deep");
require("deep-local-storage/index");
require("deep-restful/index");

deep.jstorage.collection("myprotocol");

deep.restful("myprotocol")
.post({ hello:"world" })
.get()
.log();

deep("myprotocol::?hello=world").log();

deep.restful("myprotocol")
.put({ id:'test', myVar:"hello", myObject:{ myVar2:12344 }})
.slog()
.patch("patched with query","test/myVar")
.slog()
.get("test")
.slog()
.put(7777777,"test/myObject/myVar2")
.slog()
.patch({other:true},"test/myObject/myVar2")
.slog()
.get("test")
.log();
```

## Object store Usage 

```javascript
var deep = require("deepjs/deep");
require("deep-local-storage/index");
require("deep-restful/index");

deep.jstorage.object("myprotocol");

deep.restful("myprotocol")
.post({ hello:"world", id:"/my/path" })
.get()
.log();

deep("myprotocol::/my/path").log();

//...

```



