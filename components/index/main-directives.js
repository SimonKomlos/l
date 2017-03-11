var app = angular.module('MainDirective', []);

app.directive('position', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var svg, group, groupBounds, svgBounds, padding, image, text, rand, trueGroup, groupPosX, groupPosY;
            var truths = $scope.userOptions.icon_location.text_icon_left + $scope.userOptions.icon_location.text_icon_right + $scope.userOptions.icon_location.text_icon_above + $scope.userOptions.icon_location.text_logo;
            $scope.$watch(element, function() {
                setTimeout(function() {
                    svg = element[0];
                    group = angular.element(element[0]).children()[1];
                    svgBounds = element[0].getBoundingClientRect();
                    groupBounds = angular.element(element[0]).children()[1].getBBox();
                    padding = 20;
                    image = group.children[0];
                    text = group.children[1];

                    var imagegap = text.getBoundingClientRect().width + padding;
                    var textgap = image.getBoundingClientRect().width + padding;
                    var listOfText = [];
                    if (truths >= 2) {
                        rand = Math.floor(Math.random() * 4) + 1;
                        for (var prop in $scope.userOptions.icon_location) {
                        	if($scope.userOptions.icon_location[prop]) {
                        		listOfText.push(prop);
                        	}
                        }
                        var trigger = listOfText[Math.floor(Math.random() * listOfText.length)];
                        switch (trigger) {
							case "text_icon_left": text_icon_left(); break;
							case "text_icon_right": text_icon_right(); break;
							case "text_icon_above": text_icon_above(); break;
							case "text_logo": text_logo(); break;
						}
                    } else {
                    	console.log("fired");
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
                    	trueGroup = image.getBoundingClientRect().width +
                        text.getBoundingClientRect().width + padding;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
						groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        text.setAttribute("x", textgap);
                        console.log(trueGroup)
                    }

                    function text_icon_right() {
                    	trueGroup = image.getBoundingClientRect().width +
                        text.getBoundingClientRect().width + padding;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
						groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        image.setAttribute("x", imagegap);
                        console.log(trueGroup)
                    }

                    function text_icon_above() {
                        trueGroup = groupBounds.width;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
						groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        text.setAttribute("y", 30);
                        image.setAttribute("y", -70);
                        image.setAttribute("x", groupBounds.width / 3);
                        console.log(trueGroup)
                    }

                    function text_logo() {
                        trueGroup = groupBounds.width;
                        groupPosX = (svgBounds.width - trueGroup) / 2;
						groupPosY = (svgBounds.height - groupBounds.height) / 2;
                        image.remove();
                        console.log(trueGroup)
                    }
                    var dx = groupPosX;
                    var dy = groupPosY - groupBounds.y;
                    group.setAttribute("transform", "translate(" + dx + "," + dy + ")");
                }, 1000);
            });
        }
    };
});
