'use strict';

// Configuring the Articles module
angular.module('cats').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cats', 'cats');
		
	}
]);