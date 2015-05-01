'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Search = mongoose.model('Search'),
	_ = require('lodash');

/**
 * Create a Search
 */
exports.create = function(req, res) {
	var search = new Search(req.body);
	search.user = req.user;

	search.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(search);
		}
	});
};

/**
 * Show the current Search
 */
exports.read = function(req, res) {
	res.jsonp(req.search);
};

/**
 * Update a Search
 */
exports.update = function(req, res) {
	var search = req.search ;

	search = _.extend(search , req.body);

	search.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(search);
		}
	});
};

/**
 * Delete an Search
 */
exports.delete = function(req, res) {
	var search = req.search ;

	search.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(search);
		}
	});
};

/**
 * List of Searches
 */
exports.list = function(req, res) { 
	Search.find().sort('-created').populate('user', 'displayName').exec(function(err, searches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(searches);
		}
	});
};

/**
 * Search middleware
 */
exports.searchByID = function(req, res, next, id) { 
	Search.findById(id).populate('user', 'displayName').exec(function(err, search) {
		if (err) return next(err);
		if (! search) return next(new Error('Failed to load Search ' + id));
		req.search = search ;
		next();
	});
};

/**
 * Search authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.search.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
