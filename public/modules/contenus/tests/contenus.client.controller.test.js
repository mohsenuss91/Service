'use strict';

(function() {
	// Contenus Controller Spec
	describe('Contenus Controller Tests', function() {
		// Initialize global variables
		var ContenusController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Contenus controller.
			ContenusController = $controller('ContenusController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Contenu object fetched from XHR', inject(function(Contenus) {
			// Create sample Contenu using the Contenus service
			var sampleContenu = new Contenus({
				name: 'New Contenu'
			});

			// Create a sample Contenus array that includes the new Contenu
			var sampleContenus = [sampleContenu];

			// Set GET response
			$httpBackend.expectGET('contenus').respond(sampleContenus);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contenus).toEqualData(sampleContenus);
		}));

		it('$scope.findOne() should create an array with one Contenu object fetched from XHR using a contenuId URL parameter', inject(function(Contenus) {
			// Define a sample Contenu object
			var sampleContenu = new Contenus({
				name: 'New Contenu'
			});

			// Set the URL parameter
			$stateParams.contenuId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/contenus\/([0-9a-fA-F]{24})$/).respond(sampleContenu);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contenu).toEqualData(sampleContenu);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Contenus) {
			// Create a sample Contenu object
			var sampleContenuPostData = new Contenus({
				name: 'New Contenu'
			});

			// Create a sample Contenu response
			var sampleContenuResponse = new Contenus({
				_id: '525cf20451979dea2c000001',
				name: 'New Contenu'
			});

			// Fixture mock form input values
			scope.name = 'New Contenu';

			// Set POST response
			$httpBackend.expectPOST('contenus', sampleContenuPostData).respond(sampleContenuResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Contenu was created
			expect($location.path()).toBe('/contenus/' + sampleContenuResponse._id);
		}));

		it('$scope.update() should update a valid Contenu', inject(function(Contenus) {
			// Define a sample Contenu put data
			var sampleContenuPutData = new Contenus({
				_id: '525cf20451979dea2c000001',
				name: 'New Contenu'
			});

			// Mock Contenu in scope
			scope.contenu = sampleContenuPutData;

			// Set PUT response
			$httpBackend.expectPUT(/contenus\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/contenus/' + sampleContenuPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid contenuId and remove the Contenu from the scope', inject(function(Contenus) {
			// Create new Contenu object
			var sampleContenu = new Contenus({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Contenus array and include the Contenu
			scope.contenus = [sampleContenu];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/contenus\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleContenu);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.contenus.length).toBe(0);
		}));
	});
}());