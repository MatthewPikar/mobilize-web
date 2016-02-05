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

/*        $scope.DATETIME_TEMPLATE = {
            days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
            dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
            minutes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,
                31, 32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
            hours: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
        }
*/
        function Datetime(value, offset) {
            this._datetime = new Date((value ? value : Date.now()) + (offset ? offset : 0))
        }
        (function(){
            this.DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            this.MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

            var month, day, year

            this.set =  function(value, offset){
                this._datetime.setTime((value ? value : Date.now()) + (offset ? offset : 0))
            }
            this.get =  function () { return this._datetime.toISOString() }

            Object.defineProperties(this, {
                'day':{'get': function () {return this.DAYS[this._datetime.getDay()]}},
                'month': {
                    'get': function () {return this.MONTHS[this._datetime.getMonth()]},
                    'set': function (month) {
                        for (var i= 0; i<12; i++){
                            if (this.MONTHS[i].toLowerCase() === month.toLowerCase()) {
                                this._datetime.setMonth(i)
                                break
                            }
                        }}
                },
                'date': {
                    'get': function () {return this._datetime.getDate()},
                    'set': function (date) {this._datetime.setDate(date)}
                },
                'suffix':{'get': function () {
                    var date = this._datetime.getDate()
                    switch (date){
                        case 1: return 'st'
                        case 2: return 'nd'
                        case 3: return 'rd'
                        default: return 'th'
                    }
                }},
                'year': {
                    'get': function () {return this._datetime.getFullYear()},
                    'set': function (year) {this._datetime.setYear(year)}
                },
                'hours': {
                    'get': function () {return this._datetime.getHours()},
                    'set': function (hours) { this._datetime.setHours(hours)}
                },
                'minutes': {
                    'get': function () {return this._datetime.getMinutes()},
                    'set': function (minutes) { this._datetime.setMinutes(minutes)}
                }
            })
        }).call(Datetime.prototype)

/*
        $scope.datetime = {
            day: '',
            month: '',
            date: '',
            suffix: 'th',
            year: '',
            hour: 0,
            minute: 0,
            get: function (){
                var month = month ? $scope.datetime.month : 0
                for (var i= 0; i<12; i++){
                    if ($scope.DATETIME_TEMPLATE.months[i].toLowerCase() === $scope.datetime.month.toLowerCase()) {
                        month = i
                        break
                    }
                }
                return new Date($scope.datetime.year, month, $scope.datetime.date,
                                $scope.datetime.hour, $scope.datetime.minute).toString()
            },
            set: function(value, offset){
                var date = new Date( (value ? value : Date.now()) + (offset ? offset : 0) )

                $scope.datetime.day = $scope.DATETIME_TEMPLATE.days[date.getDay()]
                $scope.datetime.date = date.getDate()
                $scope.datetime.month = $scope.DATETIME_TEMPLATE.months[date.getMonth()]
                $scope.datetime.year = date.getFullYear()
                $scope.datetime.hour = date.getHours()
                $scope.datetime.minute = date.getMinutes()

                $scope.datetime.suffix = $scope.datetime.date === '1' ? 'st' :
                                         $scope.datetime.date === '2' ? 'nd' :
                                         $scope.datetime.date === '3' ? 'rd' : 'th'
            }
        }
        $scope.$watch ('[datetime.date,datetime.month,datetime.year]', function(newValue, oldValue){
            if (newValue[0] !== oldValue[0]) {
                $scope.datetime.suffix = $scope.datetime.date === '1' ? 'st' :
                                         $scope.datetime.date === '2' ? 'nd' :
                                         $scope.datetime.date === '3' ? 'rd' : 'th'
            }
            if ((newValue[0] !== oldValue[0]) || (newValue[1] !== oldValue[1]) || (newValue[2] !== oldValue[2])) {
                var month = false
                for (var i= 0; i<12; i++){
                    if ($scope.DATETIME_TEMPLATE.months[i].toLowerCase() === $scope.datetime.month.toLowerCase()) {
                        month = i
                        break
                    }
                }

                if(month) {
                    var date = new Date($scope.datetime.year, month, $scope.datetime.date)

                    if (isNaN(date.valueOf())){
                        $scope.datetime.day = ''
                    }
                    else {
                        $scope.datetime.day = $scope.DATETIME_TEMPLATE.days[date.getDay()]
                        $scope.event.date = $scope.datetime.get()
                    }

                }
            }
        }, true)
*/
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
        $scope.saveEvent = function () {
            $scope.event.date = $scope.date.get()
            $scope.event.$save()
                .then(function(response){
                    angular.extend($scope.event, response)
                })
                .catch(function(error){
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