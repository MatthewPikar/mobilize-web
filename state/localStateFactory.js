(function () { "use strict"

angular.module('localStateFactory',[]).factory('LocalState', [
    function stateFactory(){
        function State (states){
            this._states = {}
            for(var z= 0, len=states.length; z<len; z++){ this._states[states[z]] = false }
        }
        (function () {
            this.reset = function () {
                for (var zone in this._states)
                    if (this._states.hasOwnProperty(zone)) this._states[zone] = false
            }
            this.toggle = function (zone) {
                this._states[zone] = !this._states[zone]
            }
            this.set = function (newState) {
                var splitNewState = newState.split('.')

                for (var state in this._states) { if (this._states.hasOwnProperty(state)) {
                    var splitState = state.split('.')

                    // disable unless target or target's parent
                    if (splitNewState.length === 1)
                        if ( (splitState.length === 1) && (splitNewState[0] === splitState[0]) )
                            this._states[state] = !this._states[state]
                        else this._states[state] = false
                    else {
                        if ( (splitState.length === 2) && (splitNewState[1] === splitState[1]) )
                            this._states[state] = !this._states[state]
                        else if ( (splitState.length === 1) && (splitNewState[0] === splitState[0]) )
                            this._states[state] = this._states[state]
                        else this._states[state] = false
                    }
                }}
            }
            this.get = function (state){ return this._states[state] }
        }).call(State.prototype)

        return State
}])

}) ()