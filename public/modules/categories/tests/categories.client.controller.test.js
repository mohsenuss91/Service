'use strict';

(function () {
    // Categories Controller Spec
    describe('Categories Controller Tests', function () {
        // Initialize global variables
        var CategoriesController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
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
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Categories controller.
            CategoriesController = $controller('CategoriesController', {
                $scope: scope
            });
        }));

        it('$scope.find() should create an array with at least one Categorie object fetched from XHR', inject(function (Categories) {
            // Create sample Categorie using the Categories service
            var sampleCategorie = new Categories({
                name: 'New Categorie'
            });

            // Create a sample Categories array that includes the new Categorie
            var sampleCategories = [sampleCategorie];

            // Set GET response
            $httpBackend.expectGET('categories').respond(sampleCategories);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.categories).toEqualData(sampleCategories);
        }));

        it('$scope.findOne() should create an array with one Categorie object fetched from XHR using a categorieId URL parameter', inject(function (Categories) {
            // Define a sample Categorie object
            var sampleCategorie = new Categories({
                name: 'New Categorie'
            });

            // Set the URL parameter
            $stateParams.categorieId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/categories\/([0-9a-fA-F]{24})$/).respond(sampleCategorie);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.categorie).toEqualData(sampleCategorie);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Categories) {
            // Create a sample Categorie object
            var sampleCategoriePostData = new Categories({
                name: 'New Categorie'
            });

            // Create a sample Categorie response
            var sampleCategorieResponse = new Categories({
                _id: '525cf20451979dea2c000001',
                name: 'New Categorie'
            });

            // Fixture mock form input values
            scope.name = 'New Categorie';

            // Set POST response
            $httpBackend.expectPOST('categories', sampleCategoriePostData).respond(sampleCategorieResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Categorie was created
            expect($location.path()).toBe('/categories/' + sampleCategorieResponse._id);
        }));

        it('$scope.update() should update a valid Categorie', inject(function (Categories) {
            // Define a sample Categorie put data
            var sampleCategoriePutData = new Categories({
                _id: '525cf20451979dea2c000001',
                name: 'New Categorie'
            });

            // Mock Categorie in scope
            scope.categorie = sampleCategoriePutData;

            // Set PUT response
            $httpBackend.expectPUT(/categories\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/categories/' + sampleCategoriePutData._id);
        }));

        it('$scope.remove() should send a DELETE request with a valid categorieId and remove the Categorie from the scope', inject(function (Categories) {
            // Create new Categorie object
            var sampleCategorie = new Categories({
                _id: '525a8422f6d0f87f0e407a33'
            });

            // Create new Categories array and include the Categorie
            scope.categories = [sampleCategorie];

            // Set expected DELETE response
            $httpBackend.expectDELETE(/categories\/([0-9a-fA-F]{24})$/).respond(204);

            // Run controller functionality
            scope.remove(sampleCategorie);
            $httpBackend.flush();

            // Test array after successful delete
            expect(scope.categories.length).toBe(0);
        }));
    });
}());
