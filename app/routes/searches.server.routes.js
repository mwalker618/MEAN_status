'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var searches = require('../../app/controllers/searches.server.controller');

	// Searches Routes
	app.route('/searches')
		.get(searches.list)
		.post(users.requiresLogin, searches.create);

	app.route('/searches/:searchId')
		.get(searches.read)
		.put(users.requiresLogin, searches.hasAuthorization, searches.update)
		.delete(users.requiresLogin, searches.hasAuthorization, searches.delete);

	// Finish by binding the Search middleware
	app.param('searchId', searches.searchByID);
};
