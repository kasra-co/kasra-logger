'use strict';

var path = require( 'path' ),
	winston = require('winston'),
	fs = require( 'fs' );


function Logger(options) {

    /*jshint validthis:true */
	this.options = options.logging;
	this.logdir = this.options.dir;
	this.transports = [
	new (winston.transports.Console)({
	      name: 'console'
	})];

	var logger = null;

	// Set up logger

	if(this.options.mode === 2) {
		logger = this.addAllTransports().createInstance().remove('console');
	} else if(this.options.mode === 0) {
		logger = this.removeAllTransports().createInstance();
	} else {
		logger = this.createInstance();
	}

	// create log dir

	if(!fs.existsSync(this.logdir)) {

		if(fs.mkdirSync(this.logdir, '0775') !== undefined) {
			throw new Error('Failed to create log dir');
		}

		logger.info( 'Created log dir' );

	}

	this.logger = logger;

}

Logger.prototype.addAllTransports = function addAllTransports() {
	var self = this;
	self.options.levels.forEach(function(params) {
		params.filename = path.join(self.logdir,params.filename);
		self.transports.push(new (winston.transports.File)(params));
	});

	return this;
};


Logger.prototype.removeAllTransports = function removeAllTransports() {
	this.transports = [];
	return this;
};

Logger.prototype.createInstance = function createInstance() {
	return new (winston.Logger)({
	  transports: this.transports
	});

};

Logger.prototype.getInstance = function getInstance() {
	return this.logger;
};

module.exports = function(options) {
	return new Logger(options);
};

