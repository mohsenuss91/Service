'use strict';

(function() {
	// Cours Controller Spec
	describe('Cours Controller Tests', function() {
		// Initialize global variables
		var CoursController,
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

			// Initialize the Cours controller.
			CoursController = $controller('CoursController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cour object fetched from XHR', inject(function(Cours) {
			// Create sample Cour using the Cours service
			var sampleCour = new Cours({
				name: 'New Cour'
			});

			// Create a sample Cours array that includes the new Cour
			var sampleCours = [sampleCour];

			// Set GET response
			$httpBackend.expectGET('cours').respond(sampleCours);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cours).toEqualData(sampleCours);
		}));

		it('$scope.findOne() should create an array with one Cour object fetched from XHR using a courId URL parameter', inject(function(Cours) {
			// Define a sample Cour object
			var sampleCour = new Cours({
				name: 'New Cour'
			});

			// Set the URL parameter
			$stateParams.courId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cours\/([0-9a-fA-F]{24})$/).respond(sampleCour);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cour).toEqualData(sampleCour);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cours) {
			// Create a sample Cour object
			var sampleCourPostData = new Cours({
				name: 'New Cour'
			});

			// Create a sample Cour response
			var sampleCourResponse = new Cours({
				_id: '525cf20451979dea2c000001',
				name: 'New Cour'
			});

			// Fixture mock form input values
			scope.name = 'New Cour';

			// Set POST response
			$httpBackend.expectPOST('cours', sampleCourPostData).respond(sampleCourResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cour was created
			expect($location.path()).toBe('/cours/' + sampleCourResponse._id);
		}));

		it('$scope.update() should update a valid Cour', inject(function(Cours) {
			// Define a sample Cour put data
			var sampleCourPutData = new Cours({
				_id: '525cf20451979dea2c000001',
				name: 'New Cour'
			});

			// Mock Cour in scope
			scope.cour = sampleCourPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cours\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cours/' + sampleCourPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid courId and remove the Cour from the scope', inject(function(Cours) {
			// Create new Cour object
			var sampleCour = new Cours({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Cours array and include the Cour
			scope.cours = [sampleCour];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cours\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCour);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cours.length).toBe(0);
		}));
	});
}());