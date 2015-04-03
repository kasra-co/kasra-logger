'use strict';

var Logger = require( './lib/logger' );

module.exports = {
	init: function(options,callback) {

		var logger = null;

		try {
			logger = Logger(options).getInstance();
		}
		catch(e) {
			callback([e]);
		}

		callback(null,logger);

	}
};







