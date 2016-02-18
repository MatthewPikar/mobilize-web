(function () { "use strict"

function capitalize (input) {
    var output = []
    if (input) {
        var words = input.split(' ')

        for (var w= 0, len=words.length; w<len; w++){
            output[w] = words[w].charAt(0).toUpperCase() + words[w].substr(1)
        }
    }
    return output.join(' ')
}

var filters = angular.module('filters',[])

filters.filter('capitalize', function () { return capitalize })

}) ()