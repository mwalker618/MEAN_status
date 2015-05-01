'use strict';

(function() {
	// Profilepictures Controller Spec
	describe('Profilepictures Controller Tests', function() {
		// Initialize global variables
		var ProfilepicturesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Profilepictures controller.
			ProfilepicturesController = $controller('ProfilepicturesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Profilepicture object fetched from XHR', inject(function(Profilepictures) {
			// Create sample Profilepicture using the Profilepictures service
			var sampleProfilepicture = new Profilepictures({
				name: 'New Profilepicture'
			});

			// Create a sample Profilepictures array that includes the new Profilepicture
			var sampleProfilepictures = [sampleProfilepicture];

			// Set GET response
			$httpBackend.expectGET('profilepictures').respond(sampleProfilepictures);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.profilepictures).toEqualData(sampleProfilepictures);
		}));

		it('$scope.findOne() should create an array with one Profilepicture object fetched from XHR using a profilepictureId URL parameter', inject(function(Profilepictures) {
			// Define a sample Profilepicture object
			var sampleProfilepicture = new Profilepictures({
				name: 'New Profilepicture'
			});

			// Set the URL parameter
			$stateParams.profilepictureId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/profilepictures\/([0-9a-fA-F]{24})$/).respond(sampleProfilepicture);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.profilepicture).toEqualData(sampleProfilepicture);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Profilepictures) {
			// Create a sample Profilepicture object
			var sampleProfilepicturePostData = new Profilepictures({
				name: 'New Profilepicture'
			});

			// Create a sample Profilepicture response
			var sampleProfilepictureResponse = new Profilepictures({
				_id: '525cf20451979dea2c000001',
				name: 'New Profilepicture'
			});

			// Fixture mock form input values
			scope.name = 'New Profilepicture';

			// Set POST response
			$httpBackend.expectPOST('profilepictures', sampleProfilepicturePostData).respond(sampleProfilepictureResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Profilepicture was created
			expect($location.path()).toBe('/profilepictures/' + sampleProfilepictureResponse._id);
		}));

		it('$scope.update() should update a valid Profilepicture', inject(function(Profilepictures) {
			// Define a sample Profilepicture put data
			var sampleProfilepicturePutData = new Profilepictures({
				_id: '525cf20451979dea2c000001',
				name: 'New Profilepicture'
			});

			// Mock Profilepicture in scope
			scope.profilepicture = sampleProfilepicturePutData;

			// Set PUT response
			$httpBackend.expectPUT(/profilepictures\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/profilepictures/' + sampleProfilepicturePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid profilepictureId and remove the Profilepicture from the scope', inject(function(Profilepictures) {
			// Create new Profilepicture object
			var sampleProfilepicture = new Profilepictures({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Profilepictures array and include the Profilepicture
			scope.profilepictures = [sampleProfilepicture];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/profilepictures\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProfilepicture);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.profilepictures.length).toBe(0);
		}));
	});
}());