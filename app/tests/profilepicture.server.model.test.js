'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Profilepicture = mongoose.model('Profilepicture');

/**
 * Globals
 */
var user, profilepicture;

/**
 * Unit tests
 */
describe('Profilepicture Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			profilepicture = new Profilepicture({
				name: 'Profilepicture Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return profilepicture.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			profilepicture.name = '';

			return profilepicture.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Profilepicture.remove().exec();
		User.remove().exec();

		done();
	});
});