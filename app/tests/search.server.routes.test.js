'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Search = mongoose.model('Search'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, search;

/**
 * Search routes tests
 */
describe('Search CRUD tests', function() {
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

		// Save a user to the test db and create new Search
		user.save(function() {
			search = {
				name: 'Search Name'
			};

			done();
		});
	});

	it('should be able to save Search instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Search
				agent.post('/searches')
					.send(search)
					.expect(200)
					.end(function(searchSaveErr, searchSaveRes) {
						// Handle Search save error
						if (searchSaveErr) done(searchSaveErr);

						// Get a list of Searches
						agent.get('/searches')
							.end(function(searchesGetErr, searchesGetRes) {
								// Handle Search save error
								if (searchesGetErr) done(searchesGetErr);

								// Get Searches list
								var searches = searchesGetRes.body;

								// Set assertions
								(searches[0].user._id).should.equal(userId);
								(searches[0].name).should.match('Search Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Search instance if not logged in', function(done) {
		agent.post('/searches')
			.send(search)
			.expect(401)
			.end(function(searchSaveErr, searchSaveRes) {
				// Call the assertion callback
				done(searchSaveErr);
			});
	});

	it('should not be able to save Search instance if no name is provided', function(done) {
		// Invalidate name field
		search.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Search
				agent.post('/searches')
					.send(search)
					.expect(400)
					.end(function(searchSaveErr, searchSaveRes) {
						// Set message assertion
						(searchSaveRes.body.message).should.match('Please fill Search name');
						
						// Handle Search save error
						done(searchSaveErr);
					});
			});
	});

	it('should be able to update Search instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Search
				agent.post('/searches')
					.send(search)
					.expect(200)
					.end(function(searchSaveErr, searchSaveRes) {
						// Handle Search save error
						if (searchSaveErr) done(searchSaveErr);

						// Update Search name
						search.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Search
						agent.put('/searches/' + searchSaveRes.body._id)
							.send(search)
							.expect(200)
							.end(function(searchUpdateErr, searchUpdateRes) {
								// Handle Search update error
								if (searchUpdateErr) done(searchUpdateErr);

								// Set assertions
								(searchUpdateRes.body._id).should.equal(searchSaveRes.body._id);
								(searchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Searches if not signed in', function(done) {
		// Create new Search model instance
		var searchObj = new Search(search);

		// Save the Search
		searchObj.save(function() {
			// Request Searches
			request(app).get('/searches')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Search if not signed in', function(done) {
		// Create new Search model instance
		var searchObj = new Search(search);

		// Save the Search
		searchObj.save(function() {
			request(app).get('/searches/' + searchObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', search.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Search instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Search
				agent.post('/searches')
					.send(search)
					.expect(200)
					.end(function(searchSaveErr, searchSaveRes) {
						// Handle Search save error
						if (searchSaveErr) done(searchSaveErr);

						// Delete existing Search
						agent.delete('/searches/' + searchSaveRes.body._id)
							.send(search)
							.expect(200)
							.end(function(searchDeleteErr, searchDeleteRes) {
								// Handle Search error error
								if (searchDeleteErr) done(searchDeleteErr);

								// Set assertions
								(searchDeleteRes.body._id).should.equal(searchSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Search instance if not signed in', function(done) {
		// Set Search user 
		search.user = user;

		// Create new Search model instance
		var searchObj = new Search(search);

		// Save the Search
		searchObj.save(function() {
			// Try deleting Search
			request(app).delete('/searches/' + searchObj._id)
			.expect(401)
			.end(function(searchDeleteErr, searchDeleteRes) {
				// Set message assertion
				(searchDeleteRes.body.message).should.match('User is not logged in');

				// Handle Search error error
				done(searchDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Search.remove().exec();
		done();
	});
});