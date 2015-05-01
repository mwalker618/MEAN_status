'use strict';

//Searches service used to communicate Searches REST endpoints
angular.module('searches').factory('Searches', ['$resource',
	function($resource) {
		return $resource('searches/:searchId', { searchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);