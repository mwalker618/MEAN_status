'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var profilepictures = require('../../app/controllers/profilepictures.server.controller');

	// Profilepictures Routes
	app.route('/profilepictures')
		.get(profilepictures.list)
		.post(users.requiresLogin, profilepictures.create);

	app.route('/profilepictures/:profilepictureId')
		.get(profilepictures.read)
		.put(users.requiresLogin, profilepictures.hasAuthorization, profilepictures.update)
		.delete(users.requiresLogin, profilepictures.hasAuthorization, profilepictures.delete);

	// Finish by binding the Profilepicture middleware
	app.param('profilepictureId', profilepictures.profilepictureByID);
};
