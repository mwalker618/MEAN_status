'use strict';

//Profilepictures service used to communicate Profilepictures REST endpoints
angular.module('profilepictures').factory('Profilepictures', ['$resource',
	function($resource) {
		return $resource('profilepictures/:profilepictureId', { profilepictureId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);