'use strict';

//Setting up route
angular.module('searches').config(['$stateProvider',
	function($stateProvider) {
		// Searches state routing
		$stateProvider.
		state('listSearches', {
			url: '/searches',
			templateUrl: 'modules/searches/views/list-searches.client.view.html'
		}).
		state('createSearch', {
			url: '/searches/create',
			templateUrl: 'modules/searches/views/create-search.client.view.html'
		}).
		state('viewSearch', {
			url: '/searches/:searchId',
			templateUrl: 'modules/searches/views/view-search.client.view.html'
		}).
		state('editSearch', {
			url: '/searches/:searchId/edit',
			templateUrl: 'modules/searches/views/edit-search.client.view.html'
		});
	}
]);