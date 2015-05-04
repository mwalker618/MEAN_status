'use strict';

//Setting up route
angular.module('cats').config(['$stateProvider',
	function($stateProvider) {
		// Cats state routing
		$stateProvider.
		state('listCats', {
			url: '/cats',
			templateUrl: 'modules/cats/views/list-cats.client.view.html'
		}).
		state('createCat', {
			url: '/cats/create',
			templateUrl: 'modules/cats/views/create-cat.client.view.html'
		}).
		state('viewCat', {
			url: '/cats/:catId',
			templateUrl: 'modules/cats/views/view-cat.client.view.html'
		}).
		state('editCat', {
			url: '/cats/:catId/edit',
			templateUrl: 'modules/cats/views/edit-cat.client.view.html'
		});
	}
]);