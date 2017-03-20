var app = angular.module('MainDirective', []);

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('dynamicModel', ['$compile', '$parse', function($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function(scope, elem) {
            var name = $parse(elem.attr('dynamic-model'))(scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
    };
}]);

app.directive('position', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var svg, group, groupBounds, svgBounds, padding, image, text, slogan, rand, rect, monoText, trueGroup, monogram, groupPosX, groupPosY;
            var truths = $scope.userOptions.icon_location.text_icon_left + $scope.userOptions.icon_location.text_icon_right + $scope.userOptions.icon_location.text_icon_above + $scope.userOptions.icon_location.text_logo;
            $scope.$watch(element, function() {
                setTimeout(function() {
                    svg = element[0];
                    rect = angular.element(element[0]).children()[0];
                    group = angular.element(element[0]).children()[1];
                    monogram = angular.element(element[0]).children()[2];
                    monoText = monogram.children[0].children[1];
                    svgBounds = svg.getBBox();
                    groupBounds = group.getBBox();
                    padding = 20;
                    image = group.children[0];
                    text = group.children[1];
                    slogan = group.children[2];

                    var imageX = image.getBBox().x;
                    var textX = text.getBBox().x;

                    var textWidth = text.getBBox().width;
                    var imageWidth = image.getBBox().width;

                    var imagegap = textWidth + padding;
                    var textgap = imageWidth + padding;
                    var listOfText = [];
                    if (truths >= 2) {
                        rand = Math.floor(Math.random() * 4) + 1;
                        for (var prop in $scope.userOptions.icon_location) {
                            if (prop != "text_icon_logo") {
                                if ($scope.userOptions.icon_location[prop]) {
                                    listOfText.push(prop);
                                }
                            }
                        }
                        var trigger = listOfText[Math.floor(Math.random() * listOfText.length)];
                        console.log(image.getBoundingClientRect().width);
                        console.log(text.getBoundingClientRect().width);
                        console.log(padding);
                        switch (trigger) {
                            case "text_icon_left":
                                text_icon_left();
                                break;
                            case "text_icon_right":
                                text_icon_right();
                                break;
                            case "text_icon_above":
                                text_icon_above();
                                break;
                            case "text_logo":
                                text_logo();
                                break;
                        }
                    } else {
                        if ($scope.userOptions.icon_location.text_icon_left) {
                            text_icon_left();
                        } else if ($scope.userOptions.icon_location.text_icon_right) {
                            text_icon_right()
                        } else if ($scope.userOptions.icon_location.text_icon_above) {
                            text_icon_above()
                        } else if ($scope.userOptions.icon_location.text_logo) {
                            text_logo()
                        }
                    }

                    function text_icon_left() {
                        trueGroup = textgap + textWidth + imageWidth;
                        monogram.remove();
                        groupPosX = (svgBounds.width - trueGroup) / 2;
                        groupPosY = ((svgBounds.height - groupBounds.height) / 2) - groupBounds.height / 3
                        text.setAttribute("x", textgap);
                        svg.setAttribute("type", "text_icon_left");
                    }

                    function text_icon_right() {
                        trueGroup = textgap + textWidth + imageWidth;
                        monogram.remove();
                        groupPosX = (svgBounds.width - trueGroup) / 2;
                        groupPosY = ((svgBounds.height - groupBounds.height) / 2) - groupBounds.height / 3
                        image.setAttribute("x", imagegap);
                        svg.setAttribute("type", "text_icon_right");
                    }

                    function text_icon_above() {
                        trueGroup = groupBounds.width;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
                        groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        monogram.remove();

                        text.setAttribute("y", 30);
                        slogan.setAttribute("y", 50);
                        image.setAttribute("y", -70);
                        image.setAttribute("x", ((groupBounds.width - imageWidth) / 2) - imageX);
                        svg.setAttribute("type", "text_icon_above");
                    }

                    function text_logo() {
                        var chance = Math.floor(Math.random() * 4) + 1;
                        if (chance === 1) {
                            groupPosY = (svgBounds.height - groupBounds.height) / 2;
                            var monox = (svgBounds.width - monogram.getBBox().width) / 2;
                            monogram.setAttribute("transform", "translate(" + monox + "," + ((groupPosY - groupBounds.y) - 80) + ")");
                            monoText.setAttribute("x", 17);
                            groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        } else {
                            monogram.remove();
                            groupPosY = ((svgBounds.height - groupBounds.height) / 2) - groupBounds.height / 3;
                        }
                        console.log(chance);

                        // image.remove();
                        trueGroup = groupBounds.width;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
                        svg.setAttribute("type", "text_logo");
                    }

                    self.colorArray = ["#ff7473", "#fdb813", "#288feb", "#47b8e0", "#34314c",
                        "#519D9E", "#ff5f2e", "#004e66"
                    ]
                    self.logoColor = function(item) {
                        if (item == "bg") {
                            if ($scope.preColors) {
                                return $scope.backgroundColor;
                            } else {
                                return self.colorArray[Math.floor(Math.random() * self.colorArray.length) + 0];
                            }
                        } else {
                            if ($scope.preColors) {
                                return $scope.textColor;
                            } else {
                                return "#fff";
                            }
                        }
                    }

                    rect.setAttribute("fill", self.logoColor("bg"));
                    // svg.setAttribute("fill", self.logoColor("bg"));
                    // rect.setAttribute("fill", "url(#rgrad)");
                    // $('.logo').append('<radialGradient id="rgrad" cx="50%" cy="50%" r="75%" >\
                    //     <stop offset="0%" style="stop-color:'+ LightenDarkenColor(self.logoColor("bg"), 20) +';stop-opacity:1" />\
                    //     <stop offset="100%" style="stop-color:' + self.logoColor("bg") + ';stop-opacity:1" />\
                    //     </radialGradient>');

                    group.setAttribute("fill", self.logoColor("text"));

                    var dx = groupPosX;
                    var dy = groupPosY - groupBounds.y;
                    console.log(groupPosY);
                    text.setAttribute("x", (groupBounds.width - textWidth) / 2);
                    group.setAttribute("transform", "translate(" + dx + "," + dy + ")");
                    slogan.setAttribute("x", (trueGroup - slogan.getBBox().width) / 2);
                }, 200);
            });
        }
    };
});
