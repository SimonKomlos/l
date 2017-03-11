angular.module('MainService', [])
    .factory('Main', function ($http) {
        return {
            get: function (query) {
                return $http.get('http://localhost/Logo%20Maker/landing/app/php/noun.php?query='+query);
            },
            fonts: function (url) {
            	return $http.get(url);
            },
            svgs: function (url) {
            	return $http.get(url);
            }
        }
    });
