'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Profilepicture = mongoose.model('Profilepicture'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, profilepicture;

/**
 * Profilepicture routes tests
 */
describe('Profilepicture CRUD tests', function() {
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

		// Save a user to the test db and create new Profilepicture
		user.save(function() {
			profilepicture = {
				name: 'Profilepicture Name'
			};

			done();
		});
	});

	it('should be able to save Profilepicture instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profilepicture
				agent.post('/profilepictures')
					.send(profilepicture)
					.expect(200)
					.end(function(profilepictureSaveErr, profilepictureSaveRes) {
						// Handle Profilepicture save error
						if (profilepictureSaveErr) done(profilepictureSaveErr);

						// Get a list of Profilepictures
						agent.get('/profilepictures')
							.end(function(profilepicturesGetErr, profilepicturesGetRes) {
								// Handle Profilepicture save error
								if (profilepicturesGetErr) done(profilepicturesGetErr);

								// Get Profilepictures list
								var profilepictures = profilepicturesGetRes.body;

								// Set assertions
								(profilepictures[0].user._id).should.equal(userId);
								(profilepictures[0].name).should.match('Profilepicture Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Profilepicture instance if not logged in', function(done) {
		agent.post('/profilepictures')
			.send(profilepicture)
			.expect(401)
			.end(function(profilepictureSaveErr, profilepictureSaveRes) {
				// Call the assertion callback
				done(profilepictureSaveErr);
			});
	});

	it('should not be able to save Profilepicture instance if no name is provided', function(done) {
		// Invalidate name field
		profilepicture.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profilepicture
				agent.post('/profilepictures')
					.send(profilepicture)
					.expect(400)
					.end(function(profilepictureSaveErr, profilepictureSaveRes) {
						// Set message assertion
						(profilepictureSaveRes.body.message).should.match('Please fill Profilepicture name');
						
						// Handle Profilepicture save error
						done(profilepictureSaveErr);
					});
			});
	});

	it('should be able to update Profilepicture instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profilepicture
				agent.post('/profilepictures')
					.send(profilepicture)
					.expect(200)
					.end(function(profilepictureSaveErr, profilepictureSaveRes) {
						// Handle Profilepicture save error
						if (profilepictureSaveErr) done(profilepictureSaveErr);

						// Update Profilepicture name
						profilepicture.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Profilepicture
						agent.put('/profilepictures/' + profilepictureSaveRes.body._id)
							.send(profilepicture)
							.expect(200)
							.end(function(profilepictureUpdateErr, profilepictureUpdateRes) {
								// Handle Profilepicture update error
								if (profilepictureUpdateErr) done(profilepictureUpdateErr);

								// Set assertions
								(profilepictureUpdateRes.body._id).should.equal(profilepictureSaveRes.body._id);
								(profilepictureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Profilepictures if not signed in', function(done) {
		// Create new Profilepicture model instance
		var profilepictureObj = new Profilepicture(profilepicture);

		// Save the Profilepicture
		profilepictureObj.save(function() {
			// Request Profilepictures
			request(app).get('/profilepictures')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Profilepicture if not signed in', function(done) {
		// Create new Profilepicture model instance
		var profilepictureObj = new Profilepicture(profilepicture);

		// Save the Profilepicture
		profilepictureObj.save(function() {
			request(app).get('/profilepictures/' + profilepictureObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', profilepicture.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Profilepicture instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Profilepicture
				agent.post('/profilepictures')
					.send(profilepicture)
					.expect(200)
					.end(function(profilepictureSaveErr, profilepictureSaveRes) {
						// Handle Profilepicture save error
						if (profilepictureSaveErr) done(profilepictureSaveErr);

						// Delete existing Profilepicture
						agent.delete('/profilepictures/' + profilepictureSaveRes.body._id)
							.send(profilepicture)
							.expect(200)
							.end(function(profilepictureDeleteErr, profilepictureDeleteRes) {
								// Handle Profilepicture error error
								if (profilepictureDeleteErr) done(profilepictureDeleteErr);

								// Set assertions
								(profilepictureDeleteRes.body._id).should.equal(profilepictureSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Profilepicture instance if not signed in', function(done) {
		// Set Profilepicture user 
		profilepicture.user = user;

		// Create new Profilepicture model instance
		var profilepictureObj = new Profilepicture(profilepicture);

		// Save the Profilepicture
		profilepictureObj.save(function() {
			// Try deleting Profilepicture
			request(app).delete('/profilepictures/' + profilepictureObj._id)
			.expect(401)
			.end(function(profilepictureDeleteErr, profilepictureDeleteRes) {
				// Set message assertion
				(profilepictureDeleteRes.body.message).should.match('User is not logged in');

				// Handle Profilepicture error error
				done(profilepictureDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Profilepicture.remove().exec();
		done();
	});
});