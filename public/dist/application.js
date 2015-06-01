'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';


	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

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

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('affectations');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('comments');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contenus');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cours');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dataImages');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dataVideos');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('emploies');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('evenements');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('likes');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('moderations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('notifications');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('offres');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('pub-contenus');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pub-imags');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pub-videos');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('signalements');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('statuses');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('affectations').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        //Menus.addMenuItem('y', 'Affectations', 'affectations', 'dropdown', '/affectations(/create)?');
        //Menus.addSubMenuItem('y', 'affectations', 'List Affectations', 'affectations');
        //Menus.addSubMenuItem('y', 'affectations', 'New Affectation', 'affectations/create');
    }
]);

'use strict';

//Setting up route
angular.module('affectations').config(['$stateProvider',
    function ($stateProvider) {
        // Affectations state routing
        $stateProvider.
            state('listAffectations', {
                url: '/affectations',
                templateUrl: 'modules/affectations/views/list-affectations.client.view.html'
            }).
            state('createAffectation', {
                url: '/affectations/create',
                templateUrl: 'modules/affectations/views/create-affectation.client.view.html'
            }).
            state('viewAffectation', {
                url: '/affectations/:affectationId',
                templateUrl: 'modules/affectations/views/view-affectation.client.view.html'
            }).
            state('editAffectation', {
                url: '/affectations/:affectationId/edit',
                templateUrl: 'modules/affectations/views/edit-affectation.client.view.html'
            });
    }
]);

'use strict';

