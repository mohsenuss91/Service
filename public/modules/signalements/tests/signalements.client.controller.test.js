'use strict';

(function() {
	// Signalements Controller Spec
	describe('Signalements Controller Tests', function() {
		// Initialize global variables
		var SignalementsController,
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

			// Initialize the Signalements controller.
			SignalementsController = $controller('SignalementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Signalement object fetched from XHR', inject(function(Signalements) {
			// Create sample Signalement using the Signalements service
			var sampleSignalement = new Signalements({
				name: 'New Signalement'
			});

			// Create a sample Signalements array that includes the new Signalement
			var sampleSignalements = [sampleSignalement];

			// Set GET response
			$httpBackend.expectGET('signalements').respond(sampleSignalements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.signalements).toEqualData(sampleSignalements);
		}));

		it('$scope.findOne() should create an array with one Signalement object fetched from XHR using a signalementId URL parameter', inject(function(Signalements) {
			// Define a sample Signalement object
			var sampleSignalement = new Signalements({
				name: 'New Signalement'
			});

			// Set the URL parameter
			$stateParams.signalementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/signalements\/([0-9a-fA-F]{24})$/).respond(sampleSignalement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.signalement).toEqualData(sampleSignalement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Signalements) {
			// Create a sample Signalement object
			var sampleSignalementPostData = new Signalements({
				name: 'New Signalement'
			});

			// Create a sample Signalement response
			var sampleSignalementResponse = new Signalements({
				_id: '525cf20451979dea2c000001',
				name: 'New Signalement'
			});

			// Fixture mock form input values
			scope.name = 'New Signalement';

			// Set POST response
			$httpBackend.expectPOST('signalements', sampleSignalementPostData).respond(sampleSignalementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Signalement was created
			expect($location.path()).toBe('/signalements/' + sampleSignalementResponse._id);
		}));

		it('$scope.update() should update a valid Signalement', inject(function(Signalements) {
			// Define a sample Signalement put data
			var sampleSignalementPutData = new Signalements({
				_id: '525cf20451979dea2c000001',
				name: 'New Signalement'
			});

			// Mock Signalement in scope
			scope.signalement = sampleSignalementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/signalements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/signalements/' + sampleSignalementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid signalementId and remove the Signalement from the scope', inject(function(Signalements) {
			// Create new Signalement object
			var sampleSignalement = new Signalements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Signalements array and include the Signalement
			scope.signalements = [sampleSignalement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/signalements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSignalement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.signalements.length).toBe(0);
		}));
	});
}());