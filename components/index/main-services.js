angular.module('MainService', [])
    .factory('Main', function ($http) {
        return {
            get: function (query) {
                return $http.get('http://localhost/Logo%20Maker/php/noun.php?query='+query);
            }
        }
    });
