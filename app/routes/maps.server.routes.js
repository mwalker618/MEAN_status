'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var maps = require('../../app/controllers/maps.server.controller');

	// Maps Routes
	app.route('/maps')
		.get(maps.list)
		.post(users.requiresLogin, maps.create);

	app.route('/maps/:mapId')
		.get(maps.read)
		.put(users.requiresLogin, maps.hasAuthorization, maps.update)
		

	// Finish by binding the Map middleware
	app.param('mapId', maps.mapByID);
};
