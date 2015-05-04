'use strict';

// Maps controller
angular.module('maps').controller('MapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Maps',
	function($scope, $stateParams, $location, Authentication, Maps) {
		$scope.authentication = Authentication;

		$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	}
]);