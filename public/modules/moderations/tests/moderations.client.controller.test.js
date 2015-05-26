'use strict';

(function() {
	// Moderations Controller Spec
	describe('Moderations Controller Tests', function() {
		// Initialize global variables
		var ModerationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our datas would fail because the test values would not match
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

			// Initialize the Moderations controller.
			ModerationsController = $controller('ModerationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Moderation object fetched from XHR', inject(function(Moderations) {
			// Create sample Moderation using the Moderations service
			var sampleModeration = new Moderations({
				name: 'New Moderation'
			});

			// Create a sample Moderations array that includes the new Moderation
			var sampleModerations = [sampleModeration];

			// Set GET response
			$httpBackend.expectGET('moderations').respond(sampleModerations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.moderations).toEqualData(sampleModerations);
		}));

		it('$scope.findOne() should create an array with one Moderation object fetched from XHR using a moderationId URL parameter', inject(function(Moderations) {
			// Define a sample Moderation object
			var sampleModeration = new Moderations({
				name: 'New Moderation'
			});

			// Set the URL parameter
			$stateParams.moderationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/moderations\/([0-9a-fA-F]{24})$/).respond(sampleModeration);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.moderation).toEqualData(sampleModeration);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Moderations) {
			// Create a sample Moderation object
			var sampleModerationPostData = new Moderations({
				name: 'New Moderation'
			});

			// Create a sample Moderation response
			var sampleModerationResponse = new Moderations({
				_id: '525cf20451979dea2c000001',
				name: 'New Moderation'
			});

			// Fixture mock form input values
			scope.name = 'New Moderation';

			// Set POST response
			$httpBackend.expectPOST('moderations', sampleModerationPostData).respond(sampleModerationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Moderation was created
			expect($location.path()).toBe('/moderations/' + sampleModerationResponse._id);
		}));

		it('$scope.update() should update a valid Moderation', inject(function(Moderations) {
			// Define a sample Moderation put data
			var sampleModerationPutData = new Moderations({
				_id: '525cf20451979dea2c000001',
				name: 'New Moderation'
			});

			// Mock Moderation in scope
			scope.moderation = sampleModerationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/moderations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/moderations/' + sampleModerationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid moderationId and remove the Moderation from the scope', inject(function(Moderations) {
			// Create new Moderation object
			var sampleModeration = new Moderations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Moderations array and include the Moderation
			scope.moderations = [sampleModeration];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/moderations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleModeration);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.moderations.length).toBe(0);
		}));
	});
}());
