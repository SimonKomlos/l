angular.module('MainController', [
        'MainService',
        'MainDirective',
    ])
    .controller('MainCtrl', function($scope, $http, Main) {

    	var self = this;

    	self.serif =
       	self.sansserif =
       	self.vintage =
       	self.retro =
       	self.handwritten =
       	self.clean =
       	self.quirky =
       	self.bodacious =
       	self.future =
       	self.elegant =
       	self.mono = 
       	self.textlogo = 
       	self.texticonlogo = 
       	self.texticonleft = 
       	self.texticonabove = 
       	self.texticonright = false;
    	
    	self.fonts = {
    		serif: ["Slabo 27px", "Merriweather", "PT Serif", "Roboto Slab"],
    		sans_serif: ["Roboto", "Open Sans", "Lato"],
    		retro: ["Fredoka One"],
    		quirky: ["Bangers"]
    	}

    	self.userRequestedFonts = [];
		self.fontList = [];
        //Main GET. (main-service.js)
        self.getIcons = function(icon) {
        	$scope.userOptions = { preferred_type: {
        		serif: self.serif,
        		sans_serif: self.sansserif,
        		vintage: self.vintage,
        		retro: self.retro,
        		handwritten: self.handwritten,
        		clean: self.clean,
        		quirky: self.quirky,
        		bodacious: self.bodacious,
        		future: self.future,
        		elegant: self.elegant,
        		mono: self.mono
        	},
        		icon_location: {
        			text_icon_left: self.texticonleft,
        			text_icon_above: self.texticonabove,
        			text_icon_right: self.texticonright,
        			text_logo: self.textlogo,
        		}
        	};
        	for (var key in $scope.userOptions.preferred_type) {
			    if($scope.userOptions.preferred_type[key] === true) {
			    	self.userRequestedFonts = self.userRequestedFonts.concat(self.fonts[key])
			    }
			}
        	for (var i = 0; i < self.userRequestedFonts.length; i++) {
        		self.fontList.push(self.userRequestedFonts[i].split(' ').join('+'));
        	};

        	console.log(self.fontList)
        	console.log(self.userRequestedFonts);
        	// console.log(icon)
        	// Main.get(icon)
         //    .success(function(data) {
         //    	console.log(data);
         //        self.icons = data.icons;
         //    }).error(function(data) {
         //        console.log(data);
         //    });
        }
       
    });
