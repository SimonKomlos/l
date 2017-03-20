angular.module('MainController', [
        'MainService',
        'MainDirective',
        'ngSanitize'
    ])
    .controller('MainCtrl', function($scope, $http, Main, $sce, $mdDialog) {

        //Declaration of variables
        var self = this;

        self.serif =
            self.sansserif =
            self.retro =
            self.handwritten =
            self.quirky =
            self.bodacious =
            self.future =
            self.elegant =
            self.textlogo =
            self.texticonlogo =
            self.texticonleft =
            self.texticonabove =
            self.texticonright = false;

        $scope.preColors = false;
        self.iconObject = [];
        self.logoCount = 1;
        self.logoBg = "#234567";
        self.logoText = "#fff";
        $scope.backgroundColor;
        $scope.textColor;
        self.storedValues = [];

        self.noEmotion = [];
        self.ehEmotion = [];
        self.loveEmotion = [];
        self.perfectEmotion = [];

        //Set Font Arrays
        self.fonts = {
            serif: ["Serif"],
            sans_serif: ["Sans Serif"],
            retro: ["Retro"],
            handwritten: ["Handwritten"],
            quirky: ["Quirky"],
            bodacious: ["Bodacious"],
            future: ["Future"],
            elegant: ["Elegant"]
        }

        self.stepCount = 1;

        //Continue to next step function
        self.continue = function(companyName, companySlogan) {
            if (self.stepCount <= 4) {
                self.stepCount++;
            }

            //Generate Logos
            if (self.stepCount == 3) {
                self.getFonts("hello");
                for (var i = 0; i < self.iconObject.length; i++) {
                    self.iconSVG(self.iconObject[i], i)
                }
            } else if (self.stepCount == 4) {
                $scope.settings = [
                    { name: companyName, icon: 'format_color_text', id: 'layerCompany' },
                    { name: 'Background', icon: 'texture', id: 'layerBackground' }
                ];
                setTimeout(function() {
                    var item = angular.element(document.querySelector('.confirmedLogo')).children()[0];
                    var group = angular.element(item).children()[1];
                    var image = group.children[0];
                    var slogan = group.children[2];
                    if (angular.element(item).children()[2] != undefined) {
                        var monogram = angular.element(item).children()[2];
                        var monoText = monogram.children[0].children[1];
                        if (monoText.innerHTML != "") {
                            $scope.settings.push({ name: 'Monogram', icon: 'network_wifi', id: 'layerMonogram' });
                        }
                    }

                    if (slogan.innerHTML != "") {
                        $scope.settings.push({ name: companySlogan, icon: 'text_format', id: 'layerSlogan' });
                    }
                    setTimeout(function() {
                        if (angular.element(document.querySelector('.svgList'))[0].childElementCount > 0) {
                            $scope.settings.push({ name: 'Image', icon: 'network_wifi', id: 'layerImage' });
                            $scope.$apply();
                        }
                    }, 400);
                    for (var i = 0; i < $scope.settings.length; i++) {
                        self.storedValues.push({})
                    }
                    self.editRow('type');
                }), 210
            };
        }

        //Back 1 step
        self.back = function() {
            if (self.stepCount > 1) {
                self.stepCount--;
            }
        }

        //Get information from user selected info
        self.typefaceSelected = function(event) {
            $(event.target).parent().toggleClass('checked');
            $scope.userOptions = {
                preferred_type: {
                    serif: self.serif,
                    sans_serif: self.sansserif,
                    retro: self.retro,
                    handwritten: self.handwritten,
                    quirky: self.quirky,
                    bodacious: self.bodacious,
                    future: self.future,
                    elegant: self.elegant
                },
                icon_location: {
                    text_icon_left: self.texticonleft,
                    text_icon_above: self.texticonabove,
                    text_icon_right: self.texticonright,
                    text_logo: self.textlogo,
                    text_icon_logo: self.texticonlogo
                }
            };
        }

        self.userRequestedFonts = [];
        self.fontList = [];
        //Main GET. (main-service.js)
        self.getFonts = function(icon) {
            $scope.userOptions = {
                preferred_type: {
                    serif: self.serif,
                    sans_serif: self.sansserif,
                    retro: self.retro,
                    handwritten: self.handwritten,
                    quirky: self.quirky,
                    bodacious: self.bodacious,
                    future: self.future,
                    elegant: self.elegant
                },
                icon_location: {
                    text_icon_left: self.texticonleft,
                    text_icon_above: self.texticonabove,
                    text_icon_right: self.texticonright,
                    text_logo: self.textlogo,
                    text_icon_logo: self.texticonlogo
                }
            };
            for (var key in $scope.userOptions.preferred_type) {
                if ($scope.userOptions.preferred_type[key] === true) {
                    self.userRequestedFonts = self.userRequestedFonts.concat(self.fonts[key])
                }
            }
            for (var i = 0; i < self.userRequestedFonts.length; i++) {
                // self.fontList.push(self.userRequestedFonts[i].split(' ').join('+'));
                Main.fonts('../../../../fonts/' + self.userRequestedFonts[i])
                    .success(function(data) {
                        var dir = $(data)[1].innerHTML;
                        dir = dir.substr(dir.lastIndexOf('/') + 1);
                        $(data).find("a:contains(.)").each(function() {
                            var fam = $(this).attr('href').split('.')[0];
                            self.fontList.push({ family: fam, url: 'http://localhost/Logo%20Maker/fonts/' + dir + '/' + $(this).attr('href') });
                        });
                        shuffle(self.fontList);

                        function shuffle(a) {
                            var j, x, i;
                            for (i = a.length; i; i--) {
                                j = Math.floor(Math.random() * i);
                                x = a[i - 1];
                                a[i - 1] = a[j];
                                a[j] = x;
                            }
                        }
                    }).error(function(data) {
                        console.log(data);
                    });
            };
        }

        self.searchIcons = function(icon) {
            Main.get(icon)
                .success(function(data) {
                    self.icons = data.icons;
                }).error(function(data) {
                    console.log(data);
                });
        }

        self.iconSelected = function(icon) {
            if (self.iconObject.indexOf(icon) == -1) {
                self.iconObject.push(icon);
            }
        }

        self.iconSVG = function(icon, id) {
            Main.svgs(icon.icon_url)
                .success(function(data) {
                    var parser = new DOMParser();
                    svgDetails = parser.parseFromString(data, "text/xml");
                    svgDetails.documentElement.setAttribute("height", "50px");
                    svgDetails.documentElement.setAttribute("width", "50px");
                    svgDetails.documentElement.setAttribute("id", "svg" + id);
                    angular.element(document.querySelector('.svgList')).prepend(svgDetails.documentElement);
                }).error(function(data) {
                    console.log(data);
                });
        }

        self.removeIconSelected = function(icon) {
            var index = self.iconObject.indexOf(icon);
            if (index > -1) {
                self.iconObject.splice(index, 1);
            }
        }

        self.emotionNo = function(logo) {
            self.noEmotion.push(document.querySelector('.logo' + logo + ' svg').outerHTML);
        }
        self.emotionEh = function(logo) {
            self.ehEmotion.push(angular.element(document.querySelector('.logo' + logo)));
        }
        self.emotionLove = function(logo) {
            self.loveEmotion.push(angular.element(document.querySelector('.logo' + logo)));
        }
        self.emotionPerfect = function(logo) {
            self.perfectEmotion.push(document.querySelector('.logo' + logo + ' svg').outerHTML);
        }

        self.toHTML = function(logo) {
            return $sce.trustAsHtml(logo);
        }

        self.initials = function(string) {
            var matches = string.match(/\b(\w)/g);
            return matches.join('');
        }

        self.center = function() {
            setTimeout(function() {

                if (angular.element(document.querySelector('.svgList')).children().length <= 0) {
                    for (var i = 0; i < self.iconObject.length; i++) {
                        self.iconSVG(self.iconObject[i], i)
                    }
                }

                var item = angular.element(document.querySelector('.confirmedLogo')).children()[0];
                var svg = angular.element(item).children()[0];
                var group = angular.element(item).children()[1];
                var svgBounds = svg.getBBox();
                var groupBounds = group.getBBox();
                var padding = 20;

                var type = item.attributes['type'].value;

                var image = group.children[0];
                var text = group.children[1];
                var slogan = group.children[2];
                var textWidth = text.getBBox().width;
                var imageWidth = image.getBBox().width;

                var imageX = image.getBBox().x;
                var textX = text.getBBox().x;
                var imagegap = textWidth + padding;
                var textgap = imageWidth + padding;

                var trueGroup = groupBounds.width;
                var groupPosY = ((svgBounds.height - groupBounds.height) / 2);
                var groupPosX = (svgBounds.width - trueGroup) / 2;
                var dx = groupPosX;
                var dy = groupPosY - groupBounds.y;
                if (angular.element(item).children().length > 2) {
                    var monogram = angular.element(item).children()[2];
                    var monoText = monogram.children[0].children[1];
                    var monox = (svgBounds.width - monogram.getBBox().width) / 2;
                    monogram.setAttribute("transform", "translate(" + monox + "," + ((groupPosY - groupBounds.y) - 80) + ")");
                    monoText.setAttribute("x", 17);
                }

                if (type == "text_icon_left") {
                    trueGroup = textgap + textWidth + imageWidth;
                    groupPosX = (svgBounds.width - trueGroup) / 2;
                    groupPosY = ((svgBounds.height - groupBounds.height) / 2) - groupBounds.height / 3
                    text.setAttribute("x", textgap);
                } else if (type == "text_icon_right") {
                    trueGroup = textgap + textWidth + imageWidth;
                    groupPosX = (svgBounds.width - trueGroup) / 2;
                    groupPosY = ((svgBounds.height - groupBounds.height) / 2) - groupBounds.height / 3
                    image.setAttribute("x", imagegap);
                } else if (type == "text_icon_above") {
                    trueGroup = groupBounds.width;
                    groupPosX = (svgBounds.width - trueGroup) / 2;
                    groupPosY = (svgBounds.height - groupBounds.height) / 2;
                    image.setAttribute("x", ((groupBounds.width - imageWidth) / 2));
                }

                text.setAttribute("x", (groupBounds.width - textWidth) / 2);
                group.setAttribute("transform", "translate(" + dx + "," + dy + ")");
                slogan.setAttribute("x", ((trueGroup - slogan.getBBox().width) / 2));
            }, 200);
        }

        self.editUpdate = function(ev, layerItem) {
            var item = document.getElementById(layerItem);
            var activeNum = 0;
            for (var i = 0; i < $scope.settings.length; i++) {
                if ($scope.settings[i].id == self.activeId) {
                    activeNum = i;
                }
            }

            if (ev === "kerning") {
                item.style.letterSpacing = self.kerning;
                self.storedValues[activeNum].kerning = self.kerning;
            }
            if (ev === "fontsize") {
                item.setAttribute('font-size', self.fontsize);
                self.storedValues[activeNum].fontsize = self.fontsize;
            }
            if (ev === "text") {
                item.innerHTML = self.text;
                self.storedValues[activeNum].text = self.text;
            }
            if (ev === "xLoc") {
                // if(item.getAttribute('x') == 0) {
                item.setAttribute('x', self.xLoc);
                // }
                self.storedValues[activeNum].xLoc = self.xLoc;
            }
            if (ev === "yLoc") {
                // if(item.getAttribute('x') == 0) {
                item.setAttribute('y', self.yLoc);
                // }
                self.storedValues[activeNum].yLoc = self.yLoc;
            }
            // self.center();
        }

        self.setActiveLayer = function(event, id) {
            $(".layerItem").removeClass("setActiveLayer");
            $(event.path[2]).addClass('setActiveLayer');

            var activeNum = 0;
            for (var i = 0; i < $scope.settings.length; i++) {
                if ($scope.settings[i].id == id) {
                    activeNum = i;
                }
            }

            self.kerning = self.storedValues[activeNum].kerning;
            self.xLoc = self.storedValues[activeNum].xLoc;
            self.yLoc = self.storedValues[activeNum].yLoc;
            self.fontsize = self.storedValues[activeNum].fontsize;
            self.text = self.storedValues[activeNum].text;

            self.activateLayer(id);
        }

        self.activateLayer = function(id) {
            //Default "Company" active
            if (id == undefined || id == "layerCompany") {
                self.activeItem = "Company Name";
                self.activeId = "layerCompany";
                self.activeLayerId = "companyNameText";
            } else if (id == "layerBackground") {
                self.activeItem = "Background";
                self.activeId = id;
            } else if (id == "layerSlogan") {
                self.activeItem = "Slogan";
                self.activeLayerId = "companySloganText";
                self.activeId = id;
            } else if (id == "layerImage") {
                self.activeItem = "Icon";
                self.activeId = id;
            } else if (id == "layerMonogram") {
                self.activeItem = "Monogram";
                self.activeLayerId = "companyMonoText";
                self.activeId = id;
            }
        }
        self.activateLayer();

        self.LightenDarkenColor = function(col, amt) {
            var usePound = false;
            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }
            var num = parseInt(col, 16);
            var r = (num >> 16) + amt;
            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            var b = ((num >> 8) & 0x00FF) + amt;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;
            var g = (num & 0x0000FF) + amt;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
        }

        self.showLogos = function(ev) {
            $mdDialog.show({
                templateUrl: 'showLogos.html',
                controller: 'MainCtrl',
                controllerAs: 'ctrl',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    noEmotion: self.noEmotion,
                    toHTML: self.toHTML
                }
            });
        };
        var MainCtrl = function($scope, noEmotion, toHTML) {
            $scope.noEmotion = noEmotion;
            $scope.toHTML = toHTML;
        }

        self.editRow = function(item) {
            var upper = item.charAt(0).toUpperCase() + item.slice(1);
            $('.editBtn').removeClass('selected');
            $('#editRow' + upper).addClass('selected');
            console.log($('#editRow' + upper));
            self.editRowItem = item;
        }

    });
