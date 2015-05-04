'use strict';

(function() {
	// Cats Controller Spec
	describe('Cats Controller Tests', function() {
		// Initialize global variables
		var CatsController,
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

			// Initialize the Cats controller.
			CatsController = $controller('CatsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cat object fetched from XHR', inject(function(Cats) {
			// Create sample Cat using the Cats service
			var sampleCat = new Cats({
				name: 'New Cat'
			});

			// Create a sample Cats array that includes the new Cat
			var sampleCats = [sampleCat];

			// Set GET response
			$httpBackend.expectGET('cats').respond(sampleCats);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cats).toEqualData(sampleCats);
		}));

		it('$scope.findOne() should create an array with one Cat object fetched from XHR using a catId URL parameter', inject(function(Cats) {
			// Define a sample Cat object
			var sampleCat = new Cats({
				name: 'New Cat'
			});

			// Set the URL parameter
			$stateParams.catId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cats\/([0-9a-fA-F]{24})$/).respond(sampleCat);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cat).toEqualData(sampleCat);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cats) {
			// Create a sample Cat object
			var sampleCatPostData = new Cats({
				name: 'New Cat'
			});

			// Create a sample Cat response
			var sampleCatResponse = new Cats({
				_id: '525cf20451979dea2c000001',
				name: 'New Cat'
			});

			// Fixture mock form input values
			scope.name = 'New Cat';

			// Set POST response
			$httpBackend.expectPOST('cats', sampleCatPostData).respond(sampleCatResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cat was created
			expect($location.path()).toBe('/cats/' + sampleCatResponse._id);
		}));

		it('$scope.update() should update a valid Cat', inject(function(Cats) {
			// Define a sample Cat put data
			var sampleCatPutData = new Cats({
				_id: '525cf20451979dea2c000001',
				name: 'New Cat'
			});

			// Mock Cat in scope
			scope.cat = sampleCatPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cats\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cats/' + sampleCatPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid catId and remove the Cat from the scope', inject(function(Cats) {
			// Create new Cat object
			var sampleCat = new Cats({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cats array and include the Cat
			scope.cats = [sampleCat];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cats\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCat);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cats.length).toBe(0);
		}));
	});
}());