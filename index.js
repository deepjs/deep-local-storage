/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deepjs/lib/stores/object-store", "deepjs/lib/stores/collection-store"],function (require, deep)
{
	deep.store.jstorage = deep.store.jstorage || {};
	/**
	 * deep.store.jstorage.Object
	 * @param  {[type]} protocol               (optional)[description]
	 * @param  {[type]} root					(optional)[description]
	 * @param  {[type]} schema                  (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	
	deep.store.jstorage.Object = deep.compose.Classes(deep.store.Object,
		function(protocol, root, schema, options){
			options = options || {};
			var path = options.path || protocol;
			if(!path)
				throw deep.errors.Store("jstorage.Object need a path at constructor. please provide a options.path or a protocol.");
			// console.log("jstorage init : ", protocol, root, this.root, $.jStorage.get(path))
			var current = $.jStorage.get(path) || root || this.root;
			//console.log("root : ", current)
			if(!current)
			{
				current = {};
				$.jStorage.set(path, current, options);
			}
			this.root = current;
			
			deep.utils.up(options, this);
		},
		{
			flush:deep.compose.after(function(opt){
				$.jStorage.set(this.path || this.protocol, this.root, opt);
			})
		});
        deep.store.jstorage.Object.create = function(protocol, root, schema, options)
        {
            return new deep.store.jstorage.Object(protocol, root, schema, options);
        };
        deep.sheet({
			"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
			{
				return function (object, opt) {
					var self = this;
					return deep.when(old.call(this, object, opt))
					.done(function (object) {
						$.jStorage.set(path, self.root, opt);
					});
				};
			}),
		}, deep.store.jstorage.Object.prototype);
	/**
	 * deep.store.jstorage.Collection
	 * @param  {[type]} protocol                 (optional)[description]
	 * @param  {[type]} collection                (optional)[description]
	 * @param  {[type]} schema                    (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	deep.store.jstorage.Collection = deep.compose.Classes(deep.store.Collection,
		function(protocol, collection, schema, options){
			options = options || {};
			var path = options.path || protocol;
			if(!path)
				throw deep.errors.Store("jstorage.Collection need a path at constructor. please provide a options.path or a protocol.");
			var current = collection || this.collection || $.jStorage.get(path);
			if(!current)
			{
				current = [];
				$.jStorage.set(path, current, options);
			}
			this.collection = current;
			deep.sheet({
				"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
				{
					return function (object, opt) {
						//console.log("action : ", object, opt);
						var self = this;
						return deep.when(old.call(this, object, opt))
						.done(function (object) {
							$.jStorage.set(path, self.collection, opt);
						});
					};
				})
			}, this);
			deep.utils.up(options, this);
		},
		{
			flush:deep.compose.after(function(opt){
				this.collection = [];
				$.jStorage.set(this.path || this.protocol, this.collection, opt);
			})
		});
        deep.store.jstorage.Collection.create = function(protocol, collection, schema, options)
        {
            return new deep.store.jstorage.Collection(protocol, collection, schema, options);
        };

        deep.coreUnits = deep.coreUnits || [];
		deep.coreUnits.push("js::deep-local-storage/units/generic");
	//__________________________________________________
	return deep.store.jstorage;
});