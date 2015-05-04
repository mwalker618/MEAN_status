'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cat = mongoose.model('Cat'),
	_ = require('lodash');

/**
 * Create a Cat
 */
exports.create = function(req, res) {
	var cat = new Cat(req.body);
	cat.user = req.user;
	cat.breed = req.breed;

	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // makes a socket instance
			socketio.emit('cat.created', cat); // sends the socket event to all current users
			
			res.json(cat);
		}
	});
};

/**
 * Show the current Cat
 */
exports.read = function(req, res) {
	res.jsonp(req.cat);
};

/**
 * Update a Cat
 */
exports.update = function(req, res) {
	var cat = req.cat ;

	cat = _.extend(cat , req.body);

	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cat);
		}
	});
};

/**
 * Delete an Cat
 */
exports.delete = function(req, res) {
	var cat = req.cat ;

	cat.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cat);
		}
	});
};

/**
 * List of Cats
 */
exports.list = function(req, res) { 
	Cat.find().sort('-created').populate('user', 'displayName').exec(function(err, cats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cats);
		}
	});
};

/**
 * Cat middleware
 */
exports.catByID = function(req, res, next, id) { 
	Cat.findById(id).populate('user', 'displayName').exec(function(err, cat) {
		if (err) return next(err);
		if (! cat) return next(new Error('Failed to load Cat ' + id));
		req.cat = cat ;
		next();
	});
};

/**
 * Cat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cat.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
