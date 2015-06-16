// Contenus controller
angular.module('contenus').controller('ContenusController', ['$scope', '$rootScope','$stateParams', '$location', 'Authentication', 'Contenus',
	function($scope,$rootScope, $stateParams, $location, Authentication, Contenus) {
		$scope.authentication = Authentication;
		$scope.navbar = 'status';
		$scope.predicate = 'created';
		$scope.predicateInv = false;

		$rootScope.tags = [];
		// Create new Contenu
		$scope.create = function() {
			console.log('dkhal create');
			// Create new Contenu object
			var contenu = new Contenus ({
				name: this.name,
				tags: this.tags
			});
			console.log(this.tags);
			console.log(contenu);
			// Redirect after save
			contenu.$save(function(response) {
				console.log('zadha');
				$scope.contenus.push(response);
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
			$rootScope.contenus = Contenus.query();
		};

		$rootScope.autoComplete= function(){
			var auto =[];
			$rootScope.contenus.forEach(function (item) {
					item.tags.forEach(function (tag){
						var matches = auto.some(function (tags) {
							var logique =  (tags.text.indexOf(tag.text) > -1)
							//console.log(item.text + '=' + tag.text);
							return logique ;
						});
						if (!matches) auto.push(tag);
					});

				}
			);
			//console.log(auto);
			return auto;
		};

		// Find existing Contenu
		$scope.findOne = function() {
			$scope.contenu = Contenus.get({ 
				contenuId: $stateParams.contenuId
			});
		};

		//Appliquer le filtre
		$scope.filterByTag =  function (items) {
			var filter = true;
			//console.log(items.tags);
			($rootScope.tags || []).forEach(function (item) {
				var matches = items.tags.some(function (tag) {
					var logique =  (item.text.indexOf(tag.text) > -1)
					//console.log(item.text + '=' + tag.text);
					return logique ;
				});
				if (!matches) {
					//console.log(item.text + ': Miss match');
					filter = false;
				}
			});
			return filter;
		};
	}
]);
