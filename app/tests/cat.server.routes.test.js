'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Cat = mongoose.model('Cat'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, cat;

/**
 * Cat routes tests
 */
describe('Cat CRUD tests', function() {
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

		// Save a user to the test db and create new Cat
		user.save(function() {
			cat = {
				name: 'Cat Name'
			};

			done();
		});
	});

	it('should be able to save Cat instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cat
				agent.post('/cats')
					.send(cat)
					.expect(200)
					.end(function(catSaveErr, catSaveRes) {
						// Handle Cat save error
						if (catSaveErr) done(catSaveErr);

						// Get a list of Cats
						agent.get('/cats')
							.end(function(catsGetErr, catsGetRes) {
								// Handle Cat save error
								if (catsGetErr) done(catsGetErr);

								// Get Cats list
								var cats = catsGetRes.body;

								// Set assertions
								(cats[0].user._id).should.equal(userId);
								(cats[0].name).should.match('Cat Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Cat instance if not logged in', function(done) {
		agent.post('/cats')
			.send(cat)
			.expect(401)
			.end(function(catSaveErr, catSaveRes) {
				// Call the assertion callback
				done(catSaveErr);
			});
	});

	it('should not be able to save Cat instance if no name is provided', function(done) {
		// Invalidate name field
		cat.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cat
				agent.post('/cats')
					.send(cat)
					.expect(400)
					.end(function(catSaveErr, catSaveRes) {
						// Set message assertion
						(catSaveRes.body.message).should.match('Please fill Cat name');
						
						// Handle Cat save error
						done(catSaveErr);
					});
			});
	});

	it('should be able to update Cat instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cat
				agent.post('/cats')
					.send(cat)
					.expect(200)
					.end(function(catSaveErr, catSaveRes) {
						// Handle Cat save error
						if (catSaveErr) done(catSaveErr);

						// Update Cat name
						cat.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Cat
						agent.put('/cats/' + catSaveRes.body._id)
							.send(cat)
							.expect(200)
							.end(function(catUpdateErr, catUpdateRes) {
								// Handle Cat update error
								if (catUpdateErr) done(catUpdateErr);

								// Set assertions
								(catUpdateRes.body._id).should.equal(catSaveRes.body._id);
								(catUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cats if not signed in', function(done) {
		// Create new Cat model instance
		var catObj = new Cat(cat);

		// Save the Cat
		catObj.save(function() {
			// Request Cats
			request(app).get('/cats')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Cat if not signed in', function(done) {
		// Create new Cat model instance
		var catObj = new Cat(cat);

		// Save the Cat
		catObj.save(function() {
			request(app).get('/cats/' + catObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', cat.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Cat instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Cat
				agent.post('/cats')
					.send(cat)
					.expect(200)
					.end(function(catSaveErr, catSaveRes) {
						// Handle Cat save error
						if (catSaveErr) done(catSaveErr);

						// Delete existing Cat
						agent.delete('/cats/' + catSaveRes.body._id)
							.send(cat)
							.expect(200)
							.end(function(catDeleteErr, catDeleteRes) {
								// Handle Cat error error
								if (catDeleteErr) done(catDeleteErr);

								// Set assertions
								(catDeleteRes.body._id).should.equal(catSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Cat instance if not signed in', function(done) {
		// Set Cat user 
		cat.user = user;

		// Create new Cat model instance
		var catObj = new Cat(cat);

		// Save the Cat
		catObj.save(function() {
			// Try deleting Cat
			request(app).delete('/cats/' + catObj._id)
			.expect(401)
			.end(function(catDeleteErr, catDeleteRes) {
				// Set message assertion
				(catDeleteRes.body.message).should.match('User is not logged in');

				// Handle Cat error error
				done(catDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Cat.remove().exec();
		done();
	});
});