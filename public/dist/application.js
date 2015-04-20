'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';


    

	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils','angularFileUpload'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contenus');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pub-imags');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pub-videos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('statuses');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('contenus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Contenus', 'contenus', 'dropdown', '/contenus(/create)?');
		Menus.addSubMenuItem('topbar', 'contenus', 'List Contenus', 'contenus');
		Menus.addSubMenuItem('topbar', 'contenus', 'New Contenu', 'contenus/create');
	}
]);
'use strict';

//Setting up route
angular.module('contenus').config(['$stateProvider',
	function($stateProvider) {
		// Contenus state routing
		$stateProvider.
		state('listContenus', {
			url: '/contenus',
			templateUrl: 'modules/contenus/views/list-contenus.client.view.html'
		}).
		state('createContenu', {
			url: '/contenus/create',
			templateUrl: 'modules/contenus/views/create-contenu.client.view.html'
		}).
		state('viewContenu', {
			url: '/contenus/:contenuId',
			templateUrl: 'modules/contenus/views/view-contenu.client.view.html'
		}).
		state('editContenu', {
			url: '/contenus/:contenuId/edit',
			templateUrl: 'modules/contenus/views/edit-contenu.client.view.html'
		});
	}
]);
'use strict';

// Contenus controller
angular.module('contenus').controller('ContenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contenus',
	function($scope, $stateParams, $location, Authentication, Contenus) {
		$scope.authentication = Authentication;

		// Create new Contenu
		$scope.create = function() {
			// Create new Contenu object
			var contenu = new Contenus ({
				name: this.name
			});

			// Redirect after save
			contenu.$save(function(response) {
				$location.path('contenus/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contenu
		$scope.remove = function(contenu) {
			if ( contenu ) { 
				contenu.$remove();

				for (var i in $scope.contenus) {
					if ($scope.contenus [i] === contenu) {
						$scope.contenus.splice(i, 1);
					}
				}
			} else {
				$scope.contenu.$remove(function() {
					$location.path('contenus');
				});
			}
		};

		// Update existing Contenu
		$scope.update = function() {
			var contenu = $scope.contenu;

			contenu.$update(function() {
				$location.path('contenus/' + contenu._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contenus
		$scope.find = function() {
			$scope.contenus = Contenus.query();
		};

		// Find existing Contenu
		$scope.findOne = function() {
			$scope.contenu = Contenus.get({ 
				contenuId: $stateParams.contenuId
			});
		};
	}
]);
'use strict';

//Contenus service used to communicate Contenus REST endpoints
angular.module('contenus').factory('Contenus', ['$resource',
	function($resource) {
		return $resource('contenus/:contenuId', { contenuId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('pub-imags').config(['$stateProvider',
	function($stateProvider) {
		// Pub imags state routing
		$stateProvider.
		state('listPubImags', {
			url: '/pub-imags',
			templateUrl: 'modules/pub-imags/views/list-pub-imags.client.view.html'
		}).
		state('createPubImag', {
			url: '/pub-imags/create',
			templateUrl: 'modules/pub-imags/views/create-pub-imag.client.view.html'
		}).
		state('viewPubImag', {
			url: '/pub-imags/:pubImagId',
			templateUrl: 'modules/pub-imags/views/view-pub-imag.client.view.html'
		}).
		state('editPubImag', {
			url: '/pub-imags/:pubImagId/edit',
			templateUrl: 'modules/pub-imags/views/edit-pub-imag.client.view.html'
		});
	}
]);
'use strict';

// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PubImags',
	function($scope, $stateParams, $location, Authentication, PubImags) {
		$scope.authentication = Authentication;

		// Create new Pub imag
		$scope.create = function() {
			// Create new Pub imag object
			var pubImag = new PubImags ({
                name:this.name,
                size: this.size,
                description:this.description
			});

			// Redirect after save
			pubImag.$save(function(response) {
				$location.path('pub-imags/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.size = '';
                $scope.description= '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pub imag
		$scope.remove = function(pubImag) {
			if ( pubImag ) {
				pubImag.$remove();

				for (var i in $scope.pubImags) {
					if ($scope.pubImags [i] === pubImag) {
						$scope.pubImags.splice(i, 1);
					}
				}
			} else {
				$scope.pubImag.$remove(function() {
					$location.path('pub-imags');
				});
			}
		};

		// Update existing Pub imag
		$scope.update = function() {
			var pubImag = $scope.pubImag;

			pubImag.$update(function() {
				$location.path('pub-imags/' + pubImag._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub imags
		$scope.find = function() {
			$scope.pubImags = PubImags.query();
		};

		// Find existing Pub imag
		$scope.findOne = function() {
			$scope.pubImag = PubImags.get({
				pubImagId: $stateParams.pubImagId
			});
		};
	}
]);


'use strict';

//Pub imags service used to communicate Pub imags REST endpoints
angular.module('pub-imags').factory('PubImags', ['$resource',
	function($resource) {
		return $resource('pub-imags/:pubImagId', {
            pubImagId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('pub-videos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pub videos', 'pub-videos', 'dropdown', '/pub-videos(/create)?');
		Menus.addSubMenuItem('topbar', 'pub-videos', 'List Pub videos', 'pub-videos');
		Menus.addSubMenuItem('topbar', 'pub-videos', 'New Pub video', 'pub-videos/create');
	}
]);
'use strict';

//Setting up route
angular.module('pub-videos').config(['$stateProvider',
	function($stateProvider) {
		// Pub videos state routing
		$stateProvider.
		state('listPubVideos', {
			url: '/pub-videos',
			templateUrl: 'modules/pub-videos/views/list-pub-videos.client.view.html'
		}).
		state('createPubVideo', {
			url: '/pub-videos/create',
			templateUrl: 'modules/pub-videos/views/create-pub-video.client.view.html'
		}).
		state('viewPubVideo', {
			url: '/pub-videos/:pubVideoId',
			templateUrl: 'modules/pub-videos/views/view-pub-video.client.view.html'
		}).
		state('editPubVideo', {
			url: '/pub-videos/:pubVideoId/edit',
			templateUrl: 'modules/pub-videos/views/edit-pub-video.client.view.html'
		});
	}
]);
'use strict';

// Pub videos controller
angular.module('pub-videos').controller('PubVideosController', ['$scope', '$stateParams', '$location', 'Authentication', 'PubVideos',
	function($scope, $stateParams, $location, Authentication, PubVideos) {
		$scope.authentication = Authentication;

        var video;
        $scope.load=function(){
            var allowedTypes = ['flv', 'mp4', 'mkv', 'avi']
            var fileInput = document.querySelector('#file');
            fileInput.onchange = function() {
                var imgType;
                imgType = fileInput.files[0].name.split('.');
                imgType = imgType[imgType.length - 1].toLowerCase();
                if(allowedTypes.indexOf(imgType) != -1) {
                    //
                    document.getElementById('namefile').value=fileInput.files[0].name;
                    var reader =new FileReader();
                    reader.onload = function () {
                        if(reader.readyState==2){
                            alert('done');
                        }
                        $('#containa_image').replaceWith('<video id="video" class="thumbnail"></video>');
                        document.getElementById('video').style.width = "200px";
                        document.getElementById('video').style.height = "200px";
                        document.getElementById('video').src = reader.result;
                        video = reader.result;
                    }
                    reader.readAsDataURL(fileInput.files[0]);
                    document.getElementById('error').innerHTML ="";
                    //
                }else{
                    document.getElementById('error').innerHTML ="le fichier n'est pas compatible";
                }
            };
        }
		// Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
				name: video,
                comment:this.comment
			});

			// Redirect after save
			pubVideo.$save(function(response) {
				$location.path('pub-videos/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.comment='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pub video
		$scope.remove = function(pubVideo) {
			if ( pubVideo ) { 
				pubVideo.$remove();

				for (var i in $scope.pubVideos) {
					if ($scope.pubVideos [i] === pubVideo) {
						$scope.pubVideos.splice(i, 1);
					}
				}
			} else {
				$scope.pubVideo.$remove(function() {
					$location.path('pub-videos');
				});
			}
		};

		// Update existing Pub video
		$scope.update = function() {
			var pubVideo = $scope.pubVideo;

			pubVideo.$update(function() {
				$location.path('pub-videos/' + pubVideo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub videos
		$scope.find = function() {
			$scope.pubVideos = PubVideos.query();
		};

		// Find existing Pub video
		$scope.findOne = function() {
			$scope.pubVideo = PubVideos.get({ 
				pubVideoId: $stateParams.pubVideoId
			});
		};
	}
]);

'use strict';

//Pub videos service used to communicate Pub videos REST endpoints
angular.module('pub-videos').factory('PubVideos', ['$resource',
	function($resource) {
		return $resource('pub-videos/:pubVideoId', { pubVideoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('statuses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Statuses', 'statuses', 'dropdown', '/statuses(/create)?');
		Menus.addSubMenuItem('topbar', 'statuses', 'List Statuses', 'statuses');
		Menus.addSubMenuItem('topbar', 'statuses', 'New Status', 'statuses/create');
	}
]);
'use strict';

//Setting up route
angular.module('statuses').config(['$stateProvider',
	function($stateProvider) {
		// Statuses state routing
		$stateProvider.
		state('listStatuses', {
			url: '/statuses',
			templateUrl: 'modules/statuses/views/list-statuses.client.view.html'
		}).
		state('createStatus', {
			url: '/statuses/create',
			templateUrl: 'modules/statuses/views/create-status.client.view.html'
		}).
		state('viewStatus', {
			url: '/statuses/:statusId',
			templateUrl: 'modules/statuses/views/view-status.client.view.html'
		}).
		state('editStatus', {
			url: '/statuses/:statusId/edit',
			templateUrl: 'modules/statuses/views/edit-status.client.view.html'
		});
	}
]);
'use strict';

// Statuses controller
angular.module('statuses').controller('StatusesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Statuses',
	function($scope, $stateParams, $location, Authentication, Statuses) {
		$scope.authentication = Authentication;

		// Create new Status
		$scope.create = function() {
			// Create new Status object
			var status = new Statuses ({
				name: this.name
			});

			// Redirect after save
			status.$save(function(response) {
				$location.path('statuses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Status
		$scope.remove = function(status) {
			if ( status ) { 
				status.$remove();

				for (var i in $scope.statuses) {
					if ($scope.statuses [i] === status) {
						$scope.statuses.splice(i, 1);
					}
				}
			} else {
				$scope.status.$remove(function() {
					$location.path('statuses');
				});
			}
		};

		// Update existing Status
		$scope.update = function() {
			var status = $scope.status;

			status.$update(function() {
				$location.path('statuses/' + status._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Statuses
		$scope.find = function() {
			$scope.statuses = Statuses.query();
		};

		// Find existing Status
		$scope.findOne = function() {
			$scope.status = Statuses.get({ 
				statusId: $stateParams.statusId
			});
		};
	}
]);
'use strict';

//Statuses service used to communicate Statuses REST endpoints
angular.module('statuses').factory('Statuses', ['$resource',
	function($resource) {
		return $resource('statuses/:statusId', { statusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window', function($window) {
	var auth = {
		user: $window.user
	};
	
	return auth;
}]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);