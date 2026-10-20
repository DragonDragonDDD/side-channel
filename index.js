'use strict';

var $TypeError = require('es-errors/type');
var inspect = require('object-inspect');
// Preserve initialization of the public backends before loading the shared storage.
require('side-channel-list');
require('side-channel-map');
require('side-channel-weakmap');
var getStorage = require('./storage');

/**
 * @template K, V
 * @returns {{ assert: (key: K) => void, 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }}
 */
module.exports = function getSideChannel() {
	/** @typedef {{ assert: (key: K) => void, 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }} Channel */

	/** @type {{ 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }} */
	var storage = getStorage();

	/** @type {Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				var keyDesc = key && Object(key) === key
					? 'the given object key'
					: inspect(key);
				throw new $TypeError('Side channel does not contain ' + keyDesc);
			}
		},
		'delete': storage['delete'],
		get: storage.get,
		has: storage.has,
		set: storage.set
	};

	return channel;
};
