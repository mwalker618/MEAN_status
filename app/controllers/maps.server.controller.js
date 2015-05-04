'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Map = mongoose.model('Map'),
	_ = require('lodash');


/**
 * Show the current Map
 */
exports.read = function(req, res) {
	res.jsonp(req.map);
};




/**
 * Map authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.map.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
