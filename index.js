/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deep-restful/lib/object", "deep-restful/lib/collection"],function (require, deep)
{
	deep.jstorage = deep.jstorage || {};
	/**
	 * deep.store.jstorage.Object
	 * @param  {[type]} protocol               (optional)[description]
	 * @param  {[type]} root					(optional)[description]
	 * @param  {[type]} schema                  (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	
	deep.jstorage.Object = deep.Classes(deep.Object,
		function(protocol, root, schema, options){
			options = options || {};
			var path = options.path || protocol;
			if(!path)
				throw deep.errors.Store("jstorage.Object need a path at constructor. please provide a options.path or a protocol.");
			// console.log("jstorage init : ", protocol, root, this.root, $.jStorage.get(path))
			var current = $.jStorage.get(path) || root || this.root;
			this.path = path;
			//console.log("root : ", current)
			if(!current)
			{
				current = {};
				$.jStorage.set(path, current, options);
			}
			this.root = current;
			
			deep.up(this, options);
		},
		{
			flush:deep.compose.after(function(opt){
				this.root  = {};
				$.jStorage.set(this.path || this.protocol, this.root, opt);
			})
		});
        deep.jstorage.object = function(protocol, root, schema, options)
        {
            return new deep.jstorage.Object(protocol, root, schema, options);
        };
        deep.sheet(deep.jstorage.Object.prototype, {
			"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
			{
				return function (object, opt) {
					var self = this;
					return deep.when(old.call(this, object, opt))
					.done(function (object) {
						$.jStorage.set(self.path, self.root, opt);
					});
				};
			}),
		});
	/**
	 * deep.store.jstorage.Collection
	 * @param  {[type]} protocol                 (optional)[description]
	 * @param  {[type]} collection                (optional)[description]
	 * @param  {[type]} schema                    (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	deep.jstorage.Collection = deep.Classes(deep.Collection,
		function(protocol, collection, schema, options){
			options = options || {};
			var path = options.path || protocol;
			if(!path)
				throw deep.errors.Store("jstorage.Collection need a path at constructor. please provide a options.path or a protocol.");
			this.path = path;
			var current = collection || this.collection || $.jStorage.get(path);
			if(!current)
			{
				current = [];
				$.jStorage.set(path, current, options);
			}
			this.collection = current;
			deep.sheet(this, {
				"dq.up::./[post,put,patch,del]":deep.compose.around(function(old)
				{
					return function (object, opt) {
						//console.log("action : ", object, opt);
						var self = this;
						return deep.when(old.call(this, object, opt))
						.done(function (object) {
							$.jStorage.set(self.path, self.collection, opt);
						});
					};
				})
			});
			deep.up(this, options);
		},
		{
			flush:deep.compose.after(function(opt){
				this.collection = [];
				$.jStorage.set(this.path || this.protocol, this.collection, opt);
			})
		});
        deep.jstorage.collection = function(protocol, collection, schema, options)
        {
            return new deep.jstorage.Collection(protocol, collection, schema, options);
        };

        deep.coreUnits = deep.coreUnits || [];
		deep.coreUnits.push("js::deep-local-storage/units/generic");
	//__________________________________________________
	return deep.jstorage;
});
