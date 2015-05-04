'use strict';

//Cats service used to communicate Cats REST endpoints
angular.module('cats').factory('Cats', ['$resource',
	function($resource) {
		return $resource('cats/:catId', { catId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);