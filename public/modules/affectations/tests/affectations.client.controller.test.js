'use strict';

(function() {
	// Affectations Controller Spec
	describe('Affectations Controller Tests', function() {
		// Initialize global variables
		var AffectationsController,
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

			// Initialize the Affectations controller.
			AffectationsController = $controller('AffectationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Affectation object fetched from XHR', inject(function(Affectations) {
			// Create sample Affectation using the Affectations service
			var sampleAffectation = new Affectations({
				name: 'New Affectation'
			});

			// Create a sample Affectations array that includes the new Affectation
			var sampleAffectations = [sampleAffectation];

			// Set GET response
			$httpBackend.expectGET('affectations').respond(sampleAffectations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.affectations).toEqualData(sampleAffectations);
		}));

		it('$scope.findOne() should create an array with one Affectation object fetched from XHR using a affectationId URL parameter', inject(function(Affectations) {
			// Define a sample Affectation object
			var sampleAffectation = new Affectations({
				name: 'New Affectation'
			});

			// Set the URL parameter
			$stateParams.affectationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/affectations\/([0-9a-fA-F]{24})$/).respond(sampleAffectation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.affectation).toEqualData(sampleAffectation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Affectations) {
			// Create a sample Affectation object
			var sampleAffectationPostData = new Affectations({
				name: 'New Affectation'
			});

			// Create a sample Affectation response
			var sampleAffectationResponse = new Affectations({
				_id: '525cf20451979dea2c000001',
				name: 'New Affectation'
			});

			// Fixture mock form input values
			scope.name = 'New Affectation';

			// Set POST response
			$httpBackend.expectPOST('affectations', sampleAffectationPostData).respond(sampleAffectationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Affectation was created
			expect($location.path()).toBe('/affectations/' + sampleAffectationResponse._id);
		}));

		it('$scope.update() should update a valid Affectation', inject(function(Affectations) {
			// Define a sample Affectation put data
			var sampleAffectationPutData = new Affectations({
				_id: '525cf20451979dea2c000001',
				name: 'New Affectation'
			});

			// Mock Affectation in scope
			scope.affectation = sampleAffectationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/affectations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/affectations/' + sampleAffectationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid affectationId and remove the Affectation from the scope', inject(function(Affectations) {
			// Create new Affectation object
			var sampleAffectation = new Affectations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Affectations array and include the Affectation
			scope.affectations = [sampleAffectation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/affectations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAffectation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.affectations.length).toBe(0);
		}));
	});
}());