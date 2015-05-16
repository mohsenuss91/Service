'use strict';

(function() {
	// Emploies Controller Spec
	describe('Emploies Controller Tests', function() {
		// Initialize global variables
		var EmploiesController,
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

			// Initialize the Emploies controller.
			EmploiesController = $controller('EmploiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Emploie object fetched from XHR', inject(function(Emploies) {
			// Create sample Emploie using the Emploies service
			var sampleEmploie = new Emploies({
				name: 'New Emploie'
			});

			// Create a sample Emploies array that includes the new Emploie
			var sampleEmploies = [sampleEmploie];

			// Set GET response
			$httpBackend.expectGET('emploies').respond(sampleEmploies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emploies).toEqualData(sampleEmploies);
		}));

		it('$scope.findOne() should create an array with one Emploie object fetched from XHR using a emploieId URL parameter', inject(function(Emploies) {
			// Define a sample Emploie object
			var sampleEmploie = new Emploies({
				name: 'New Emploie'
			});

			// Set the URL parameter
			$stateParams.emploieId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/emploies\/([0-9a-fA-F]{24})$/).respond(sampleEmploie);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emploie).toEqualData(sampleEmploie);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Emploies) {
			// Create a sample Emploie object
			var sampleEmploiePostData = new Emploies({
				name: 'New Emploie'
			});

			// Create a sample Emploie response
			var sampleEmploieResponse = new Emploies({
				_id: '525cf20451979dea2c000001',
				name: 'New Emploie'
			});

			// Fixture mock form input values
			scope.name = 'New Emploie';

			// Set POST response
			$httpBackend.expectPOST('emploies', sampleEmploiePostData).respond(sampleEmploieResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Emploie was created
			expect($location.path()).toBe('/emploies/' + sampleEmploieResponse._id);
		}));

		it('$scope.update() should update a valid Emploie', inject(function(Emploies) {
			// Define a sample Emploie put data
			var sampleEmploiePutData = new Emploies({
				_id: '525cf20451979dea2c000001',
				name: 'New Emploie'
			});

			// Mock Emploie in scope
			scope.emploie = sampleEmploiePutData;

			// Set PUT response
			$httpBackend.expectPUT(/emploies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/emploies/' + sampleEmploiePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid emploieId and remove the Emploie from the scope', inject(function(Emploies) {
			// Create new Emploie object
			var sampleEmploie = new Emploies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Emploies array and include the Emploie
			scope.emploies = [sampleEmploie];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/emploies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmploie);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.emploies.length).toBe(0);
		}));
	});
}());