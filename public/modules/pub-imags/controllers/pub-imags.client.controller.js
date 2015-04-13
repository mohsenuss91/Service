'use strict';

// Pub imags controller
angular.module('pub-imags').controller('PubImagsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PubImags',
	function($scope, $stateParams, $location, Authentication, PubImags) {
		$scope.authentication = Authentication;

        //recuperer image
        var image;
        $scope.load=function(){
            var fileInput = document.querySelector('#file');
            var reader =new FileReader();
            fileInput.onchange = function() {
                document.getElementById('namefile').value=fileInput.files[0].name;
                reader.onload=function(){
                    document.getElementById('image').style.width="242px";
                    document.getElementById('image').style.height="200px";
                    document.getElementById('image').src=reader.result;
                    image=reader.result;
                }
                reader.readAsDataURL(fileInput.files[0]);
            };
        }
		// Create new Pub imag

		$scope.create = function() {

			// Create new Pub imag object
			var pubImag = new PubImags ({
                name:image,
                comment:this.comment
			});

			// Redirect after save
			pubImag.$save(function(response) {
				$location.path('pub-imags/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pub imag
		$scope.remove = function(pubImag) {
			if ( pubImag ) {
				pubImag.$remove();

				for (var i in $scope.pubImags) {
					if ($scope.pubImags [i] === pubImag) {
						$scope.pubImags.splice(i, 1);
					}
				}
			} else {
				$scope.pubImag.$remove(function() {
					$location.path('pub-imags');
				});
			}
		};

		// Update existing Pub imag
		$scope.update = function() {
			var pubImag = $scope.pubImag;

			pubImag.$update(function() {
				$location.path('pub-imags/' + pubImag._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pub imags
		$scope.find = function() {
			$scope.pubImags = PubImags.query();
		};

		// Find existing Pub imag
		$scope.findOne = function() {
			$scope.pubImag = PubImags.get({
				pubImagId: $stateParams.pubImagId
			});
		};
	}
]);

/*var xmlHttp=createXmlHttpRequestObject();

function createXmlHttpRequestObject(){

}

function process(){
    if(xmlHttp.readyState == 0 || xmlHttp.readyState == 4){
        xmlHttp.open('GET','',true);
        xmlHttp.onreadystatechange = handleServerResponse;
        xmlHttp.send(null);
    }else{
        setTimeout('process()',1000);
    }
}

function handleServerResponse(){
    if(xmlHttp.readyState == 4){
        if(xmlHttp.status == 200){
                setTimeout('process()',1000);
        }else{
            alert('something went wrong ???');
        }
    }
}


*/
