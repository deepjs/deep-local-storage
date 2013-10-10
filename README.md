# deep-local-storage


local storage driver (store) for deepjs (based on jstorage) 


## Usage

	require("deep-local-storage/index").create("myprotocole");

	deep.store("myprotocole")
	.post({ hello:"world" })
	.get()
	.log();

	deep("myprotocole::?hello=world").log();
	
