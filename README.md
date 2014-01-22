# deep-local-storage


local storage driver (store) for deepjs (based on jstorage) 


## Usage

	require("deep-local-storage/index").create("myprotocol");

	deep.store("myprotocol")
	.post({ hello:"world" })
	.get()
	.log();

	deep("myprotocol::?hello=world").log();
	


	deep.store("myprotocol")
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