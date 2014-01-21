/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 * to be used in conjonction with jstorage (http://www.jstorage.info/)
 * 
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["require", "deepjs/deep"],function (require, deep)
{
	deep.store.jstorage = deep.store.jstorage || {};
	/**
	 * deep.store.jstorage.Object
	 * @param  {[type]} protocole               (optional)[description]
	 * @param  {[type]} root					(optional)[description]
	 * @param  {[type]} schema                  (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	
	deep.store.jstorage.Object = deep.compose.Classes(deep.store.Object,
		function(protocole, root, schema, options){
			options = options || {};
			var path = options.path || protocole;
			if(!path)
				throw deep.errors.Store("jstorage.Object need a path at constructor. please provide a options.path or a protocole.");
			var current = root || this.root ||  $.jStorage.get(path);
			if(!current)
			{
				current = {};
				$.jStorage.set(path, current, options);
			}
			this.root = current;
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
			}, this);
			deep.utils.up(options, this);
		},
		{
			flush:deep.compose.after(function(opt){
				$.jStorage.set(this.path || this.protocole, this.root, opt);
			})
		});
        deep.store.jstorage.Object.create = function(protocole, root, schema, options)
        {
            return new deep.store.jstorage.Object(protocole, root, schema, options);
        };
	/**
	 * deep.store.jstorage.Collection
	 * @param  {[type]} protocole                 (optional)[description]
	 * @param  {[type]} collection                (optional)[description]
	 * @param  {[type]} schema                    (optional)[description]
	 * @param  {[type]} options    (optional){ path:{ required string }, TTL:{ time to live (ms) }}
	 */
	deep.store.jstorage.Collection = deep.compose.Classes(deep.store.Collection,
		function(protocole, collection, schema, options){
			options = options || {};
			var path = options.path || protocole;
			if(!path)
				throw deep.errors.Store("jstorage.Collection need a path at constructor. please provide a options.path or a protocole.");
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
				$.jStorage.set(this.path || this.protocole, this.collection, opt);
			})
		});
        deep.store.jstorage.Collection.create = function(protocole, collection, schema, options)
        {
            return new deep.store.jstorage.Collection(protocole, collection, schema, options);
        };

        deep.coreUnits = deep.coreUnits || [];
		deep.coreUnits.push("js::deep-local-storage/units/generic");
	//__________________________________________________
	return deep.store.jstorage;
});