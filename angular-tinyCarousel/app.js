/*global angular: false */
(function () {
    'use strict';

    angular.module('app', ['tinyCarousel'])
        .controller('mainCtrl', ['$scope', function ($scope) {

            $scope.items1 = [
                'picture1.jpg',
                'picture2.jpg',
                'picture3.jpg',
                'picture4.jpg',
                'picture5.jpg',
                'picture6.jpg',
                'picture7.jpg',
            ];

            $scope.items2 = [
                'picture1.jpg',
                'picture2.jpg',
                'picture3.jpg',
                'picture4.jpg',
                'picture5.jpg',
                'picture6.jpg',
                'picture7.jpg'
            ];
            
            $scope.items3 = [
                'picture1.jpg',
                'picture2.jpg',
                'picture3.jpg',
                'picture4.jpg',
                'picture5.jpg',
                'picture6.jpg',
                'picture7.jpg'
            ];

            $scope.carouselClicked = '';

            $scope.tinyCarousels = {

                'Carousel1': {
                    items: 'items1',
                    template: '<img ng-src="images/{{item}}">'
                },
                'Carousel2': {
                    items: 'items3',
                    template: '<img ng-src="images/{{item}}">'
                },
                'Carousel3': {
                    items: 'items3',
                    clickDisabled: false,
                    template: '<img ng-src="images/{{item}}">'
                }
            };

            $scope.$on('tinyCarousel:itemClicked', function (event, carouselID, item) {

                if (carouselID === 'Carousel1') {

                    $scope.carouselClicked = 'Carousel1 item ' + item + ' clicked!';

                } else if (carouselID === 'Carousel2') {

                    $scope.carouselClicked = 'Carousel2 item ' + item + ' clicked!';

                } else if (carouselID === 'Carousel3') {

                    $scope.carouselClicked = 'Carousel3 item ' + item + ' clicked!';
                }
            });
        }]);
}());