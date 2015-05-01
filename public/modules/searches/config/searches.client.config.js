'use strict';

// Configuring the Articles module
angular.module('searches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Searches', 'searches', 'dropdown', '/searches(/create)?');
		Menus.addSubMenuItem('topbar', 'searches', 'List Searches', 'searches');
		Menus.addSubMenuItem('topbar', 'searches', 'New Search', 'searches/create');
	}
]);