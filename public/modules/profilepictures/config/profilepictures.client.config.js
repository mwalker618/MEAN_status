'use strict';

// Configuring the Articles module
angular.module('profilepictures').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Profilepictures', 'profilepictures', 'dropdown', '/profilepictures(/create)?');
		Menus.addSubMenuItem('topbar', 'profilepictures', 'List Profilepictures', 'profilepictures');
		Menus.addSubMenuItem('topbar', 'profilepictures', 'New Profilepicture', 'profilepictures/create');
	}
]);