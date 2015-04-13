'use strict';

(function() {
	// Pub videos Controller Spec
	describe('Pub videos Controller Tests', function() {
		// Initialize global variables
		var PubVideosController,
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

			// Initialize the Pub videos controller.
			PubVideosController = $controller('PubVideosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pub video object fetched from XHR', inject(function(PubVideos) {
			// Create sample Pub video using the Pub videos service
			var samplePubVideo = new PubVideos({
				name: 'New Pub video'
			});

			// Create a sample Pub videos array that includes the new Pub video
			var samplePubVideos = [samplePubVideo];

			// Set GET response
			$httpBackend.expectGET('pub-videos').respond(samplePubVideos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pubVideos).toEqualData(samplePubVideos);
		}));

		it('$scope.findOne() should create an array with one Pub video object fetched from XHR using a pubVideoId URL parameter', inject(function(PubVideos) {
			// Define a sample Pub video object
			var samplePubVideo = new PubVideos({
				name: 'New Pub video'
			});

			// Set the URL parameter
			$stateParams.pubVideoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pub-videos\/([0-9a-fA-F]{24})$/).respond(samplePubVideo);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pubVideo).toEqualData(samplePubVideo);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PubVideos) {
			// Create a sample Pub video object
			var samplePubVideoPostData = new PubVideos({
				name: 'New Pub video'
			});

			// Create a sample Pub video response
			var samplePubVideoResponse = new PubVideos({
				_id: '525cf20451979dea2c000001',
				name: 'New Pub video'
			});

			// Fixture mock form input values
			scope.name = 'New Pub video';

			// Set POST response
			$httpBackend.expectPOST('pub-videos', samplePubVideoPostData).respond(samplePubVideoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pub video was created
			expect($location.path()).toBe('/pub-videos/' + samplePubVideoResponse._id);
		}));

		it('$scope.update() should update a valid Pub video', inject(function(PubVideos) {
			// Define a sample Pub video put data
			var samplePubVideoPutData = new PubVideos({
				_id: '525cf20451979dea2c000001',
				name: 'New Pub video'
			});

			// Mock Pub video in scope
			scope.pubVideo = samplePubVideoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pub-videos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pub-videos/' + samplePubVideoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pubVideoId and remove the Pub video from the scope', inject(function(PubVideos) {
			// Create new Pub video object
			var samplePubVideo = new PubVideos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pub videos array and include the Pub video
			scope.pubVideos = [samplePubVideo];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pub-videos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePubVideo);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pubVideos.length).toBe(0);
		}));
	});
}());