/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if(typeof define !== 'function')
	var define = require('amdefine')(module);

define(["require"],function (require)
{
	var deep = require("deep/deep");
	/**
	 * 
	 * @param  {[type]} protocole                 [description]
	 * @param  {[type]} root                      [description]
	 * @param  {[type]} schema                    [description]
	 * @param  {[type]} options    { path:{ required string }, TTL:{ time to live (ms) }}
	 */
	deep.store.jstorage.Object = deep.compose.Classes(deep.store.Object, 
		function(protocole, root, schema, options){
			options = options || {};
			if(!options.path && !protocole)
				throw deep.errors.Store("jstorage.Object need a path at constructor. please provide a options.path or a protocole.")
			var path = options.path || protocole;
			var current = root || $.jStorage.get(path);
			if(!current)
			{
				current = {};
				$.jStorage.set(path, current, options);
			}
			this.root = current;
			deep.utils.up({
				post:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.root, deep.utils.bottom(options, opt));
					return object;
				}),
				put:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.root, deep.utils.bottom(options, opt));
					return object;
				}),
				patch:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.root, deep.utils.bottom(options, opt));
					return object;
				}),
				del:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.root, deep.utils.bottom(options, opt));
					return object;
				})
			}, this);
		},
		{
			flush:function(){
				this.root = {};
				$.jStorage.set(path, this.root, deep.utils.bottom(options, opt));
			}
		});

	deep.store.jstorage.Collection = deep.compose.Classes(deep.store.Collection, 
		function(protocole, collection, schema, options){
			options = options || {};
			if(!options.path && !protocole)
				throw deep.errors.Store("jstorage.Collection need a path at constructor. please provide a options.path or a protocole.")
			var path = options.path || protocole;
			var current = collection || $.jStorage.get(path);
			if(!current)
			{
				current = [];
				$.jStorage.set(path, current, options);
			}
			this.collection = current;
			deep.utils.up({
				post:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.collection, deep.utils.bottom(options, opt));
					return object;
				}),
				put:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.collection, deep.utils.bottom(options, opt));
					return object;
				}),
				patch:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.collection, deep.utils.bottom(options, opt));
					return object;
				}),
				del:deep.compose.after(function (object, opt) {
					$.jStorage.set(path, this.collection, deep.utils.bottom(options, opt));
					return object;
				})
			}, this);
		},
		{
			flush:function(){
				this.collection = [];
				$.jStorage.set(path, this.collection, deep.utils.bottom(options, opt));
			}
		});
	//__________________________________________________
	return deep.store.JStorage;
});