// Affectations controller
angular.module('affectations').controller('AffectationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Affectations',
    function ($scope, $stateParams, $location, Authentication, Affectations) {
        $scope.authentication = Authentication;

        // Create new Affectation
        $scope.create = function () {
            // Create new Affectation object
            var affectation = new Affectations({
                name: this.name
            });

            // Redirect after save
            affectation.$save(function (response) {
                $location.path('affectations/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Affectation
        $scope.remove = function (affectation) {
            if (affectation) {
                affectation.$remove();

                for (var i in $scope.affectations) {
                    if ($scope.affectations [i] === affectation) {
                        $scope.affectations.splice(i, 1);
                    }
                }
            } else {
                $scope.affectation.$remove(function () {
                    $location.path('affectations');
                });
            }
        };

        // Update existing Affectation
        $scope.update = function () {
            var affectation = $scope.affectation;

            affectation.$update(function () {
                $location.path('affectations/' + affectation._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Affectations
        $scope.find = function () {
            $scope.affectations = Affectations.query();
        };

        // Find existing Affectation
        $scope.findOne = function () {
            $scope.affectation = Affectations.get({
                affectationId: $stateParams.affectationId
            });
        };
    }
]);

'use strict';

//Affectations service used to communicate Affectations REST endpoints
angular.module('affectations').factory('Affectations', ['$resource',
    function ($resource) {
        return $resource('affectations/:affectationId', {
            affectationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {

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
angular.module('categories').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
         Menus.addSubMenuItem('y', 'categories', 'List Categories', 'categories');
         Menus.addSubMenuItem('y', 'categories', 'New Categorie', 'categories/create');*/
    }
]);

'use strict';

//Setting up route
angular.module('categories').config(['$stateProvider',
    function ($stateProvider) {
        // Categories state routing
        $stateProvider.
            state('listCategories', {
                url: '/categories',
                templateUrl: 'modules/categories/views/list-categories.client.view.html'
            }).
            state('createCategorie', {
                url: '/categories/create',
                templateUrl: 'modules/categories/views/create-categorie.client.view.html'
            }).
            state('viewCategorie', {
                url: '/categories/:categorieId',
                templateUrl: 'modules/categories/views/view-categorie.client.view.html'
            }).
            state('editCategorie', {
                url: '/categories/:categorieId/edit',
                templateUrl: 'modules/categories/views/edit-categorie.client.view.html'
            });
    }
]);

'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
    function ($scope, $stateParams, $location, Authentication, Categories) {
        $scope.authentication = Authentication;

        // Create new Categorie
        $scope.create = function () {
            // Create new Categorie object
            var categorie = new Categories({
                name: this.name
            });

            // Redirect after save
            categorie.$save(function (response) {
                $location.path('categories/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Categorie
        $scope.remove = function (categorie) {
            if (categorie) {
                categorie.$remove();

                for (var i in $scope.categories) {
                    if ($scope.categories [i] === categorie) {
                        $scope.categories.splice(i, 1);
                    }
                }
            } else {
                $scope.categorie.$remove(function () {
                    $location.path('categories');
                });
            }
        };

        // Update existing Categorie
        $scope.update = function () {
            var categorie = $scope.categorie;

            categorie.$update(function () {
                $location.path('categories/' + categorie._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Categories
        $scope.find = function () {
            $scope.categories = Categories.query();
        };

        // Find existing Categorie
        $scope.findOne = function () {
            $scope.categorie = Categories.get({
                categorieId: $stateParams.categorieId
            });
        };
    }
]);

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
    function ($resource) {
        return $resource('categories/:categorieId', {
            categorieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('comments').run(['Menus',
    function (Menus) {
        // Set top bar menu items
    }
]);

'use strict';

//Setting up route
angular.module('comments').config(['$stateProvider',
    function ($stateProvider) {
        // Comments state routing
        $stateProvider.
            state('listComments', {
                url: '/comments',
                templateUrl: 'modules/comments/views/list-comments.client.view.html'
            }).
            state('createComment', {
                url: '/comments/create',
                templateUrl: 'modules/comments/views/create-comment.client.view.html'
            }).
            state('viewComment', {
                url: '/comments/:commentId',
                templateUrl: 'modules/comments/views/view-comment.client.view.html'
            }).
            state('editComment', {
                url: '/comments/:commentId/edit',
                templateUrl: 'modules/comments/views/edit-comment.client.view.html'
            });
    }
]);

'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Comments',
    function ($scope, $http, $stateParams, $location, Authentication, Comments) {
        $scope.authentication = Authentication;

        // Create new Comment
        this.createCommentContenu = function (contenu) {
            // Create new Comment object
            var comment = new Comments({
                name: $scope.name
            });

            console.log("commentaire a �t� " + contenu._id);

            // Redirect after save
            comment.$save({contenuId: contenu._id},
                function (response) {
                    //$location.path('contenues/' + contenu._id);

                    // Clear form fields
                    $scope.name = '';

                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            this.find(contenu);
        };

        // Remove existing Comment
        this.removeCommentContenu = function (contenu, comment) {
            $http.delete("/contenus/" + contenu._id + "/comments/" + comment._id).success(function (response) {
                //console.log("confirme demande de suppression delete		" + response.comment._id);
            });
            //console.log("confirme demande de suppression delete		" + response._id + "   " + $scope.commentsList.length);
            this.find(contenu);
        };

        // Update existing Comment
        this.updateCommentContenu = function (contenu, comment) {
            var newComment = comment;
            //console.log("comment  " + comment.name);
            $http.put('contenus/' + contenu._id + '/comments/' + comment._id, newComment)
                .success(function (response) {
                    console.log("comment  " + response.name + " updated");
                });
        };

        // Find a list of Comments
        this.find = function (contenu) {
            $http.get('contenus/' + contenu._id + '/comments/')
                .success(function (response) {
                    console.log("i got the data contactList  " + response.length);
                    $scope.commentsList = response;
                });
        };

        // Find existing Comment
        $scope.findOne = function () {
            $scope.comment = Comments.get({
                commentId: $stateParams.commentId
            });
        };
    }
]);

'use strict';

//Comments service used to communicate Comments REST endpoints
angular.module('comments').factory('Comments', ['$resource',
    function ($resource) {
        return $resource('contenus/:contenuId/comments/:commentId', {
                contenuId: '@contenuId', commentId: '@_id'
            },
            {
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
		Menus.addMenuItem('topbar', 'Contenus', 'contenus', 'icon-ship-wheel', '/contenus(/create)?');
		Menus.addMenuItem('topbar', 'Images', 'pub-imags', 'fa fa-picture-o', '/pub-imags(/create)?');
		Menus.addMenuItem('topbar', 'Videos', 'pub-videos', 'fa fa-group', '/pub-videos(/create)?');
		Menus.addMenuItem('topbar', 'Offres', 'offres', 'icon-user-1', '/offres(/create)?');
		Menus.addMenuItem('topbar', 'Evenements', 'evenements', 'icon-comment-fill-1', '/evenements(/create)?');
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
angular.module('contenus').controller('ContenusController', ['$scope', '$stateParams', '$location', 'Authentication','ngTagsInput', 'Contenus',
	function($scope, $stateParams, $location, Authentication, Contenus) {
		$scope.authentication = Authentication;

		// Create new Contenu
		$scope.create = function() {
			// Create new Contenu object
			var contenu = new Contenus ({
				name: this.name,
				tags: this.tags
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


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menus',
	function ($scope, Authentication, Menus) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function () {
			$scope.isCollapsed = false;
		});
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

// Configuring the Articles module
angular.module('cours').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Cours', 'cours', 'dropdown', '/cours(/create)?');
         Menus.addSubMenuItem('y', 'cours', 'List Cours', 'cours');
         Menus.addSubMenuItem('y', 'cours', 'New Cour', 'cours/create');
         */
    }
]);

'use strict';

//Setting up route
angular.module('cours').config(['$stateProvider',
    function ($stateProvider) {
        // Cours state routing
        $stateProvider.
            state('listCours', {
                url: '/cours',
                templateUrl: 'modules/cours/views/list-cours.client.view.html'
            }).
            state('createCour', {
                url: '/cours/create',
                templateUrl: 'modules/cours/views/create-cour.client.view.html'
            }).
            state('viewCour', {
                url: '/cours/:courId',
                templateUrl: 'modules/cours/views/view-cour.client.view.html'
            }).
            state('editCour', {
                url: '/cours/:courId/edit',
                templateUrl: 'modules/cours/views/edit-cour.client.view.html'
            });
    }
]);

'use strict';

// Cours controller
angular.module('cours').controller('CoursController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cours',
    function ($scope, $stateParams, $location, Authentication, Cours) {
        $scope.authentication = Authentication;

        // Create new Cour
        $scope.create = function () {
            // Create new Cour object
            var cour = new Cours({
                name: this.name
            });

            // Redirect after save
            cour.$save(function (response) {
                $location.path('cours/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Cour
        $scope.remove = function (cour) {
            if (cour) {
                cour.$remove();

                for (var i in $scope.cours) {
                    if ($scope.cours [i] === cour) {
                        $scope.cours.splice(i, 1);
                    }
                }
            } else {
                $scope.cour.$remove(function () {
                    $location.path('cours');
                });
            }
        };

        // Update existing Cour
        $scope.update = function () {
            var cour = $scope.cour;

            cour.$update(function () {
                $location.path('cours/' + cour._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Cours
        $scope.find = function () {
            $scope.cours = Cours.query();
        };

        // Find existing Cour
        $scope.findOne = function () {
            $scope.cour = Cours.get({
                courId: $stateParams.courId
            });
        };
    }
]);

'use strict';

//Cours service used to communicate Cours REST endpoints
angular.module('cours').factory('Cours', ['$resource',
    function ($resource) {
        return $resource('cours/:courId', {
            courId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

//Tests service used to communicate Tests REST endpoints
angular.module('dataImages').factory('DataImages', ['$resource',
	function($resource) {
		return $resource('dataImages/:dataImageId', { testId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Tests service used to communicate Tests REST endpoints
angular.module('dataVideos').factory('DataVideos', ['$resource',
	function($resource) {
		return $resource('dataVideos/:dataVideoId', { testId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('emploies').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Emploies', 'emploies', 'dropdown', '/emploies(/create)?');
         Menus.addSubMenuItem('y', 'emploies', 'List Emploies', 'emploies');
         Menus.addSubMenuItem('y', 'emploies', 'New Emploie', 'emploies/create');
         */
    }
]);

'use strict';

//Setting up route
angular.module('emploies').config(['$stateProvider',
    function ($stateProvider) {
        // Emploies state routing
        $stateProvider.
            state('listEmploies', {
                url: '/emploies',
                templateUrl: 'modules/emploies/views/list-emploies.client.view.html'
            }).
            state('createEmploie', {
                url: '/emploies/create',
                templateUrl: 'modules/emploies/views/create-emploie.client.view.html'
            }).
            state('viewEmploie', {
                url: '/emploies/:emploieId',
                templateUrl: 'modules/emploies/views/view-emploie.client.view.html'
            }).
            state('editEmploie', {
                url: '/emploies/:emploieId/edit',
                templateUrl: 'modules/emploies/views/edit-emploie.client.view.html'
            });
    }
]);

'use strict';

// Emploies controller
angular.module('emploies').controller('EmploiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Emploies',
    function ($scope, $stateParams, $location, Authentication, Emploies) {
        $scope.authentication = Authentication;

        // Create new Emploie
        $scope.create = function () {
            // Create new Emploie object
            var emploie = new Emploies({
                name: this.name
            });

            // Redirect after save
            emploie.$save(function (response) {
                $location.path('emploies/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Emploie
        $scope.remove = function (emploie) {
            if (emploie) {
                emploie.$remove();

                for (var i in $scope.emploies) {
                    if ($scope.emploies [i] === emploie) {
                        $scope.emploies.splice(i, 1);
                    }
                }
            } else {
                $scope.emploie.$remove(function () {
                    $location.path('emploies');
                });
            }
        };

        // Update existing Emploie
        $scope.update = function () {
            var emploie = $scope.emploie;

            emploie.$update(function () {
                $location.path('emploies/' + emploie._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Emploies
        $scope.find = function () {
            $scope.emploies = Emploies.query();
        };

        // Find existing Emploie
        $scope.findOne = function () {
            $scope.emploie = Emploies.get({
                emploieId: $stateParams.emploieId
            });
        };
    }
]);

'use strict';

//Emploies service used to communicate Emploies REST endpoints
angular.module('emploies').factory('Emploies', ['$resource',
    function ($resource) {
        return $resource('emploies/:emploieId', {
            emploieId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('evenements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('y', 'Evenements', 'evenements', 'dropdown', '/evenements(/create)?');
		Menus.addSubMenuItem('y', 'evenements', 'List Evenements', 'evenements');
		Menus.addSubMenuItem('y', 'evenements', 'New Evenement', 'evenements/create');
	*/}
]);

'use strict';

//Setting up route
angular.module('evenements').config(['$stateProvider',
	function($stateProvider) {
		// Evenements state routing
		$stateProvider.
		state('listEvenements', {
			url: '/evenements',
			templateUrl: 'modules/evenements/views/list-evenements.client.view.html'
		}).
		state('createEvenement', {
			url: '/evenements/create',
			templateUrl: 'modules/evenements/views/create-evenement.client.view.html'
		}).
		state('viewEvenement', {
			url: '/evenements/:evenementId',
			templateUrl: 'modules/evenements/views/view-evenement.client.view.html'
		}).
		state('editEvenement', {
			url: '/evenements/:evenementId/edit',
			templateUrl: 'modules/evenements/views/edit-evenement.client.view.html'
		});
	}
]);
'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Evenements','$modal', '$log', '$http',
	function($scope, $http, $stateParams, $location, Authentication, Evenements, $modal, $log) {
        $scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/evenements/views/create-evenement.client.view.html',
                controller: ["$scope", "$modalInstance", "parentScope", function ($scope, $modalInstance, parentScope) {
                    // Create new Evenement
                    $scope.create = function() {
                        $scope.dt.setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0)
                        //console.log("yow yow dt "+$scope.dt);

                        // Create new Evenement object
                        var evenement = new Evenements ({
                            titre: $scope.newEventTitle,
                            description: $scope.newEventDescription,
                            date: $scope.dt,
                            lieu : $scope.newEventPlace
                        });

                        // Redirect after save
                        evenement.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            parentScope.find();
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    };

                    ///////////////////////////////////////////////
                    $scope.today = function() {
                        $scope.dt = new Date();
                    };
                    $scope.today();
                    $scope.clear = function () {
                        $scope.dt = null;
                    };
                    // Disable weekend selection
                    $scope.disabled = function(date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 5 ) );
                    };
                    $scope.toggleMin = function() {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();
                    $scope.open = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope.opened = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[0];
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    var afterTomorrow = new Date();
                    afterTomorrow.setDate(tomorrow.getDate() + 2);
                    $scope.events =
                        [
                            {
                                date: tomorrow,
                                status: 'full'
                            },
                            {
                                date: afterTomorrow,
                                status: 'partially'
                            }
                        ];
                    $scope.getDayClass = function(date, mode) {
                        if (mode === 'day') {
                            var dayToCheck = new Date(date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                            for (var i=0;i<$scope.events.length;i++){
                                var currentDay = new Date($scope.events[i].date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                                if (dayToCheck === currentDay) {
                                    return $scope.events[i].status;
                                }
                            }
                        }
                        return '';
                    };
                    ///////////////////////////////////////////////////////////////

                    $scope.mytime = new Date();

                    $scope.hstep = 1;
                    $scope.mstep = 15;

                    $scope.options = {
                        hstep: [1, 2, 3],
                        mstep: [1, 5, 10, 15, 25, 30]
                    };

                    $scope.ismeridian = true;
                    $scope.toggleMode = function() {
                        $scope.ismeridian = ! $scope.ismeridian;
                    };
                    $scope.update = function() {
                        var d = new Date();
                        d.setHours( 14 );
                        d.setMinutes( 0 );
                        $scope.mytime = d;
                    };
                    $scope.clear = function() {
                        $scope.mytime = null;
                    };
                    $scope.ok = function () {
                        //console.log("yow yow from EvenementsController.ok()");
                        $scope.create();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],

                size: size,
                resolve: {
                    evenement: function () {
                        return $scope.evenement;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

        // Open a modal window to update a single event record
        this.modalUpdate = function(size, selectedEvent){
            console.log("yow yow from modalUpdate");
            /*$scope.mytime = new Date();
            $scope.mytime.setHours( selectedEvent.date.getHours());
            $scope.mytime.setMinutes(selectedEvent.date.getMinutes());*/
            var modalInstance = $modal.open({
                templateUrl:'modules/evenements/views/edit-evenement.client.view.html',
                controller: ["$scope", "$modalInstance", "evenement", function($scope, $modalInstance, evenement) {
                    $scope.evenement = evenement;

                    $scope.ok = function () {
                            modalInstance.close($scope.evenement);
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    evenement: function(){
                        return selectedEvent;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (){
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        // Find a list of Evenements
        $scope.find = this.find = function() {
                $http.get('evenements/')
                    .success(function (response) {
                        console.log("i got the data contactList  " + response.length);
                        $scope.evenementsList = response;
                        //$scope.nbreComments = $scope.commentsList.length;
                    });
            //console.log(" lenght of evenements list "+Evenements.query().length);
        };

        // Remove existing Evenement
        this.remove = function(contenu) {
            $http.delete("/evenements/" + contenu.evenement._id).success(function (response) {
                $scope.find();
                //console.log("confirme demande de suppression		" + response.comment._id);
            });
        };

        // Find existing Evenement
        $scope.findOne = function() {
            $scope.evenement = Evenements.get({
                evenementId: $stateParams.evenementId
            });
        };
    }]);

angular.module('evenements').controller('EvenementsUpdateController', ['$scope', 'Evenements',
    function($scope, Evenements) {

        // Update existing Evenement
        this.update = function(updatedEvent) {
            var evenement = updatedEvent;
            evenement.date.getsetHours(updatedEvent.mytime.getHours(),updatedEvent.mytime.getMinutes(),0,0);

/*
            console.log("updating of evenement "+evenement._id+" date "+evenement.date);
            $http.put('evenements/' + evenement._id, newComment)
                .success(function (response) {
                    console.log("date  " + response.date + " updated");
                });
            /*evenement.$update(function() {
                //$location.path('evenements/' + evenement._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });*/
        };

        ///////////////////////////////////////////////
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 5 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours($scope.mytime.getHours(),$scope.mytime.getMinutes(),0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        };
        ///////////////////////////////////////////////////////////////

        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
    }
]);

'use strict';

//Evenements service used to communicate Evenements REST endpoints
angular.module('evenements')
    .factory('Evenements', ['$resource', function($resource) {
		return $resource('evenements/:evenementId', { evenementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);

'use strict';

// Configuring the Articles module
angular.module('likes').run(['Menus',
    function (Menus) {
        // Set top bar menu items
    }
]);

'use strict';

//Setting up route
angular.module('likes').config(['$stateProvider',
    function ($stateProvider) {
        // Likes state routing
        $stateProvider.
            state('listLikes', {
                url: '/likes',
                templateUrl: 'modules/likes/views/list-likes.client.view.html'
            }).
            state('createLike', {
                url: '/likes/create',
                templateUrl: 'modules/likes/views/create-like.client.view.html'
            }).
            state('viewLike', {
                url: '/likes/:likeId',
                templateUrl: 'modules/likes/views/view-like.client.view.html'
            }).
            state('editLike', {
                url: '/likes/:likeId/edit',
                templateUrl: 'modules/likes/views/edit-like.client.view.html'
            });
    }
]);

'use strict';

// Likes controller
angular.module('likes').controller('LikesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Likes',
    function ($scope, $http, $stateParams, $location, Authentication, Likes) {
        $scope.authentication = Authentication;

        // Create new Like
        this.createLikeContenu = function (contenu) {
            // Create new Like object
            var like = new Likes({
                contenu: contenu._id
            });

            like.$save({contenuId: contenu._id},
                function (response) {
                    response.user = $scope.authentication.user;
                    $scope.likesList.push(response);
                    listLike();
                    $scope.aime = true;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }
            );
        };

        // Remove existing Like
        this.removeLikeContenu = function (contenu) {
            //console.log("like delete		" + contenu._id);
            $http.delete("contenus/" + contenu._id + "/likes/").success(function (response) {
                $scope.likesList.pop($scope.rank);
                listLike();
                $scope.aime = false;
                //console.log("confirme demande de suppression delete		" + response.comment._id);
            });
        };

        // Update existing Like
        $scope.update = function () {
            var like = $scope.like;

            like.$update(function () {
                $location.path('likes/' + like._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Likes
        this.find = function (contenu) {
            $http.get('contenus/' + contenu._id + '/likes/')
                .success(function (response) {
                    //console.log("i got the data likesList  " + response.length);
                    $scope.likesList = response;
                    listLike(response);
                });
            //$scope.likes = Likes.query();
        };

        // Find existing Like
        $scope.findOne = function () {
            $scope.like = Likes.get({
                likeId: $stateParams.likeId
            });
        };
        function listLike() {
            var like;
            //console.log(" nember of likes for contenu ");
            var i;
            $scope.list = "";
            for (i = 0; i < $scope.likesList.length; i++) {
                if ($scope.authentication.user._id == $scope.likesList[i].user._id) {
                    $scope.rank = i;
                    $scope.list += "Vous, ";
                    $scope.aime = true;
                } else
                    $scope.list += $scope.likesList[i].user.displayName + ", ";

            }
        }
    }
]);

'use strict';

//Likes service used to communicate Likes REST endpoints
angular.module('likes').factory('Likes', ['$resource',
    function ($resource) {
        return $resource('contenus/:contenuId/likes/:likeId', {
                contenuId: '@contenuId', likeId: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('moderations').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Moderations', 'moderations', 'dropdown', '/moderations(/create)?');
         Menus.addSubMenuItem('y', 'moderations', 'List Moderations', 'moderations');
         Menus.addSubMenuItem('y', 'moderations', 'New Moderation', 'moderations/create');
         */
    }
]);

'use strict';

//Setting up route
angular.module('moderations').config(['$stateProvider',
    function ($stateProvider) {
        // Moderations state routing
        $stateProvider.
            state('listModerations', {
                url: '/moderations',
                templateUrl: 'modules/moderations/views/list-moderations.client.view.html'
            }).
            state('createModeration', {
                url: '/moderations/create',
                templateUrl: 'modules/moderations/views/create-moderation.client.view.html'
            }).
            state('viewModeration', {
                url: '/moderations/:moderationId',
                templateUrl: 'modules/moderations/views/view-moderation.client.view.html'
            }).
            state('editModeration', {
                url: '/moderations/:moderationId/edit',
                templateUrl: 'modules/moderations/views/edit-moderation.client.view.html'
            });
    }
]);

'use strict';

// Moderations controller
angular.module('moderations').controller('ModerationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Moderations',
    function ($scope, $stateParams, $location, Authentication, Moderations) {
        $scope.authentication = Authentication;

        // Create new Moderation
        $scope.create = function () {
            // Create new Moderation object
            var moderation = new Moderations({
                name: this.name
            });

            // Redirect after save
            moderation.$save(function (response) {
                $location.path('moderations/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Moderation
        $scope.remove = function (moderation) {
            if (moderation) {
                moderation.$remove();

                for (var i in $scope.moderations) {
                    if ($scope.moderations [i] === moderation) {
                        $scope.moderations.splice(i, 1);
                    }
                }
            } else {
                $scope.moderation.$remove(function () {
                    $location.path('moderations');
                });
            }
        };

        // Update existing Moderation
        $scope.update = function () {
            var moderation = $scope.moderation;

            moderation.$update(function () {
                $location.path('moderations/' + moderation._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Moderations
        $scope.find = function () {
            $scope.moderations = Moderations.query();
        };

        // Find existing Moderation
        $scope.findOne = function () {
            $scope.moderation = Moderations.get({
                moderationId: $stateParams.moderationId
            });
        };
    }
]);

'use strict';

//Moderations service used to communicate Moderations REST endpoints
angular.module('moderations').factory('Moderations', ['$resource',
    function ($resource) {
        return $resource('moderations/:moderationId', {
            moderationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('notifications').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Notifications', 'notifications', 'dropdown', '/notifications(/create)?');
         Menus.addSubMenuItem('y', 'notifications', 'List Notifications', 'notifications');
         Menus.addSubMenuItem('y', 'notifications', 'New Notification', 'notifications/create');
         */
    }
]);

'use strict';

//Setting up route
angular.module('notifications').config(['$stateProvider',
    function ($stateProvider) {
        // Notifications state routing
        $stateProvider.
            state('listNotifications', {
                url: '/notifications',
                templateUrl: 'modules/notifications/views/list-notifications.client.view.html'
            }).
            state('createNotification', {
                url: '/notifications/create',
                templateUrl: 'modules/notifications/views/create-notification.client.view.html'
            }).
            state('viewNotification', {
                url: '/notifications/:notificationId',
                templateUrl: 'modules/notifications/views/view-notification.client.view.html'
            }).
            state('editNotification', {
                url: '/notifications/:notificationId/edit',
                templateUrl: 'modules/notifications/views/edit-notification.client.view.html'
            });
    }
]);

'use strict';

// Notifications controller
angular.module('notifications').controller('NotificationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notifications',
    function ($scope, $stateParams, $location, Authentication, Notifications) {
        $scope.authentication = Authentication;

        // Create new Notification
        $scope.create = function () {
            // Create new Notification object
            var notification = new Notifications({
                name: this.name
            });

            // Redirect after save
            notification.$save(function (response) {
                $location.path('notifications/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Notification
        $scope.remove = function (notification) {
            if (notification) {
                notification.$remove();

                for (var i in $scope.notifications) {
                    if ($scope.notifications [i] === notification) {
                        $scope.notifications.splice(i, 1);
                    }
                }
            } else {
                $scope.notification.$remove(function () {
                    $location.path('notifications');
                });
            }
        };

        // Update existing Notification
        $scope.update = function () {
            var notification = $scope.notification;

            notification.$update(function () {
                $location.path('notifications/' + notification._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Notifications
        $scope.find = function () {
            $scope.notifications = Notifications.query();
        };

        // Find existing Notification
        $scope.findOne = function () {
            $scope.notification = Notifications.get({
                notificationId: $stateParams.notificationId
            });
        };
    }
]);

'use strict';

//Notifications service used to communicate Notifications REST endpoints
angular.module('notifications').factory('Notifications', ['$resource',
    function ($resource) {
        return $resource('notifications/:notificationId', {
            notificationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Configuring the Articles module
angular.module('offres').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('y', 'Offres', 'offres', 'dropdown', '/offres(/create)?');
		Menus.addSubMenuItem('y', 'offres', 'List Offres', 'offres');
		Menus.addSubMenuItem('y', 'offres', 'New Offre', 'offres/create');
	*/}
]);

'use strict';

//Setting up route
angular.module('offres').config(['$stateProvider',
	function($stateProvider) {
		// Offres state routing
		$stateProvider.
		state('listOffres', {
			url: '/offres',
			templateUrl: 'modules/offres/views/list-offres.client.view.html'
		}).
		state('createOffre', {
			url: '/offres/create',
			templateUrl: 'modules/offres/views/create-offre.client.view.html'
		}).
		state('viewOffre', {
			url: '/offres/:offreId',
			templateUrl: 'modules/offres/views/view-offre.client.view.html'
		}).
		state('editOffre', {
			url: '/offres/:offreId/edit',
			templateUrl: 'modules/offres/views/edit-offre.client.view.html'
		});
	}
]);
'use strict';

// Offres controller
angular.module('offres').controller('OffresController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Offres','$modal', '$log', '$http',
    function($scope, $http, $stateParams, $location, Authentication, Offres, $modal, $log) {
        $scope.authentication = Authentication;

        this.modalCreate = function (size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modules/offres/views/create-offre.client.view.html',
                controller: ["$scope", "$modalInstance", "parentScope", function ($scope, $modalInstance, parentScope) {
                    $scope.create = function() {
                        // Create new Evenement object
                        console.log(entreprise);
                        var offre = new Offres ({
                            entreprise: $scope.entreprise,
                            post: $scope.poste,
                            competences: $scope.listCompetence,
                            documents :$scope.listDocument
                        });

                        // Redirect after save
                        offre.$save(function(response) {
                            //console.log("yow yow event has been created ");
                            parentScope.find();
                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    };

                    $scope.ok = function () {
                        $scope.create();
                        modalInstance.close();
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    offre: function () {
                        return $scope.offre;
                    },
                    parentScope:function(){
                        return $scope;
                    }
                }
            });
        };

        // Open a modal window to update a single event record
        this.modalUpdate = function(size, selectedOffre){
            //console.log("yow yow from modalUpdate");
            var modalInstance = $modal.open({
                templateUrl:'modules/offres/views/edit-offre.client.view.html',
                controller: ["$scope", "$modalInstance", "offre", function($scope, $modalInstance, offre) {
                    $scope.offre = offre;

                    $scope.ok = function () {
                        modalInstance.close($scope.offre);
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    offre: function(){
                        return selectedOffre;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function (){
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        // Find a list of Evenements
        $scope.find = this.find = function() {
            $http.get('offres/')
                .success(function (response) {
                    //console.log("i got the data offresList  " + response.length);
                    $scope.offresList = response;
                    //$scope.nbreComments = $scope.commentsList.length;
                });
        };

        // Remove existing Evenement
        this.remove = function(contenu) {
            $http.delete("/offres/" + contenu.offre._id).success(function (response) {
                $scope.find();
                //console.log("confirme demande de suppression		" + response.comment._id);
            });
        };

        // Find existing Evenement
        $scope.findOne = function() {
            $scope.offre = Evenements.get({
                offreId: $stateParams.offreId
            });
        };
    }]);


angular.module('offres').controller('OffresUpdateController', ['$scope', 'Offres', '$http',
    function($scope, Offres, $http) {

        // Update existing Evenement
        this.update = function(updatedOffre) {
            var offre = updatedOffre;
             //console.log("updating of evenement "+offre.competences);
             $http.put('offres/' + offre._id, offre)
             .success(function (response) {

             });
        };
    }
]);

'use strict';

//Offres service used to communicate Offres REST endpoints
angular.module('offres').factory('Offres', ['$resource',
	function($resource) {
		return $resource('offres/:offreId', { offreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('pub-contenus').config(['$stateProvider',
    function ($stateProvider) {
        // Pub contenus state routing
        $stateProvider.
            state('pub-contenu', {
                url: '/pub-contenu',
                templateUrl: 'modules/pub-contenus/views/pub-contenu.client.view.html'
            });
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
angular.module('pub-imags').controller('PubImagsController', ['$scope','$upload','$stateParams','$location', 'Authentication', 'PubImags','DataImages',
    function($scope,$upload,$stateParams,$location,Authentication, PubImags,DataImages) {
		$scope.authentication = Authentication;

        $scope.image_data_thumbnail = "/images/260x180.png";
        $scope.upload = function(files) {
            if (files && files.length) {
                var file = files[0];
                $upload.upload({
                    method:'POST',
                    url:'/pub-imags/create',
                    file: file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    document.getElementById('bar1').style.width= progressPercentage+"%";
                }).success(function(data, status, headers, config) {
                    $scope.originalFile = data.originalFile;
                    $scope.image_data_thumbnail = data.data;
                    $scope.image_data_type = data.typeData;
                });
            }
        };

        // Create new Pub imag
		$scope.create = function() {
			// Create new Pub imag object
			var pubImag = new PubImags ({
                id_file_original: this.originalFile._id,
                image_data_thumbnail:this.image_data_thumbnail,
                typeImage: this.image_data_type,
                description: this.description
			});
            // Redirect after save
			pubImag.$save(function(response) {
				//$location.path('/pub-imags/'+response._id);
				// Clear form fields
                document.getElementById('bar1').style.width= "0%";
                $scope.find();
                $scope.image_data = "/images/260x180.png";
                $scope.image_data_type="";
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
					$location.path('pub-imags/create');
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
            $scope.dataImageUrl = DataImages.get({
                dataImageId: $stateParams.pubImagId
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
angular.module('pub-videos').controller('PubVideosController', ['$scope','$upload', '$stateParams', '$location', 'Authentication', 'PubVideos','DataVideos',
	function($scope,$upload,$stateParams, $location, Authentication, PubVideos, DataVideos) {
		$scope.authentication = Authentication;

        $scope.upload = function(files) {
            if (files && files.length) {
                var file = files[0];
                $upload.upload({
                    method:'POST',
                    url:'/pub-videos/create',
                    file:file
                }).progress(function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    document.getElementById('bar1').style.width= progressPercentage+"%";
                }).success(function(data, status, headers, config) {

                });
            }
        };

        // Create new Pub video
		$scope.create = function() {
			// Create new Pub video object
			var pubVideo = new PubVideos ({
                id_file_video: this.file._id,
                description: this.description
            });

			// Redirect after save
			pubVideo.$save(function(response) {
                document.getElementById('bar1').style.width="0%";
                $scope.find();
                $scope.description= '';
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
					$location.path('pub-videos/create');
                    $scope.find();
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
angular.module('signalements').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        /*Menus.addMenuItem('y', 'Signalements', 'signalements', 'dropdown', '/signalements(/create)?');
         Menus.addSubMenuItem('y', 'signalements', 'List Signalements', 'signalements');
         Menus.addSubMenuItem('y', 'signalements', 'New Signalement', 'signalements/create');
         */
    }
]);

'use strict';

//Setting up route
angular.module('signalements').config(['$stateProvider',
    function ($stateProvider) {
        // Signalements state routing
        $stateProvider.
            state('listSignalements', {
                url: '/signalements',
                templateUrl: 'modules/signalements/views/list-signalements.client.view.html'
            }).
            state('createSignalement', {
                url: '/signalements/create',
                templateUrl: 'modules/signalements/views/create-signalement.client.view.html'
            }).
            state('viewSignalement', {
                url: '/signalements/:signalementId',
                templateUrl: 'modules/signalements/views/view-signalement.client.view.html'
            }).
            state('editSignalement', {
                url: '/signalements/:signalementId/edit',
                templateUrl: 'modules/signalements/views/edit-signalement.client.view.html'
            });
    }
]);

'use strict';

// Signalements controller
angular.module('signalements').controller('SignalementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Signalements',
    function ($scope, $stateParams, $location, Authentication, Signalements) {
        $scope.authentication = Authentication;

        // Create new Signalement
        $scope.create = function () {
            // Create new Signalement object
            var signalement = new Signalements({
                name: this.name
            });

            // Redirect after save
            signalement.$save(function (response) {
                $location.path('signalements/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Signalement
        $scope.remove = function (signalement) {
            if (signalement) {
                signalement.$remove();

                for (var i in $scope.signalements) {
                    if ($scope.signalements [i] === signalement) {
                        $scope.signalements.splice(i, 1);
                    }
                }
            } else {
                $scope.signalement.$remove(function () {
                    $location.path('signalements');
                });
            }
        };

        // Update existing Signalement
        $scope.update = function () {
            var signalement = $scope.signalement;

            signalement.$update(function () {
                $location.path('signalements/' + signalement._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Signalements
        $scope.find = function () {
            $scope.signalements = Signalements.query();
        };

        // Find existing Signalement
        $scope.findOne = function () {
            $scope.signalement = Signalements.get({
                signalementId: $stateParams.signalementId
            });
        };
    }
]);

'use strict';

//Signalements service used to communicate Signalements REST endpoints
angular.module('signalements').factory('Signalements', ['$resource',
    function ($resource) {
        return $resource('signalements/:signalementId', {
            signalementId: '@_id'
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
angular.module('statuses').controller('StatusesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Statuses',
	function ($scope, $http, $stateParams, $location, Authentication, Statuses) {
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
			//$http.get('statuses/');
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
		return $resource('statuses/:statusId',
			{statusId: '@_id'}, {
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