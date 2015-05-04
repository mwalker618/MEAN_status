'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var cats = require('../../app/controllers/cats.server.controller');

	// Cats Routes
	app.route('/cats')
		.get(cats.list)
		.post(users.requiresLogin, cats.create);

	app.route('/cats/:catId')
		.get(cats.read)
		.put(users.requiresLogin, cats.hasAuthorization, cats.update)
		.delete(users.requiresLogin, cats.hasAuthorization, cats.delete);

	// Finish by binding the Cat middleware
	app.param('catId', cats.catByID);
};
