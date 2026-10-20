'use strict';

var getSideChannelList = require('side-channel-list/storage');
var getSideChannelMap = require('side-channel-map/storage');
var getSideChannelWeakMap = require('side-channel-weakmap/storage');

var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;

/**
 * @template K, V
 * @returns {{ 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }}
 */
module.exports = function getStorage() {
	/** @typedef {{ 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }} Channel */

	/** @type {Channel | undefined} */ var $channelData;

	/** @type {Channel} */
	var channel = {
		'delete': function (key) {
			return !!$channelData && $channelData['delete'](key);
		},
		get: function (key) {
			return $channelData && $channelData.get(key);
		},
		has: function (key) {
			return !!$channelData && $channelData.has(key);
		},
		set: function (key, value) {
			if (!$channelData) {
				$channelData = makeChannel();
			}

			$channelData.set(key, value);
		}
	};

	return channel;
};
