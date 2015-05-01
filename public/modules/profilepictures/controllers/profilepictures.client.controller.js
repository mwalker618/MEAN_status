'use strict';

// Profilepictures controller
angular.module('profilepictures').controller('ProfilepicturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profilepictures',
	function($scope, $stateParams, $location, Authentication, Profilepictures) {
		$scope.authentication = Authentication;

		// Create new Profilepicture
		$scope.create = function() {
			// Create new Profilepicture object
			var profilepicture = new Profilepictures ({
				name: this.name
			});

			// Redirect after save
			profilepicture.$save(function(response) {
				$location.path('profilepictures/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Profilepicture
		$scope.remove = function(profilepicture) {
			if ( profilepicture ) { 
				profilepicture.$remove();

				for (var i in $scope.profilepictures) {
					if ($scope.profilepictures [i] === profilepicture) {
						$scope.profilepictures.splice(i, 1);
					}
				}
			} else {
				$scope.profilepicture.$remove(function() {
					$location.path('profilepictures');
				});
			}
		};

		// Update existing Profilepicture
		$scope.update = function() {
			var profilepicture = $scope.profilepicture;

			profilepicture.$update(function() {
				$location.path('profilepictures/' + profilepicture._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Profilepictures
		$scope.find = function() {
			$scope.profilepictures = Profilepictures.query();
		};

		// Find existing Profilepicture
		$scope.findOne = function() {
			$scope.profilepicture = Profilepictures.get({ 
				profilepictureId: $stateParams.profilepictureId
			});
		};
	}
]);