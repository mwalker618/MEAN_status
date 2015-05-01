'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Profilepicture = mongoose.model('Profilepicture'),
	_ = require('lodash');

/**
 * Create a Profilepicture
 */
exports.create = function(req, res) {
	var profilepicture = new Profilepicture(req.body);
	profilepicture.user = req.user;

	profilepicture.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profilepicture);
		}
	});
};

/**
 * Show the current Profilepicture
 */
exports.read = function(req, res) {
	res.jsonp(req.profilepicture);
};

/**
 * Update a Profilepicture
 */
exports.update = function(req, res) {
	var profilepicture = req.profilepicture ;

	profilepicture = _.extend(profilepicture , req.body);

	profilepicture.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profilepicture);
		}
	});
};

/**
 * Delete an Profilepicture
 */
exports.delete = function(req, res) {
	var profilepicture = req.profilepicture ;

	profilepicture.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profilepicture);
		}
	});
};

/**
 * List of Profilepictures
 */
exports.list = function(req, res) { 
	Profilepicture.find().sort('-created').populate('user', 'displayName').exec(function(err, profilepictures) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profilepictures);
		}
	});
};

/**
 * Profilepicture middleware
 */
exports.profilepictureByID = function(req, res, next, id) { 
	Profilepicture.findById(id).populate('user', 'displayName').exec(function(err, profilepicture) {
		if (err) return next(err);
		if (! profilepicture) return next(new Error('Failed to load Profilepicture ' + id));
		req.profilepicture = profilepicture ;
		next();
	});
};

/**
 * Profilepicture authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profilepicture.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
