'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Map = mongoose.model('Map'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, map;

/**
 * Map routes tests
 */
describe('Map CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Map
		user.save(function() {
			map = {
				name: 'Map Name'
			};

			done();
		});
	});

	it('should be able to save Map instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Map
				agent.post('/maps')
					.send(map)
					.expect(200)
					.end(function(mapSaveErr, mapSaveRes) {
						// Handle Map save error
						if (mapSaveErr) done(mapSaveErr);

						// Get a list of Maps
						agent.get('/maps')
							.end(function(mapsGetErr, mapsGetRes) {
								// Handle Map save error
								if (mapsGetErr) done(mapsGetErr);

								// Get Maps list
								var maps = mapsGetRes.body;

								// Set assertions
								(maps[0].user._id).should.equal(userId);
								(maps[0].name).should.match('Map Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Map instance if not logged in', function(done) {
		agent.post('/maps')
			.send(map)
			.expect(401)
			.end(function(mapSaveErr, mapSaveRes) {
				// Call the assertion callback
				done(mapSaveErr);
			});
	});

	it('should not be able to save Map instance if no name is provided', function(done) {
		// Invalidate name field
		map.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Map
				agent.post('/maps')
					.send(map)
					.expect(400)
					.end(function(mapSaveErr, mapSaveRes) {
						// Set message assertion
						(mapSaveRes.body.message).should.match('Please fill Map name');
						
						// Handle Map save error
						done(mapSaveErr);
					});
			});
	});

	it('should be able to update Map instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Map
				agent.post('/maps')
					.send(map)
					.expect(200)
					.end(function(mapSaveErr, mapSaveRes) {
						// Handle Map save error
						if (mapSaveErr) done(mapSaveErr);

						// Update Map name
						map.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Map
						agent.put('/maps/' + mapSaveRes.body._id)
							.send(map)
							.expect(200)
							.end(function(mapUpdateErr, mapUpdateRes) {
								// Handle Map update error
								if (mapUpdateErr) done(mapUpdateErr);

								// Set assertions
								(mapUpdateRes.body._id).should.equal(mapSaveRes.body._id);
								(mapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Maps if not signed in', function(done) {
		// Create new Map model instance
		var mapObj = new Map(map);

		// Save the Map
		mapObj.save(function() {
			// Request Maps
			request(app).get('/maps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Map if not signed in', function(done) {
		// Create new Map model instance
		var mapObj = new Map(map);

		// Save the Map
		mapObj.save(function() {
			request(app).get('/maps/' + mapObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', map.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Map instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Map
				agent.post('/maps')
					.send(map)
					.expect(200)
					.end(function(mapSaveErr, mapSaveRes) {
						// Handle Map save error
						if (mapSaveErr) done(mapSaveErr);

						// Delete existing Map
						agent.delete('/maps/' + mapSaveRes.body._id)
							.send(map)
							.expect(200)
							.end(function(mapDeleteErr, mapDeleteRes) {
								// Handle Map error error
								if (mapDeleteErr) done(mapDeleteErr);

								// Set assertions
								(mapDeleteRes.body._id).should.equal(mapSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Map instance if not signed in', function(done) {
		// Set Map user 
		map.user = user;

		// Create new Map model instance
		var mapObj = new Map(map);

		// Save the Map
		mapObj.save(function() {
			// Try deleting Map
			request(app).delete('/maps/' + mapObj._id)
			.expect(401)
			.end(function(mapDeleteErr, mapDeleteRes) {
				// Set message assertion
				(mapDeleteRes.body.message).should.match('User is not logged in');

				// Handle Map error error
				done(mapDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Map.remove().exec();
		done();
	});
});