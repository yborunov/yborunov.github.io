/*jslint browser: true, nomen: true, unparam: true */
/*global angular: false, $: false, CONFIG: false */
(function () {
    'use strict';

    angular.module('tinyCarousel', [])
        .directive('tinyCarousel', ['$timeout', '$raf', function ($timeout, $raf) {

            return {
                templateUrl: 'tinycarousel.html',
                restrict: 'A',

                scope: {
                    tinycarousel: '='
                },

                link: function (scope, elem, attrs) {

                    var $el = angular.element(elem),
                        $viewport = $el.find('.viewport:first'),
                        $overview = $el.find('.overview:first'),
                        $buttonNext = $el.find('.next:first'),
                        $buttonPrev = $el.find('.prev:first'),

                        start,
                        update,
                        intervalTimer = null,
                        carouselData;

                    scope.carouselID = attrs.tinyCarousel;

                    scope.options = {
                        start: 0,           // The starting slide
                        axis: "x",          // vertical or horizontal scroller? ( x || y ).
                        buttons: true,      // show left and right navigation buttons.
                        bullets: false,     // is there a page number navigation present?
                        interval: false,    // move to another block on intervals.
                        intervalTime: 5000, // interval time in milliseconds.
                        animation: true,    // false is instant, true is animate.
                        animationTime: 500, // how fast must the animation move in ms?
                        infinite: true      // infinite carousel. 
                    };

                    scope.options.interval = attrs.tinyCarouselInterval !== undefined ? true : false;

                    scope.slidesVisible = 0;
                    scope.slideSize = 0;
                    scope.slideIndex = 0;
                    scope.isHorizontal = scope.options.axis === 'x';
                    scope.sizeLabel = scope.isHorizontal ? "Width" : "Height";
                    scope.posiLabel = scope.isHorizontal ? "left" : "top";

                    scope.slideCurrent = 0;

                    scope.carouselTemplate = '';
                    scope.carouselItems = [];
                    scope.carouselItemsMirrored = [];


                    start = function () {

                        if (scope.options.interval) {

                            clearTimeout(intervalTimer);

                            intervalTimer = setTimeout(function () {

                                scope.move((scope.slideIndex + 1));

                            }, scope.options.intervalTime);
                        }
                    };

                    scope.move = function (index) {

                        scope.$broadcast('tinyCarousel:move', index);

                        start();
                    };

                    scope.carouselItemClicked = function (item) {

                        scope.$parent.$broadcast('tinyCarousel:itemClicked', scope.carouselID, item);
                    };

                    update = function () {

                        $timeout(function () {

                            scope.carouselItemsMirrored = [];
                            
                            scope.$broadcast('tinyCarousel:update');

                            scope.move(0);
                        }, 1000);
                    }

                    scope.$watch(function () {
                        return scope.carouselItems;
                    }, function (newVal, oldVal) {

                        if (newVal !== oldVal) {

                            update();
                        }
                    });

                    scope.$on('tinyCarousel:update', function () {

                        var $slides = $overview.children(),
                            viewportOffset,
                            viewportSize;

                        viewportSize = scope.sizeLabel === "Width" ? $viewport.outerWidth(true) : $viewport.outerHeight(true);
                        viewportOffset = !isNaN(parseInt($viewport.css(scope.posiLabel), 10)) ? parseInt($viewport.css(scope.posiLabel), 10) * -1 : 0;

                        scope.slideSize = scope.sizeLabel === "Width" ? $slides.first().outerWidth(true) : $slides.first().outerHeight(true);
                        scope.slideCurrent = scope.options.start || 0;
                        scope.slidesVisible = Math.ceil((viewportSize + viewportOffset) / scope.slideSize);
                        
                        scope.carouselItemsMirrored = scope.carouselItems.slice(0, scope.slidesVisible);

                        $raf(function () {
                            $overview.css(scope.sizeLabel.toLowerCase(), scope.slideSize * (scope.carouselItems.length + scope.slidesVisible));
                            
                            if (scope.sizeLabel === 'Width') {
                                $viewport.css('height', $slides.first().outerHeight(true));
                            } else {
                                $viewport.css('width', $slides.first().outerWidth(true));
                            }
                        });
                    });

                    scope.$on('tinyCarousel:move', function (event, index) {

                        var contentStyle = {};

                        scope.slideIndex = index;
                        scope.slideCurrent = scope.slideIndex % scope.carouselItems.length;

                        if (scope.slideIndex < 0) {

                            scope.slideCurrent = scope.slideIndex = scope.carouselItems.length - 1;

                            $raf(function () {
                                $overview.css(scope.posiLabel, -(scope.carouselItems.length) * scope.slideSize);
                            });
                        }

                        if (scope.slideIndex > scope.carouselItems.length) {

                            scope.slideCurrent = scope.slideIndex = 1;

                            $raf(function () {
                                $overview.css(scope.posiLabel, 0);
                            });
                        }

                        contentStyle[scope.posiLabel] = -scope.slideIndex * scope.slideSize;

                        $raf(function () {

                            $overview.animate(contentStyle, {
                                queue: false,
                                duration: scope.options.animation ? scope.options.animationTime : 0
                            });
                        });
                    });

                    scope.$watch(function () {
                        return scope.slideIndex;
                    }, function () {

                        if (scope.options.buttons && !scope.options.infinite) {

                            $buttonPrev.toggleClass("disable", scope.slideCurrent <= 0);
                            $buttonNext.toggleClass("disable", scope.slideCurrent >= scope.carouselItems.length - scope.slidesVisible);
                        }

                        // if(self.options.bullets) {

                        //     $bullets.removeClass("active");
                        //     $($bullets[self.slideCurrent]).addClass("active");
                        // }
                    });


                    if (scope.$parent.tinyCarousels) {

                        if (scope.carouselID && scope.$parent.tinyCarousels[scope.carouselID]) {

                            carouselData = scope.$parent.tinyCarousels[scope.carouselID];

                            scope.carouselTemplate = carouselData.template || '';
                            scope.itemClickDisabled = carouselData.clickDisabled !== undefined ?
                                                        carouselData.clickDisabled : true;

                            scope.carouselItems = scope.$parent[carouselData.items];

                            update();
                            
                            scope.$watch(function () {
                                return scope.$parent[carouselData.items];
                            }, function (newVal) {
                                scope.carouselItems = newVal;
                            });
                        }
                    }
                }
            };
        }])

        /* RequestAnimationFrame implementation wrapped in Angular service */
        .factory('$raf', function () {

            return (function () {

                return window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.oRequestAnimationFrame      ||
                       window.msRequestAnimationFrame     ||
                    function (callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }());
        })
        
        .directive('compile', ['$compile', function ($compile) {
            return function (scope, element, attrs) {
                
                scope.$watch(function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);

                }, function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                });
            };
        }]);
}());