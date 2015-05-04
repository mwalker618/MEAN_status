'use strict';

// Cats controller
angular.module('cats').controller('CatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cats',
	function($scope, $stateParams, $location, Authentication, Cats) {
		$scope.authentication = Authentication;

		// Create new Cat
		$scope.create = function() {
			// Create new Cat object
			var cat = new Cats ({
				name: this.name
			});

			// Redirect after save
			cat.$save(function(response) {
				$location.path('cats/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Cat
		$scope.remove = function(cat) {
			if ( cat ) { 
				cat.$remove();

				for (var i in $scope.cats) {
					if ($scope.cats [i] === cat) {
						$scope.cats.splice(i, 1);
					}
				}
			} else {
				$scope.cat.$remove(function() {
					$location.path('cats');
				});
			}
		};

		// Update existing Cat
		$scope.update = function() {
			var cat = $scope.cat;

			cat.$update(function() {
				$location.path('cats/' + cat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cats
		$scope.find = function() {
			$scope.cats = Cats.query();
		};

		// Find existing Cat
		$scope.findOne = function() {
			$scope.cat = Cats.get({ 
				catId: $stateParams.catId
			});
		};
	}
]);