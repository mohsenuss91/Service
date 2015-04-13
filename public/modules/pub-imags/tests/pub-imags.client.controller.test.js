'use strict';

(function() {
	// Pub imags Controller Spec
	describe('Pub imags Controller Tests', function() {
		// Initialize global variables
		var PubImagsController,
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

			// Initialize the Pub imags controller.
			PubImagsController = $controller('PubImagsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pub imag object fetched from XHR', inject(function(PubImags) {
			// Create sample Pub imag using the Pub imags service
			var samplePubImag = new PubImags({
				name: 'New Pub imag'
			});

			// Create a sample Pub imags array that includes the new Pub imag
			var samplePubImags = [samplePubImag];

			// Set GET response
			$httpBackend.expectGET('pub-imags').respond(samplePubImags);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pubImags).toEqualData(samplePubImags);
		}));

		it('$scope.findOne() should create an array with one Pub imag object fetched from XHR using a pubImagId URL parameter', inject(function(PubImags) {
			// Define a sample Pub imag object
			var samplePubImag = new PubImags({
				name: 'New Pub imag'
			});

			// Set the URL parameter
			$stateParams.pubImagId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pub-imags\/([0-9a-fA-F]{24})$/).respond(samplePubImag);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pubImag).toEqualData(samplePubImag);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PubImags) {
			// Create a sample Pub imag object
			var samplePubImagPostData = new PubImags({
				name: 'New Pub imag'
			});

			// Create a sample Pub imag response
			var samplePubImagResponse = new PubImags({
				_id: '525cf20451979dea2c000001',
				name: 'New Pub imag'
			});

			// Fixture mock form input values
			scope.name = 'New Pub imag';

			// Set POST response
			$httpBackend.expectPOST('pub-imags', samplePubImagPostData).respond(samplePubImagResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pub imag was created
			expect($location.path()).toBe('/pub-imags/' + samplePubImagResponse._id);
		}));

		it('$scope.update() should update a valid Pub imag', inject(function(PubImags) {
			// Define a sample Pub imag put data
			var samplePubImagPutData = new PubImags({
				_id: '525cf20451979dea2c000001',
				name: 'New Pub imag'
			});

			// Mock Pub imag in scope
			scope.pubImag = samplePubImagPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pub-imags\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pub-imags/' + samplePubImagPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pubImagId and remove the Pub imag from the scope', inject(function(PubImags) {
			// Create new Pub imag object
			var samplePubImag = new PubImags({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pub imags array and include the Pub imag
			scope.pubImags = [samplePubImag];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pub-imags\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePubImag);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pubImags.length).toBe(0);
		}));
	});
}());