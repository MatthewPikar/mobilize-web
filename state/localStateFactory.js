(function () { "use strict"

angular.module('localStateFactory',[]).factory('LocalState', [
    function stateFactory(){
        function State (zones){
            this._zones = {}
            for(var z= 0, len=zones.length; z<len; z++){ this._zones[zones[z]] = false }
        }
        (function () {
            this.off = function () {
                for (var zone in this._zones)
                    if (this._zones.hasOwnProperty(zone)) this._zones[zone] = false
            }
            this.toggle = function (zone) {
                this._zones[zone] = !this._zones[zone]
            }
            this.set = function (zone) {
                var currentState = this._zones[zone]
                this.off()
                this._zones[zone] = !currentState
            }
            this.get = function (state){ return this._zones[state] }
        }).call(State.prototype)

        return State
}])

}) ()