'use strict';

(function() {
	// Searches Controller Spec
	describe('Searches Controller Tests', function() {
		// Initialize global variables
		var SearchesController,
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

			// Initialize the Searches controller.
			SearchesController = $controller('SearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Search object fetched from XHR', inject(function(Searches) {
			// Create sample Search using the Searches service
			var sampleSearch = new Searches({
				name: 'New Search'
			});

			// Create a sample Searches array that includes the new Search
			var sampleSearches = [sampleSearch];

			// Set GET response
			$httpBackend.expectGET('searches').respond(sampleSearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.searches).toEqualData(sampleSearches);
		}));

		it('$scope.findOne() should create an array with one Search object fetched from XHR using a searchId URL parameter', inject(function(Searches) {
			// Define a sample Search object
			var sampleSearch = new Searches({
				name: 'New Search'
			});

			// Set the URL parameter
			$stateParams.searchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/searches\/([0-9a-fA-F]{24})$/).respond(sampleSearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.search).toEqualData(sampleSearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Searches) {
			// Create a sample Search object
			var sampleSearchPostData = new Searches({
				name: 'New Search'
			});

			// Create a sample Search response
			var sampleSearchResponse = new Searches({
				_id: '525cf20451979dea2c000001',
				name: 'New Search'
			});

			// Fixture mock form input values
			scope.name = 'New Search';

			// Set POST response
			$httpBackend.expectPOST('searches', sampleSearchPostData).respond(sampleSearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Search was created
			expect($location.path()).toBe('/searches/' + sampleSearchResponse._id);
		}));

		it('$scope.update() should update a valid Search', inject(function(Searches) {
			// Define a sample Search put data
			var sampleSearchPutData = new Searches({
				_id: '525cf20451979dea2c000001',
				name: 'New Search'
			});

			// Mock Search in scope
			scope.search = sampleSearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/searches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/searches/' + sampleSearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid searchId and remove the Search from the scope', inject(function(Searches) {
			// Create new Search object
			var sampleSearch = new Searches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Searches array and include the Search
			scope.searches = [sampleSearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/searches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.searches.length).toBe(0);
		}));
	});
}());