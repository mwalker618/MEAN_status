'use strict';

//Setting up route
angular.module('profilepictures').config(['$stateProvider',
	function($stateProvider) {
		// Profilepictures state routing
		$stateProvider.
		state('listProfilepictures', {
			url: '/profilepictures',
			templateUrl: 'modules/profilepictures/views/list-profilepictures.client.view.html'
		}).
		state('createProfilepicture', {
			url: '/profilepictures/create',
			templateUrl: 'modules/profilepictures/views/create-profilepicture.client.view.html'
		}).
		state('viewProfilepicture', {
			url: '/profilepictures/:profilepictureId',
			templateUrl: 'modules/profilepictures/views/view-profilepicture.client.view.html'
		}).
		state('editProfilepicture', {
			url: '/profilepictures/:profilepictureId/edit',
			templateUrl: 'modules/profilepictures/views/edit-profilepicture.client.view.html'
		});
	}
]);