# deep-local-storage


local storage driver (store) for deepjs (based on jstorage) 


## Collection store Usage 

```javascript 
	require("deep-local-storage/index");
	deep.store.jstorage.Collection.create("myprotocol");

	deep.rest("myprotocol")
	.post({ hello:"world" })
	.get()
	.log();

	deep("myprotocol::?hello=world").log();

	deep.rest("myprotocol")
	.put({ id:'test', myVar:"hello", myObject:{ myVar2:12344 }})
	.logState()
	.patch("patched with query",{id:"test", query:"/myVar"})
	.logState()
	.get("test")
	.logState()
	.put(7777777,{id:"test", query:"/myObject/myVar2"})
	.logState()
	.patch({other:true},{id:"test", query:"/myObject/myVar2"})
	.logState()
	.get("test")
	.logState();
```

## Object store Usage 

```javascript
	require("deep-local-storage/index");
	deep.store.jstorage.Object.create("myprotocol");

	deep.rest("myprotocol")
	.post({ hello:"world" },{ id:"/my/path" })
	.get()
	.log();

	deep("myprotocol::/my/path").log();

	//...

```



