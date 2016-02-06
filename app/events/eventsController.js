'use strict'

var eventsController = angular.module('eventsController', [])

eventsController.controller('eventsController', ['$scope', '$stateParams', '$state', 'Event',
    function($scope, $stateParams, $state, Event) {
        // State flow
        var state = {
            _zones: { description:false, date:false},
            _active: false,
            off: function() {
                for (var zone in $scope.state._zones)
                    if ($scope.state._zones.hasOwnProperty(zone)) $scope.state._zones[zone] = false
            },
            setActive: function(state){
                if (state === true) $scope.state._active = true
                else if (state === false) {
                    $scope.state.off()
                    $scope.state._active = false
                    $scope.modifyMovement()
                }
            },
            active: function(){
                return $scope.state._active
            },
            set: function(zone) {
                var currentState = $scope.state._zones[zone]
                $scope.state.off()
                $scope.state._zones[zone] = !currentState
                if (zone === 'video' && $scope.state._zones[zone] === true) $scope.openVideoModal()
                else if (zone === 'image'  && $scope.state._zones[zone] === true) $scope.openImageModal()
            },
            get:  function(state){ return $scope.state._zones[state] }
        }
        $scope.state = state

        function Datetime(value, offset) {
            this._datetime = new Date()
            this.set(value, offset)
            //this._datetime = new Date((value ? value : Date.now()) + (offset ? offset : 0))
        }
        (function(){
            this.DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            this.MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

            this.DATES = []
            for (var d=1; d<=31; d++){ this.DATES.push(d) }

            this.YEARS = []
            var now = new Date(Date.now())
            for (var y=now.getFullYear(); y<=(now.getFullYear()+10); y++){ this.YEARS.push(y) }

            var month, date, year, monthError=false, dateError=false, yearError=false

            this.set =  function(value, offset){
                this._datetime.setTime((value ? value : Date.now()) + (offset ? offset : 0))
                year = this._datetime.getFullYear()
                month = this.MONTHS[this._datetime.getMonth()]
                date = this._datetime.getDate()
            }
            this.get =  function () {
                if(!month || !date || !year || monthError || dateError || yearError) return ''
                else return this._datetime.toISOString()
            }

            Object.defineProperties(this, {
                day:{get: function () {return this.DAYS[this._datetime.getDay()]}},
                month: {
                    get: function () {return month},
                    set: function (newMonth) {
                        if (newMonth === '') monthError=false
                        else monthError=true

                        for (var i= 0; i<12; i++){
                            if (this.MONTHS[i].toLowerCase() === newMonth.toLowerCase()) {
                                this._datetime.setMonth(i)
                                monthError=false
                                break
                            }
                        }
                        month = newMonth
                    }
                },
                monthError:{get:function(){return monthError}},
                date: {
                    get: function () {return date},
                    set: function (newDate) {
                        if (!newDate) dateError=false
                        else dateError=true

                        if ((newDate > 0) && (newDate <= 31)) {
                            this._datetime.setDate(newDate)
                            dateError = false
                        }
                        date = newDate
                    }
                },
                dateError:{get:function(){return dateError}},
                suffix:{get: function () {
                    var date = this._datetime.getDate()
                    switch (date){
                        case 1: return 'st'
                        case 2: return 'nd'
                        case 3: return 'rd'
                        default: return 'th'
                    }
                }},
                year: {
                    get: function () {return year},
                    set: function (newYear) {
                        if (!newYear) yearError=false
                        else yearError=true

                        if ((newYear > 1900) && (newYear < 2100)) {
                            this._datetime.setYear(newYear)
                            yearError = false
                        }
                        year = newYear
                    }
                },
                yearError:{get:function(){return yearError}},
                hours: {
                    get: function () {return this._datetime.getHours()},
                    set: function (hours) { this._datetime.setHours(hours)}
                },
                minutes: {
                    get: function () {return this._datetime.getMinutes()},
                    set: function (minutes) { this._datetime.setMinutes(minutes)}
                }
            })
        }).call(Datetime.prototype)

        // Initialization
        if ($stateParams.eventId) {
            Event.get({id: $stateParams.eventId}).$promise
                .then(function (response) {
                    angular.extend($scope.event, response)
                    //$scope.datetime.set($scope.event.date)
                    //$scope.event.date = $scope.datetime.get()
                    $scope.date = new Datetime($scope.event.date)
                    state.setActive(false)
                }).catch(function(error){ $scope.error = error })
        }
        else {
            $scope.event = new Event()
            //$scope.datetime.set(2 * 7 * 24 * 60 * 60 * 1000) //set date two weeks from now
            //$scope.event.date = $scope.datetime.get()
            $scope.date = new Datetime(null,2 * 7 * 24 * 60 * 60 * 1000)
            state.setActive(true)
        }

        // Resource Control
        $scope.addEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.sourceId = $stateParams.movementId
            $scope.event.$add()
                .then(function(response){
                    angular.extend($scope.event, response)
                    $scope.go('movement.overview',{movementId:$stateParams.movementId})
                })
                .catch(function(error){
                    console.log(error)
                    $scope.error = error
                })
        }

        $scope.modifyEvent = function () {
            $scope.event.$modify()
                .then(function(response){
                    angular.extend($scope.event, response)
                })
                .catch(function(error){
                    $scope.error = error
                })
        }

        $scope.deleteEvent = function () {
            $scope.event.$remove()
                .then(function(response){
                    return true
                })
                .catch(function(error){
                    $scope.error = error
                })
        }


        // Navigation
        $scope.go = function(state){
            $state.go(state)
        }
    }])