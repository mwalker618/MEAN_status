'use strict';

// Configuring the Articles module
angular.module('messages').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Inbox', 'messages');
		
	}
]);